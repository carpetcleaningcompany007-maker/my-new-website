// Exercise the real shared form handler with a mocked CRM, never a live enquiry.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const handlerSource = fs.readFileSync(path.join(root, 'assets/homepage-integration.js'), 'utf8');
const page = fs.readFileSync(path.join(root, 'pages/landing-shrewsbury.html'), 'utf8');
const bundle = fs.readFileSync(path.join(root, 'assets/shrewsbury-homepage.js'), 'utf8');
assert(page.includes('data-landing-page="landing-shrewsbury.html" data-landing-area="Shrewsbury"'));
assert(page.includes('rel="canonical" href="https://www.thecarpetcleaningcrew.co.uk/pages/landing-shrewsbury.html"'));
assert(!page.includes('location-landing.js'));
assert(bundle.includes('name:`landing_page`,value:`landing-shrewsbury.html`'));
assert(bundle.includes('name:`landing_area`,value:`Shrewsbury`'));
for (const target of new Set(bundle.match(/\/pages\/[a-z0-9/.-]+\.html/g))) {
  assert(fs.existsSync(path.join(root, target)), `Missing link: ${target}`);
}
const schemaText = page.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
const schema = JSON.parse(schemaText);
assert(schema['@graph'].some(item => item['@type'] === 'Service' && item.areaServed.name === 'Shrewsbury'));

async function checkForm({email = '', phone = '', ok = true}) {
  let handler, sent, redirected, events = [];
  const button = {disabled:false, textContent:'Request My Free Quote'};
  const status = {textContent:''};
  class Form {
    constructor() {
      this.action = 'https://carpet-cleaning-crm.onrender.com/api/website-form';
      this.fields = {first_name:'Test',phone,email,postcode:'SY2',service:'Hard floor cleaning'};
    }
    matches() { return true; }
    querySelector(selector) {
      if (selector === 'button[type="submit"]') return button;
      if (selector === '.status') return status;
      const key = selector.includes('phone') ? 'phone' : 'email';
      return {value:this.fields[key],checkValidity:()=>email.includes('@'),focus(){}};
    }
  }
  class Data extends Map { constructor(form) { super(Object.entries(form.fields)); } }
  const location = {search:'?utm_source=local-test&gclid=mock-click',set href(value){redirected=value;}};
  const context = {
    document:{documentElement:{dataset:{landingPage:'landing-shrewsbury.html',landingArea:'Shrewsbury'}},addEventListener(type,cb){handler=cb;},dispatchEvent(event){events.push(event.type);}},
    HTMLFormElement:Form,FormData:Data,URLSearchParams,Event,
    window:{__websiteAnalyticsSession:'mock-session',gtag(){}},location,
    fetch:async(url,options)=>{sent={url,data:options.body};return {ok,json:async()=>({})};},
    setTimeout:cb=>cb(),
  };
  vm.runInNewContext(handlerSource, context);
  await handler({target:new Form(),preventDefault(){}});
  return {sent,redirected,button,status,events};
}
(async()=>{
  const invalid = await checkForm({});
  assert(!invalid.sent);
  assert(invalid.status.textContent.includes('valid phone number or email'));
  for (const fields of [{email:'test@example.com'},{phone:'07123456789'}]) {
    const result = await checkForm(fields);
    assert.equal(result.sent.data.get('landing_page'),'landing-shrewsbury.html');
    assert.equal(result.sent.data.get('landing_area'),'Shrewsbury');
    assert.equal(result.sent.data.get('service'),'Hard floor cleaning');
    assert.equal(result.sent.data.get('utm_source'),'local-test');
    assert.equal(result.sent.data.get('gclid'),'mock-click');
    assert.equal(result.redirected,'/thank-you.html');
    assert(result.events.includes('analytics:form-submit-success'));
  }
  const failed = await checkForm({phone:'07123456789',ok:false});
  assert(!failed.redirected);
  assert.equal(failed.button.disabled,false);
  assert(failed.status.textContent.includes('not sent'));
  console.log('PASS: local links, schema, contact validation, Shrewsbury attribution, tracking and mocked form success/failure. No CRM requests sent.');
})().catch(error=>{console.error(error);process.exitCode=1;});
