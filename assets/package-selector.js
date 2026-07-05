const packageCards = document.querySelectorAll(".package-card");
const packageSelect = document.querySelector("#selected-package");
const quoteLinks = document.querySelectorAll(".quote-link");
const revealItems = document.querySelectorAll(
  ".package-card, .before-after-section, .review-steps article, .review-copy, .notice, .question-grid p, .quote-shell"
);

function syncSelectedCard(packageValue) {
  packageCards.forEach((card) => {
    const isSelected = card.dataset.package === packageValue;
    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-current", isSelected ? "true" : "false");
  });
}

packageCards.forEach((card) => {
  const button = card.querySelector(".package-button");

  button.addEventListener("click", () => {
    syncSelectedCard(card.dataset.package);
    card.animate(
      [
        { transform: "translateY(-6px) scale(1)" },
        { transform: "translateY(-6px) scale(1.018)" },
        { transform: "translateY(-6px) scale(1)" }
      ],
      {
        duration: 260,
        easing: "ease-out"
      }
    );
  });
});

function selectPackage(packageValue) {
  if (!packageSelect || !packageValue) return;

  packageSelect.value = packageValue;
  syncSelectedCard(packageValue);
}

quoteLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    selectPackage(link.dataset.package);
    if (link.dataset.package) {
      const url = new URL(window.location.href);
      url.searchParams.set("package", link.dataset.package);
      url.hash = "quote";
      history.replaceState(null, "", url);
    }

    document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
  });
});

const packageFromUrl = new URLSearchParams(window.location.search).get("package");
selectPackage(packageFromUrl || packageSelect?.value);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
