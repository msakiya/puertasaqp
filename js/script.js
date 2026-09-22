document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("hidden") === false;
      document.body.style.overflow = open ? "hidden" : "";
      mobileMenuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenu) {
        mobileMenu.classList.add("hidden");
        document.body.style.overflow = "";
      }
    });
  });

  const navLinks = document.querySelectorAll("nav[aria-label='Principal'] .nav-link");
  const ids = ["inicio", "puertas", "servicios", "motores", "proyectos", "ubicanos"];
  const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (nodes.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] }
    );
    nodes.forEach((n) => observer.observe(n));
  }

  document.querySelectorAll("[data-quote]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-quote") || "";
      const select = document.getElementById("tipo_servicio");
      const banner = document.getElementById("quotePrefill");
      const options = Array.from(select.options).map((o) => o.value);
      if (options.includes(value)) {
        select.value = value;
        if (banner) banner.classList.add("hidden");
      } else {
        select.value = "Venta de motores y accesorios";
        if (banner) {
          banner.textContent = "Producto seleccionado: " + value;
          banner.classList.remove("hidden");
        }
      }
      toggleOtro();
      document.getElementById("cotizacion")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.getElementById("tipo_servicio")?.addEventListener("change", toggleOtro);

  document.querySelectorAll("[data-video]").forEach((btn) => {
    btn.addEventListener("click", () => openVideo(btn.getAttribute("data-video"), btn.getAttribute("data-title")));
  });
  document.getElementById("videoClose")?.addEventListener("click", closeVideo);
  document.getElementById("videoModal")?.addEventListener("click", (e) => {
    if (e.target.id === "videoModal") closeVideo();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideo();
  });

  initMotorsSlider();
});

function toggleOtro() {
  const select = document.getElementById("tipo_servicio");
  const wrap = document.getElementById("otroWrap");
  const input = document.getElementById("otro_servicio");
  const show = select && select.value === "Otro";
  if (wrap) wrap.classList.toggle("hidden", !show);
  if (input) input.required = Boolean(show);
}

function sanitizeInput(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => ({
    "&": "&",
    "<": "<",
    ">": ">",
    '"': """,
    "'": "&#039;",
  }[m]));
}

function handleFormSubmit(event) {
  event.preventDefault();
  const trap = document.getElementById("website_trap").value;
  if (trap) return false;

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = "Procesando solicitud...";

  const nombre = sanitizeInput(document.getElementById("nombre").value);
  const telefono = sanitizeInput(document.getElementById("telefono").value);
  const correo = sanitizeInput(document.getElementById("correo").value);
  let servicio = document.getElementById("tipo_servicio").value;
  if (servicio === "Otro") servicio = "Otro: " + document.getElementById("otro_servicio").value;
  const banner = document.getElementById("quotePrefill");
  if (banner && !banner.classList.contains("hidden")) {
    servicio += " — " + banner.textContent.replace("Producto seleccionado: ", "");
  }
  const servicioSolicitado = sanitizeInput(servicio);

  setTimeout(() => {
    document.getElementById("leadSummaryBox").innerHTML = `
      <p class="font-semibold text-navy mb-1">Resumen del pedido</p>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Servicio:</strong> ${servicioSolicitado}</p>
    `;
    document.getElementById("main-content").classList.add("hidden");
    document.getElementById("thank-you-view").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar solicitud de cotización';
    document.getElementById("leadForm").reset();
    if (banner) banner.classList.add("hidden");
    toggleOtro();
  }, 700);
}

function returnToLanding() {
  document.getElementById("thank-you-view").classList.add("hidden");
  document.getElementById("main-content").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openVideo(id, title) {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  frame.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
  frame.title = title || "Video de proyecto";
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  frame.src = "";
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

function initMotorsSlider() {
  const track = document.getElementById("motorSliderTrack");
  const prevBtn = document.getElementById("motorPrevBtn");
  const nextBtn = document.getElementById("motorNextBtn");
  const dotsContainer = document.getElementById("motorDotsContainer");
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const items = track.querySelectorAll(".slider-item");
  const totalItems = items.length;
  let currentIndex = 0;

  function getItemsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }
  function getMaxIndex() {
    return Math.max(0, totalItems - getItemsPerView());
  }
  function createDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i <= getMaxIndex(); i++) {
      const dot = document.createElement("button");
      dot.className = `dot-indicator ${i === currentIndex ? "active" : ""}`;
      dot.setAttribute("aria-label", `Ir al slide ${i + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }
  function updateSlider() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    track.style.transform = `translateX(-${(currentIndex * 100) / getItemsPerView()}%)`;
    dotsContainer.querySelectorAll(".dot-indicator").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }
  function nextSlide() {
    currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
    updateSlider();
  }
  function prevSlide() {
    currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
    updateSlider();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);
  window.addEventListener("resize", () => {
    createDots();
    updateSlider();
  });
  createDots();
  updateSlider();
  setInterval(nextSlide, 5000);
}
