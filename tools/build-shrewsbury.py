from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
source = (root / 'assets/index-BE8rSa1J.js').read_text(encoding='utf-8')
changes = {
    'Fast & Affordable Carpet and Upholstery Cleaning in Ludlow, Shrewsbury and Surrounding Areas': 'Fast and affordable carpet, upholstery and hard floor cleaning in Shrewsbury',
    'Professional carpet cleaning that safely and effectively removes dirt, stains and odours, leaving your carpets smelling fresh and looking beautifully revived.': 'Freshen tired carpets, care for your sofas and bring hard floors back to their best. Get practical advice and a clear quote for your Shrewsbury home, rental property or workplace.',
    'Ludlow & Shrewsbury carpet care': 'Carpet and floor care in Shrewsbury',
    'Professional carpet care across Ludlow, Shrewsbury and surrounding areas': 'Carpet, upholstery and hard floor care across Shrewsbury',
    'Professional local cleaning · Ludlow & Shrewsbury': 'Professional local cleaning · Shrewsbury',
    'Get Your Free, No-Obligation Quote': 'Get your Shrewsbury cleaning quote',
    'Tell Paul what needs cleaning and he will personally contact you with friendly advice and a clear quotation.': 'Share your postcode and the cleaning you need. Paul will reply personally with advice, availability and a no-obligation quotation.',
    'Professional care for every room': 'The right care for carpets, furniture and floors',
    'Deep cleaning that lifts dirt, stains and restores your carpets properly.': 'Lift embedded dirt from rooms, stairs and busy walkways with a professional carpet clean.',
    'Sofas, chairs and fabrics cleaned safely with powerful results.': 'Refresh sofas, armchairs and dining chairs with cleaning suited to the fabric.',
    'Professional carpet and floor care for hotels, offices and managed properties.': 'Discuss carpet and floor cleaning for Shrewsbury offices, hospitality premises and managed properties.',
    'Specialist cleaning that lifts embedded soil while caring for delicate rug fibres.': 'Get advice on cleaning your rug, with attention to its fibres, condition and construction.',
    'Targeted professional treatment for stubborn marks, spills and unwanted odours.': 'Ask about targeted treatment for spills, pet marks and odours; results depend on the material and stain.',
    'Deep cleaning for tiled and hard floors to remove ingrained dirt and restore the finish.': 'Remove built-up dirt from hard floors, tiles and grout using a method suited to the surface.',
    'Affordable, Great Value For Money Carpet Cleaning': 'Choose the level of carpet care you need',
    'Our quotations are transparent and competitive. There are no hidden fees. We agree the price before booking.': 'Compare the cleaning options below, then ask for a quote based on your rooms, carpet condition and any additional treatment.',
    'No invented fixed prices: every quotation reflects room sizes, fibre, condition and treatment required.': 'Your quotation takes account of room sizes, carpet fibres, condition and the work required. The price is agreed before booking.',
    'Deep, Thorough Cleaning Every Time': 'Help with everyday dirt, spills and odours',
    'Our professional equipment cleans deep into the fibres, extracting grit, dirt and stubborn soiling.': 'Tell us about any problem areas when you enquire, so we can advise on a suitable approach for your carpets, upholstery or flooring.',
    'Our customer before & afters': 'See the difference professional cleaning can make',
    'Real photographs from genuine cleaning jobs—never stock comparisons or artificially enhanced results.': 'Examples from our own cleaning work. Every carpet is different, so we assess its condition before recommending a treatment.',
    'Discuss Carpet Cleaning Needed & Quote': 'Tell us what needs cleaning',
    'Arrive On Time, Say Hello & Get Started': 'Check the material and agree the work',
    'We Leave Your Carpets Looking Like New': 'Clean carefully and discuss aftercare',
    'Get An Instant Carpet Cleaning Quote': 'Speak to Paul about your cleaning',
    'Call For Instant Quote: ': 'Call Paul: ',
    'Punctual, Trustworthy, Quality Carpet Cleaning Services': 'A straightforward clean, from enquiry to finish',
    'Tell us what you need cleaning and when. We explain what the quotation includes and choose a suitable date.': 'Send your Shrewsbury postcode, the rooms or items to clean and any stain concerns. Paul will explain the options and confirm availability.',
    'Paul arrives punctually, confirms the agreed process and price, then professional cleaning begins.': 'We check the material and condition, talk through the work and confirm the agreed price before starting.',
    'Inspection, targeted pre-treatment, agitation and hot-water extraction, followed by a finished result check.': 'The cleaning method is matched to your carpet, upholstery or floor. We check the finished result and advise on aftercare.',
    'Get an honest cleaning quotation': 'Plan your Shrewsbury clean with Paul',
    'Tell Paul what needs cleaning and receive friendly, no-obligation advice about the most suitable process.': 'Have a question about a fabric, floor or stubborn mark? Share the details with Paul before arranging your clean.',
    'Local pages that help customers—and Google—find you.': 'Cleaning across Shrewsbury and nearby areas',
    'The landing-page clarity stays at the top, while dedicated town links restore the useful structure of the full website.': 'We cover Shrewsbury and surrounding neighbourhoods, including Meole Brace, Monkmoor, Belle Vue and Radbrook, as well as nearby Bayston Hill and Condover. Tell us your postcode so we can confirm availability for your address.',
    'Ready for carpets that feel beautifully refreshed?': 'Ready to freshen up your Shrewsbury property?',
    'Tell Paul what you would like cleaned and receive a clear, no-obligation quotation.': 'Ask for a quote for your carpets, upholstery or hard floors. Call, send a WhatsApp message or use the form above.',
    'Ludlow, Shrewsbury and surrounding areas': 'Shrewsbury and surrounding areas',
    'name:`landing_page`,value:`homepage`': 'name:`landing_page`,value:`landing-shrewsbury.html`',
    'name:`landing_area`,value:`Ludlow and Shrewsbury`': 'name:`landing_area`,value:`Shrewsbury`',
}
for old, new in changes.items():
    assert old in source, f'Missing source text: {old}'
    source = source.replace(old, new)

local_services = {
    '/pages/carpet-cleaning.html': '/pages/local/shrewsbury-carpet-cleaning.html',
    '/pages/upholstery-cleaning.html': '/pages/local/shrewsbury-upholstery-cleaning.html',
    '/pages/commercial-carpet-cleaning.html': '/pages/local/shrewsbury-commercial-carpet-cleaning.html',
    '/pages/rug-cleaning.html': '/pages/local/shrewsbury-rug-cleaning.html',
    '/pages/stain-removal.html': '/pages/local/shrewsbury-stain-removal.html',
    '/pages/hard-floor-cleaning.html': '/pages/local/shrewsbury-hard-floor-cleaning.html',
}
# Keep carpet cleaning on the real service page; the old Shrewsbury alias returns here.
local_services.pop('/pages/carpet-cleaning.html')
for old, new in local_services.items():
    source = source.replace(old, new)
areas = [('Meole Brace','meole-brace'), ('Monkmoor','monkmoor'), ('Belle Vue','belle-vue'), ('Radbrook','radbrook'), ('Bayston Hill','bayston-hill'), ('Condover','condover'), ('Atcham','atcham'), ('Bicton','bicton')]
new_areas = 'ge=[' + ','.join(f'[`{name}`,`/pages/local/{slug}.html`]' for name,slug in areas) + ']'
source, count = re.subn(r'ge=\[\[`Ludlow`.*?\]\](?=,A=)', lambda _: new_areas, source)
assert count == 1
(root / 'assets/shrewsbury-homepage.js').write_text(source, encoding='utf-8')

page = (root / 'index.html').read_text(encoding='utf-8')
page = page.replace('<html lang="en-GB">', '<html lang="en-GB" data-landing-page="landing-shrewsbury.html" data-landing-area="Shrewsbury">')
page = page.replace('/assets/index-BE8rSa1J.js?v=navigation-20260928', '/assets/shrewsbury-homepage.js?v=20260928-1')
title = 'Carpet, Upholstery &amp; Hard Floor Cleaning Shrewsbury'
description = 'Fast, affordable carpet, upholstery and hard floor cleaning in Shrewsbury. View genuine results, explore local services and ask Paul for a free quotation.'
page = re.sub(r'<title>.*?</title>', '<title>'+title+' | The Carpet Cleaning Company</title>', page)
page = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m[1]+description, page)
page = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m[1]+title, page)
page = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m[1]+description, page)
url = 'https://www.thecarpetcleaningcrew.co.uk/pages/landing-shrewsbury.html'
page = page.replace('rel="canonical" href="https://www.thecarpetcleaningcrew.co.uk/"', 'rel="canonical" href="'+url+'"')
page = page.replace('property="og:url" content="https://www.thecarpetcleaningcrew.co.uk/"', 'property="og:url" content="'+url+'"')
schema = {
    '@context':'https://schema.org', '@graph':[
        {'@type':'LocalBusiness','@id':'https://www.thecarpetcleaningcrew.co.uk/#business','name':'The Carpet Cleaning Company','url':'https://www.thecarpetcleaningcrew.co.uk/','telephone':'+447802563213','logo':'https://www.thecarpetcleaningcrew.co.uk/assets/img/logo.webp','areaServed':{'@type':'City','name':'Shrewsbury'}},
        {'@type':'WebPage','@id':url+'#webpage','url':url,'name':'Carpet, Upholstery and Hard Floor Cleaning in Shrewsbury','description':description,'about':{'@id':url+'#service'},'breadcrumb':{'@id':url+'#breadcrumb'}},
        {'@type':'Service','@id':url+'#service','url':url,'name':'Carpet, upholstery and hard floor cleaning in Shrewsbury','serviceType':['Carpet cleaning','Upholstery cleaning','Hard floor cleaning'],'provider':{'@id':'https://www.thecarpetcleaningcrew.co.uk/#business'},'areaServed':{'@type':'City','name':'Shrewsbury'}},
        {'@type':'BreadcrumbList','@id':url+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':'https://www.thecarpetcleaningcrew.co.uk/'},{'@type':'ListItem','position':2,'name':'Shrewsbury cleaning','item':url}]}
    ]
}
page = re.sub(r'    <script type="application/ld\+json">.*?</script>\n', '', page, flags=re.S)
page = page.replace('    <link rel="preconnect"', '    <script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>\n    <link rel="stylesheet" href="/assets/shrewsbury-page.css?v=20260928-1">\n    <link rel="preconnect"',1)
# Useful, crawlable first response and no-JavaScript fallback; React replaces this
# with the complete homepage-derived layout when it loads.
fallback = '''<main class="shrewsbury-fallback">
      <a href="/">The Carpet Cleaning Company — Home</a>
      <h1>Fast and affordable carpet, upholstery and hard floor cleaning in Shrewsbury</h1>
      <p>Freshen tired carpets, care for your sofas and bring hard floors back to their best. Get practical advice and a clear quote for your Shrewsbury home, rental property or workplace.</p>
      <p><a href="tel:07802563213">Call Paul: 07802 563213</a> · <a href="https://wa.me/447802563213">WhatsApp Paul</a> · <a href="/pages/contact.html">Ask for a free quotation</a></p>
      <h2>The right care for carpets, furniture and floors</h2>
      <ul><li><a href="/pages/carpet-cleaning.html">Carpet cleaning</a></li><li><a href="/pages/local/shrewsbury-upholstery-cleaning.html">Upholstery cleaning in Shrewsbury</a></li><li><a href="/pages/local/shrewsbury-hard-floor-cleaning.html">Hard floor cleaning in Shrewsbury</a></li><li><a href="/pages/local/shrewsbury-commercial-carpet-cleaning.html">Commercial carpet cleaning</a></li><li><a href="/pages/local/shrewsbury-rug-cleaning.html">Rug cleaning</a></li><li><a href="/pages/local/shrewsbury-stain-removal.html">Stain removal</a></li></ul>
      <h2>Cleaning across Shrewsbury and nearby areas</h2>
      <p>We cover Shrewsbury and surrounding neighbourhoods. Tell us your postcode so we can confirm availability for your address.</p>
      <ul>''' + ''.join(f'<li><a href="/pages/local/{slug}.html">{name}</a></li>' for name,slug in areas) + '''</ul>
      <p><a href="/pages/gallery.html">See our cleaning results</a> · <a href="/pages/reviews.html">Read customer reviews</a> · <a href="/pages/service-areas.html">All service areas</a></p>
    </main>'''
page = page.replace('<div id="root"></div>', '<div id="root">'+fallback+'</div>')
(root / 'pages/landing-shrewsbury.html').write_text(page,encoding='utf-8')
