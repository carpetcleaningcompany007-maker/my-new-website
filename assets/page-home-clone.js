(() => {
  const page = document.body.dataset.landing;
  const content = {
    commercial: {
      eyebrow: 'PROFESSIONAL COMMERCIAL CLEANING · SHROPSHIRE',
      heading: 'Commercial and office carpet cleaning',
      lead: 'Professional carpet cleaning for offices, hotels, managed buildings and customer-facing spaces across Shropshire and surrounding areas.',
      area: 'Commercial carpet cleaning',
      hero: '/assets/img/commercial-carpet-cleaning.webp',
      section: 'Professional care for every commercial space',
      cards: ['Office carpet cleaning', 'Hotel carpet and floor cleaning', 'Communal spaces and reception areas']
    },
    shrewsbury: {
      eyebrow: 'PROFESSIONAL LOCAL CLEANING · SHREWSBURY',
      heading: 'Carpet cleaning in Shrewsbury',
      lead: 'Professional carpet, upholstery and hard-floor cleaning for homes and businesses across Shrewsbury, with honest advice and a clear quotation.',
      area: 'Shrewsbury',
      hero: '/assets/img/professional-cleaning-hero.png',
      section: 'Professional care for every Shrewsbury home and business',
      cards: []
    },
    telford: {
      eyebrow: 'PROFESSIONAL LOCAL CLEANING · TELFORD',
      heading: 'Carpet cleaning in Telford',
      lead: 'Professional carpet, upholstery and hard-floor cleaning for homes and businesses across Telford, with honest advice and a clear quotation.',
      area: 'Telford',
      hero: '/assets/img/professional-cleaning-hero.png',
      section: 'Professional care for every Telford home and business',
      cards: []
    }
  }[page];
  if (!content) return;
  const style = document.createElement('style');
  style.textContent = 'body[data-landing] .hero h1 em{color:#f7c548!important;-webkit-text-fill-color:#f7c548!important;opacity:1!important}body[data-landing] .hero h1{color:#fff!important}body[data-landing] .hero .hero-copy>p{color:#f4f8ff!important}';
  document.head.appendChild(style);
  const apply = () => {
    const hero = document.querySelector('.hero');
    const title = hero?.querySelector('h1');
    if (!hero || !title) return false;
    const kicker = hero.querySelector('.eyebrow, .kicker');
    if (kicker) kicker.textContent = content.eyebrow;
    title.innerHTML = content.heading + '<em>Professional results, planned around your space.</em>';
    const lead = title.parentElement?.querySelector('p');
    if (lead) lead.textContent = content.lead;
    const bg = hero.querySelector('.hero-bg');
    if (bg) bg.style.setProperty('background', "linear-gradient(90deg, rgba(7,24,53,.84), rgba(7,24,53,.62) 48%, rgba(7,24,53,.22)), url('" + content.hero + "') center/cover no-repeat", 'important');
    document.querySelectorAll('form').forEach(form => {
      const pageField = form.querySelector('input[name="landing_page"]');
      const areaField = form.querySelector('input[name="landing_area"]');
      if (pageField) pageField.value = content.area;
      if (areaField) areaField.value = content.area;
    });
    document.querySelectorAll('h2').forEach(h2 => {
      if (h2.textContent.includes('Professional care for every room')) h2.textContent = content.section;
    });
    if (page === 'commercial') {
      const cards = [...document.querySelectorAll('h3')].filter(h3 => ['Carpet cleaning','Upholstery cleaning','Commercial cleaning'].includes(h3.textContent.trim()));
      cards.slice(0, 3).forEach((card, i) => card.textContent = content.cards[i]);
      const cardCopy = [
        'Professional carpet and floor cleaning for offices, meeting rooms and workspaces.',
        'Commercial carpet and floor cleaning for hotels, reception areas and managed buildings.',
        'Professional cleaning for communal carpets, corridors, entrances and customer-facing spaces.'
      ];
      const imageSources = [
        '/assets/img/commercial-carpet-cleaning.webp',
        '/assets/img/home-commercial-carpet-cleaning.webp',
        '/assets/img/commercial-carpet-cleaning.webp'
      ];
      cards.slice(0, 3).forEach((card, index) => {
        const copy = card.parentElement?.querySelector('p');
        if (copy) copy.textContent = cardCopy[index];
      });
      [...document.querySelectorAll('img[alt="Carpet cleaning"], img[alt="Upholstery cleaning"], img[alt="Commercial cleaning"]')].forEach((image, index) => {
        image.src = imageSources[index];
        image.alt = content.cards[index];
      });
      const replacements = new Map([
        ['Affordable, Great Value For Money Carpet Cleaning', 'Commercial cleaning planned around your workplace'],
        ['Our quotations are transparent and competitive. There are no hidden fees. We agree the price before booking.', 'We arrange a practical scope of work around access, opening hours and the areas that matter most to your team and visitors.'],
        ['Deep, Thorough Cleaning Every Time', 'A clean, professional finish for your workplace'],
        ['Our professional equipment cleans deep into the fibres, extracting grit, dirt and stubborn soiling.', 'Professional equipment and careful planning help maintain a cleaner, more welcoming environment for staff, customers and visitors.'],
        ['Ready for carpets that feel beautifully refreshed?', 'Ready for a cleaner, more presentable workplace?'],
        ['Tell Paul what you would like cleaned and receive a clear, no-obligation quotation.', 'Tell Paul about your building and receive practical advice with a clear, no-obligation quotation.']
      ]);
      document.querySelectorAll('h2, p').forEach(el => {
        const next = replacements.get(el.textContent.trim());
        if (next) el.textContent = next;
      });
    }
    return true;
  };
  let attempts = 0;
  const timer = setInterval(() => { if (apply() || ++attempts > 30) clearInterval(timer); }, 100);
})();