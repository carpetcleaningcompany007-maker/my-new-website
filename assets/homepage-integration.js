(function () {
  "use strict";

  const formSelector = 'form[action*="carpet-cleaning-crm.onrender.com/api/website-form"]';

  // Listen at document level because the React homepage can render its forms
  // after this script has loaded. This prevents a native form navigation to
  // the CRM JSON response even when rendering is delayed.
  document.addEventListener("submit", async function (event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.matches(formSelector)) return;
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector(".status");
      const phone = form.querySelector('[name="phone"]');
      const email = form.querySelector('[name="email"]');
      const phoneOk = phone && phone.value.trim().replace(/\D/g, "").length >= 10;
      const emailOk = email && email.value.trim() && email.checkValidity();
      if (!phoneOk && !emailOk) {
        if (status) status.textContent = "Please add a valid phone number or email address so Paul can reply.";
        (phone || email)?.focus();
        return;
      }

      const oldText = button ? button.textContent : "";
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      if (status) status.textContent = "Sending your enquiry securely…";
      const data = new FormData(form);
      const landingPage = document.documentElement.dataset.landingPage;
      const landingArea = document.documentElement.dataset.landingArea;
      if (landingPage && landingArea) {
        data.set("landing_page", landingPage);
        data.set("landing_area", landingArea);
      }
      if (!data.get("name")) data.set("name", String(data.get("first_name") || ""));
      if (!data.get("rooms_or_items")) data.set("rooms_or_items", String(data.get("notes") || data.get("service") || ""));
      data.set("visit_id", String(window.__websiteAnalyticsSession || ""));
      const query = new URLSearchParams(location.search);
      ["gclid","gbraid","wbraid","utm_source","utm_medium","utm_campaign","utm_term","utm_content","campaignid","adgroupid","keyword","matchtype","creative","device","network"].forEach(function (key) {
        data.set(key, query.get(key) || "");
      });

      try {
        const response = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
        const result = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(result.error || "Your enquiry could not be sent.");
        document.dispatchEvent(new Event("analytics:form-submit-success"));
        if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { landing_area: String(data.get("landing_area") || "Ludlow and Shrewsbury"), landing_page: String(data.get("landing_page") || "homepage"), service: String(data.get("service") || "") });
        if (status) status.textContent = "Thank you — your enquiry has been sent.";
        setTimeout(function () { location.href = "/thank-you.html"; }, 700);
      } catch (error) {
        if (status) status.textContent = "The connection was interrupted and your enquiry was not sent. Please try again or call 07802 563213.";
        if (button) { button.disabled = false; button.textContent = oldText; }
      }
  }, true);
})();
