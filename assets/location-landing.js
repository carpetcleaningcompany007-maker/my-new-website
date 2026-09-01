(function () {
  "use strict";

  const config = window.__landingLocation || {
    slug: document.documentElement.dataset.landingSlug,
    area: document.documentElement.dataset.landingArea,
    page: document.documentElement.dataset.landingPage,
  };
  if (!config) return;

  const replacements = [
    [/Ludlow\s*&\s*Shrewsbury/gi, config.area],
    [/Ludlow,\s*Shrewsbury and surrounding areas/gi, config.area],
    [/Ludlow and Shrewsbury/gi, config.area],
    [/across Ludlow,\s*Shrewsbury and surrounding areas/gi, `in ${config.area}`],
  ];

  function localiseText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (!node.nodeValue || !/Ludlow|Shrewsbury/i.test(node.nodeValue)) return;
      let value = node.nodeValue;
      replacements.forEach(function (pair) { value = value.replace(pair[0], pair[1]); });
      node.nodeValue = value;
    });
  }

  function configureForms(root) {
    const forms = [];
    if (root.matches && root.matches("form")) forms.push(root);
    root.querySelectorAll("form").forEach(function (form) { forms.push(form); });
    forms.forEach(function (form) {
      let page = form.querySelector('[name="landing_page"]');
      if (!page) {
        page = document.createElement("input");
        page.type = "hidden";
        page.name = "landing_page";
        form.appendChild(page);
      }
      page.value = config.page;

      let area = form.querySelector('[name="landing_area"]');
      if (!area) {
        area = document.createElement("input");
        area.type = "hidden";
        area.name = "landing_area";
        form.appendChild(area);
      }
      area.value = config.area;
    });
  }

  function isolateLinks(root) {
    const links = [];
    if (root.matches && root.matches("a")) links.push(root);
    root.querySelectorAll("a").forEach(function (link) { links.push(link); });
    links.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:") || /wa\.me|whatsapp/i.test(href)) return;
      let url;
      try { url = new URL(href, location.href); } catch (_) { return; }
      if (url.hostname !== location.hostname || !/^\/(?:pages\/)?/.test(url.pathname)) return;

      if (url.pathname === "/" || /\/about\.html$/.test(url.pathname)) link.setAttribute("href", "#top");
      else if (/gallery/.test(url.pathname)) link.setAttribute("href", "#results");
      else if (/reviews/.test(url.pathname)) link.setAttribute("href", "#reviews");
      else if (/service-areas|\/local\/|landing-telford/.test(url.pathname)) link.setAttribute("href", "#areas");
      else if (/privacy/.test(url.pathname)) return;
      else link.setAttribute("href", "#quote");
      link.removeAttribute("target");
    });
  }

  function apply(root) {
    localiseText(root);
    if (root.querySelectorAll) {
      configureForms(root);
      isolateLinks(root);
    }
  }

  apply(document.documentElement);
  new MutationObserver(function (records) {
    records.forEach(function (record) {
      record.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) apply(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
