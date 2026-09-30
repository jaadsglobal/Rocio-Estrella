const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const leadForm = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const pricingSection = document.querySelector("#planes");
const stickyPriceBars = document.querySelectorAll(".sticky-price-bar");
const associationCards = document.querySelectorAll(".sticky-price-bar, .association-card");
const associationToggles = document.querySelectorAll("[data-association-toggle]");
const toggleSymbols = document.querySelectorAll("[data-toggle-symbol]");
const priceSummaries = document.querySelectorAll("[data-price-summary]");
const totalPrices = document.querySelectorAll("[data-total-price]");
const associationPills = document.querySelectorAll("[data-association-pill]");
let associationSelected = true;

// Sticky header state.
function syncHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
}

function syncStickyPriceVisibility() {
  if (!pricingSection) return;
  const pricingBottom = pricingSection.offsetTop + pricingSection.offsetHeight;
  const shouldShow = window.scrollY >= pricingBottom - 80;
  stickyPriceBars.forEach((card) => card.classList.toggle("is-visible", shouldShow));
}

function syncScrollState() {
  syncHeader();
  syncStickyPriceVisibility();
}

window.addEventListener("scroll", syncScrollState, { passive: true });
window.addEventListener("resize", syncStickyPriceVisibility);
syncHeader();
syncStickyPriceVisibility();

// Mobile navigation.
menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Optional association selector in pricing and sticky summary.
function syncAssociationState() {
  const summary = priceSummaries[0];
  const base = Number(summary?.dataset.basePrice || 0);
  const association = Number(summary?.dataset.associationPrice || 0);
  const total = associationSelected ? base + association : base;

  associationCards.forEach((card) => card.classList.toggle("is-selected", associationSelected));
  associationToggles.forEach((toggle) => toggle.setAttribute("aria-pressed", String(associationSelected)));
  toggleSymbols.forEach((symbol) => {
    symbol.textContent = associationSelected ? "−" : "+";
  });
  associationPills.forEach((pill) => {
    pill.textContent = associationSelected ? "Asociación $99.95/año" : "Asociación no incluida";
  });
  totalPrices.forEach((price) => {
    price.textContent = `$${total.toFixed(2)}`;
  });
}

associationToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    associationSelected = !associationSelected;
    syncAssociationState();
  });
});

syncAssociationState();

function buildWhatsappUrl(number) {
  const text = encodeURIComponent("Hola Rocio, quiero asesoramiento sobre Travorium.");
  return `https://wa.me/${number}?text=${text}`;
}

whatsappLinks.forEach((link) => {
  const number = link.dataset.whatsappNumber?.trim();
  if (number) {
    link.href = buildWhatsappUrl(number);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
    return;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (formStatus) {
      formStatus.textContent = "WhatsApp pendiente de activar. Anade el numero real en data-whatsapp-number.";
    }
  });
});

// Lead capture is intentionally disabled until a real contact channel is configured.
leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (formStatus) {
    formStatus.textContent = "Formulario pendiente de conectar. Completa el email, WhatsApp o CRM real antes de publicar.";
  }
});
