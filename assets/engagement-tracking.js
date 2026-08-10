(function () {
  "use strict";

  const endpoint = "https://carpet-cleaning-crm.onrender.com/api/website-analytics";
  const productionHost = "www.thecarpetcleaningcrew.co.uk";
  const recorded = new Set();
  const startedAt = Date.now();
  let visibleSeconds = 0;
  let boundForm = null;
  let scrollQueued = false;
  const visitorSession = window.crypto && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, "")
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 16)}`;

  function currentForm() {
    return document.getElementById("warmQuote") || document.getElementById("quoteStepOne");
  }

  function fieldValue(name) {
    const form = currentForm();
    const field = form && form.querySelector(`[name="${name}"]`);
    return field ? field.value : "";
  }

  function trafficSource() {
    const query = new URLSearchParams(location.search);
    if (query.get("gclid") || query.get("gbraid") || query.get("wbraid")) return "Google Ads";
    if (query.get("utm_source")) return query.get("utm_source").slice(0, 80);
    if (!document.referrer) return "Direct / unknown";
    try {
      const host = new URL(document.referrer).hostname.toLowerCase();
      if (/google\./.test(host)) return "Google organic";
      if (/facebook\.|instagram\./.test(host)) return "Facebook / Instagram";
      return "Website referral";
    } catch (_) {
      return "Website referral";
    }
  }

  function payload(eventName, eventValue) {
    const query = new URLSearchParams(location.search);
    return {
      session_id: visitorSession,
      landing_area: fieldValue("landing_area") || "Shrewsbury",
      landing_page: fieldValue("landing_page") || location.pathname.split("/").pop(),
      page_variant: "shrewsbury-new-landing-2026-08-10",
      event_name: eventName,
      event_value: Math.max(0, Math.round(Number(eventValue) || 0)),
      traffic_source: trafficSource(),
      click_id_present: query.get("gclid") || query.get("gbraid") || query.get("wbraid") ? 1 : 0,
      device_type: innerWidth < 600 ? "mobile" : innerWidth < 1024 ? "tablet" : "desktop",
      company_website: "",
    };
  }

  function send(eventName, eventValue, onceKey) {
    const key = onceKey || eventName;
    if (recorded.has(key)) return;
    recorded.add(key);
    if (location.hostname !== productionHost) return;
    fetch(endpoint, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload(eventName, eventValue)),
      keepalive: true,
    }).catch(function () {});
  }

  send("page_view");

  setInterval(function () {
    if (document.visibilityState !== "visible") return;
    visibleSeconds += 1;
    [10, 20, 60, 120].forEach(function (seconds) {
      if (visibleSeconds >= seconds) send(`time_${seconds}`);
    });
  }, 1000);

  function checkScroll() {
    scrollQueued = false;
    const available = document.documentElement.scrollHeight - innerHeight;
    if (available <= 0) return;
    const percent = ((scrollY + innerHeight) / document.documentElement.scrollHeight) * 100;
    [25, 50, 75, 90].forEach(function (depth) {
      if (percent >= depth) send(`scroll_${depth}`);
    });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 30) send("scroll_bottom");
  }
  addEventListener("scroll", function () {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(checkScroll);
    }
  }, { passive: true });
  checkScroll();

  function bindForm() {
    const form = currentForm();
    if (!form || form === boundForm) return;
    boundForm = form;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) send("form_view");
      }, { threshold: 0.25 });
      observer.observe(form);
    }
    const usable = Array.from(form.querySelectorAll("input,select,textarea")).filter(function (el) {
      return !["hidden", "submit", "button"].includes((el.type || "").toLowerCase());
    });
    form.addEventListener("focusin", function (event) {
      send("form_start");
      const index = usable.indexOf(event.target);
      if (index < 0 || !usable.length) return;
      const progress = (index + 1) / usable.length;
      if (progress >= 0.5) send("form_midpoint");
      if (progress >= 0.8) send("form_final");
    });
    form.addEventListener("submit", function () { send("form_submit"); });
  }
  bindForm();
  new MutationObserver(bindForm).observe(document.documentElement, { childList: true, subtree: true });

  const video = document.getElementById("customerReactionVideo");
  if (video) {
    video.addEventListener("play", function () { send("video_start"); });
    video.addEventListener("timeupdate", function () {
      if (!video.duration) return;
      const progress = video.currentTime / video.duration;
      [25, 50, 75].forEach(function (percent) {
        if (progress >= percent / 100) send(`video_${percent}`);
      });
    });
    video.addEventListener("ended", function () { send("video_complete"); });
  }

  document.addEventListener("click", function (event) {
    const target = event.target.closest("a,button");
    if (!target) return;
    const href = target.getAttribute("href") || "";
    if (href.startsWith("tel:")) send("phone_click");
    else if (href.startsWith("mailto:")) send("email_click");
    else if (/wa\.me|whatsapp/i.test(href)) send("whatsapp_click");
    else if (/quote|#contact|#form/i.test(href) || /quote|price|book/i.test(target.textContent || "")) send("quote_click");
  });

  addEventListener("pagehide", function () {
    if (location.hostname !== productionHost || recorded.has("page_exit")) return;
    recorded.add("page_exit");
    const body = new Blob([JSON.stringify(payload("page_exit", Math.max(visibleSeconds, (Date.now() - startedAt) / 1000)))], { type: "application/json" });
    navigator.sendBeacon(endpoint, body);
  });
})();
