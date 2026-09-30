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
const contactEmail = "rocioestrellatravel@gmail.com";
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
      formStatus.textContent = "Tambien puedes escribir a Rocio por email o usar el boton de contacto principal.";
    }
  });
});

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(leadForm);
  const name = String(formData.get("nombre") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("telefono") || "").trim();
  const subject = encodeURIComponent("Solicitud de asesoramiento Travorium");
  const body = encodeURIComponent(
    `Hola Rocio,\n\nQuiero solicitar asesoramiento sobre la membresia Travorium.\n\nNombre: ${name}\nEmail: ${email}\nTelefono: ${phone}\n\nGracias.`
  );

  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  if (formStatus) {
    formStatus.textContent = "Se abrira tu correo para enviar la solicitud a Rocio.";
  }
});
