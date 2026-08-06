(function () {
  "use strict";

  const form = document.getElementById("warmQuote");
  const field = (name) => form && form.querySelector(`[name="${name}"]`);
  const area = field("landing_area") ? field("landing_area").value : "";
  const page = field("landing_page")
    ? field("landing_page").value
    : location.pathname.split("/").pop();
  const recorded = new Set();
  const productionHost = "www.thecarpetcleaningcrew.co.uk";
  const sessionKey = "ccc_engagement_session";
  const alertedKey = "ccc_engagement_alert_sent";
  let visitorSession = sessionStorage.getItem(sessionKey);
  if (!visitorSession) {
    visitorSession = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
    sessionStorage.setItem(sessionKey, visitorSession);
  }
  const eligibleAt = Date.now() + 30000;
  let pendingAlert = "";

  function sendEngagementAlert(trigger) {
    if (location.hostname !== productionHost || sessionStorage.getItem(alertedKey)) return;
    if (Date.now() < eligibleAt) {
      pendingAlert = pendingAlert || trigger;
      setTimeout(() => sendEngagementAlert(pendingAlert), eligibleAt - Date.now() + 50);
      return;
    }
    sessionStorage.setItem(alertedKey, "1");
    const query = new URLSearchParams(location.search);
    const payload = new URLSearchParams({
      session_id: visitorSession,
      landing_area: area,
      landing_page: page,
      trigger,
      utm_source: query.get("utm_source") || "",
      gclid: query.get("gclid") || "",
      gbraid: query.get("gbraid") || "",
      wbraid: query.get("wbraid") || "",
      company_website: "",
    });
    fetch("https://carpet-cleaning-crm.onrender.com/api/website-engagement", {
      method: "POST",
      mode: "cors",
      body: payload,
      keepalive: true,
    }).catch(() => sessionStorage.removeItem(alertedKey));
  }

  function record(eventName, details, onceKey) {
    if (onceKey && recorded.has(onceKey)) return;
    if (onceKey) recorded.add(onceKey);
    const payload = Object.assign(
      { landing_area: area, landing_page: page },
      details || {},
    );
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }
  }

  [25, 50, 75, 90].forEach((depth) => {
    window.addEventListener(
      "scroll",
      () => {
        const available = document.documentElement.scrollHeight - innerHeight;
        if (available > 0 && (scrollY / available) * 100 >= depth) {
          record("scroll_depth", { percent_scrolled: depth }, `scroll:${depth}`);
          if (depth >= 75) sendEngagementAlert("deep_scroll");
        }
      },
      { passive: true },
    );
  });

  if (form) {
    form.addEventListener("focusin", () => {
      record("form_start", {}, "form:start");
      sendEngagementAlert("form_started");
    });
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            record(
              "section_view",
              { section_name: entry.target.id },
              `section:${entry.target.id}`,
            );
            if (entry.target.id === "reviews") sendEngagementAlert("reviews_viewed");
          }
        });
      },
      { threshold: 0.35 },
    );
    ["quote", "results", "reviews", "faq"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const frame = entry.target;
          record(
            "video_embed_visible",
            { video_title: frame.title || "Facebook cleaning video" },
            `video-visible:${frame.src || frame.title}`,
          );
        });
      },
      { threshold: 0.5 },
    );
    document
      .querySelectorAll(".video-embed iframe")
      .forEach((frame) => videoObserver.observe(frame));
  }

  let hoveredFrame = null;
  document.querySelectorAll(".video-embed iframe").forEach((frame) => {
    frame.addEventListener("pointerenter", () => {
      hoveredFrame = frame;
    });
    frame.addEventListener("pointerleave", () => {
      hoveredFrame = null;
    });
    frame.addEventListener(
      "touchstart",
      () =>
        (record("video_embed_interaction", {
          video_title: frame.title || "Facebook cleaning video",
          interaction_precision: "embed interaction; play cannot be verified",
        }),
        sendEngagementAlert("video_interaction")),
      { passive: true },
    );
  });
  window.addEventListener("blur", () => {
    const frame = document.activeElement;
    if (hoveredFrame && frame === hoveredFrame) {
      record("video_embed_interaction", {
        video_title: frame.title || "Facebook cleaning video",
        interaction_precision: "embed interaction; play cannot be verified",
      });
      sendEngagementAlert("video_interaction");
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a,button,summary");
    if (!target) return;
    const href = target.getAttribute("href") || "";
    const label = (
      target.textContent ||
      target.getAttribute("aria-label") ||
      ""
    )
      .trim()
      .slice(0, 80);
    if (/facebook\.com/i.test(href)) {
      record("facebook_outbound_click", { link_text: label });
    }
    if (target.matches("#reviews summary, #reviews button, [data-review-toggle]")) {
      record("reviews_interaction", { action_label: label });
    }
    if (target.matches("summary")) record("faq_open", { question: label });
    if (href.startsWith("#")) {
      record("internal_cta_click", { destination: href, link_text: label });
    }
  });
})();
