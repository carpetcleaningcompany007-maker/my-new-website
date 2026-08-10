(function () {
  "use strict";

  window.websiteFormLooksLikeSpam = function (formData) {
    if (String(formData.get("_company_website") || "").trim()) return true;

    const text = Array.from(formData.entries())
      .filter(([key]) => !key.startsWith("_") && !/^(gclid|gbraid|wbraid|utm_)/i.test(key))
      .map(([, value]) => String(value || ""))
      .join("\n");
    const lower = text.toLowerCase();
    const pitchGroups = [
      ["increase revenue", "uplift of", "generate more revenue", "protect your business", "scan. detect. profit"],
      ["lease from", "per week", "fitted nationwide", "hire before you buy", "leasing options available"],
      ["schedule a call", "live demonstration", "live demo", "would you like an online", "discuss this further"],
      ["account manager", "all rights reserved", "© 20", "automated vehicle", "damage detection system", "drive over tyre"]
    ];

    let score = pitchGroups.reduce(
      (total, phrases) => total + (phrases.some((phrase) => lower.includes(phrase)) ? 1 : 0),
      0
    );
    if ((text.match(/[✓✕✔]/g) || []).length >= 4) score += 1;
    if ((text.match(/£\s?\d[\d,]*(?:\.\d+)?/g) || []).length >= 2) score += 1;
    return score >= 3;
  };
})();
