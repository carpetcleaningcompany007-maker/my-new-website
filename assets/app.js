// === MOBILE_MENU_BUTTON_AND_TOP_LAYER_FIX_20260427B ===
(() => {
  document.querySelectorAll('nav.nav-links').forEach(menu => {
    const header = menu.closest('header') || document.querySelector('header');
    if (!header) return;
    let btn = header.querySelector('.mobile-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mobile-toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
      btn.textContent = 'Menu';
      menu.insertAdjacentElement('beforebegin', btn);
    }
    if (btn.dataset.mobileMenuReady === '1') return;
    btn.dataset.mobileMenuReady = '1';
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      menu.classList.toggle('open', open);
      header.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
// === END MOBILE_MENU_BUTTON_AND_TOP_LAYER_FIX_20260427B ===
// === MOBILE_MENU_BUTTON_INJECT_V1 ===
(() => {
  document.querySelectorAll('nav.nav-links').forEach(menu => {
    const header = menu.closest('header') || document.querySelector('header');
    if (!header || header.querySelector('.mobile-toggle')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mobile-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    btn.textContent = 'Menu';
    menu.insertAdjacentElement('beforebegin', btn);
  });
})();
// === END MOBILE_MENU_BUTTON_INJECT_V1 ===

(() => {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-links');
  const header = document.querySelector('.site-header');

  const closeAllSubmenus = () => {
    document.querySelectorAll('.nav-item.open').forEach(item => {
      item.classList.remove('open');
      const btn = item.querySelector('.submenu-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      if (header) header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) closeAllSubmenus();
    });

    document.addEventListener('click', (event) => {
      if (!header) return;
      if (!header.contains(event.target)) {
        menu.classList.remove('is-open');
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        closeAllSubmenus();
      }
    });
  }

  document.querySelectorAll('.nav-item').forEach((item, index) => {
    const link = item.querySelector(':scope > a');
    const dropdown = item.querySelector(':scope > .dropdown');
    if (!link || !dropdown) return;

    const submenuId = dropdown.id || `submenu-${index + 1}`;
    dropdown.id = submenuId;

    let btn = item.querySelector(':scope > .submenu-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'submenu-toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', submenuId);
      btn.setAttribute('aria-label', `Toggle ${link.textContent.trim()} menu`);
      btn.innerHTML = '<span aria-hidden="true">▾</span>';
      link.insertAdjacentElement('afterend', btn);
    }

    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !item.classList.contains('open');
      if (window.innerWidth <= 760) {
        document.querySelectorAll('.nav-item.open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            const openBtn = openItem.querySelector('.submenu-toggle');
            if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }
      item.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (menu) menu.classList.remove('is-open');
      if (header) header.classList.remove('nav-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      closeAllSubmenus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      if (menu) menu.classList.remove('is-open');
      if (header) header.classList.remove('nav-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      closeAllSubmenus();
    }
  });

  document.querySelectorAll('[data-count]').forEach(el => {
    const end = Number(el.dataset.count || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(end / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      el.textContent = end >= 1000 ? current.toLocaleString('en-GB') : current;
    }, 35);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('.faq-item button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (item) item.classList.toggle('open');
    });
  });
})();

setInterval(() => {
  const msgs = document.querySelectorAll('.promo-float-message');
  if (!msgs.length) return;
  let active = [...msgs].findIndex(m => m.classList.contains('is-active'));
  if (active < 0) {
    msgs[0].classList.add('is-active');
    return;
  }
  msgs[active].classList.remove('is-active');
  msgs[(active + 1) % msgs.length].classList.add('is-active');
}, 3000);

document.addEventListener('click',(e)=>{
  if(e.target.classList.contains('promo-float-close')){
    document.getElementById('promoFloat').style.display='none';
  }
});












(() => {
  const popup = document.getElementById('offerPopupV3');
  if (!popup) return;

  const closeBtn = popup.querySelector('.offer-popup-v3-close');
  const dismissBtn = popup.querySelector('.offer-popup-v3-dismiss');
  const backdrop = popup.querySelector('.offer-popup-v3-backdrop');

  const openPopup = () => {
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
  };

  const closePopup = () => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
  };

  // popup auto-open disabled for faster navigation

  closeBtn?.addEventListener('click', closePopup);
  dismissBtn?.addEventListener('click', closePopup);
  backdrop?.addEventListener('click', closePopup);
})();
