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

  function apply(root) {
    localiseText(root);
    if (root.querySelectorAll) configureForms(root);
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
