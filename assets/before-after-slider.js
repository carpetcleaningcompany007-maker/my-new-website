(function () {
  "use strict";

  document.querySelectorAll("#new-results .result-set").forEach(function (comparison, index) {
    if (comparison.querySelector(".before-after-range")) return;

    comparison.style.setProperty("--split", "50%");
    const divider = document.createElement("span");
    divider.className = "before-after-divider";
    divider.setAttribute("aria-hidden", "true");

    const range = document.createElement("input");
    range.className = "before-after-range";
    range.type = "range";
    range.min = "0";
    range.max = "100";
    range.value = "50";
    range.setAttribute("aria-label", "Reveal before or after photo for result " + (index + 1));
    range.addEventListener("input", function () {
      comparison.style.setProperty("--split", range.value + "%");
    });

    comparison.appendChild(divider);
    comparison.appendChild(range);
  });
})();
