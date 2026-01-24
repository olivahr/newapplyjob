(() => {
  "use strict";

  // ========================
  // Config
  // ========================
  const STORAGE_KEY = "jobapp_step_current_v1";
  const SCROLL_TO_TOP_ON_STEP_CHANGE = true;

  // ========================
  // DOM
  // ========================
  const steps = Array.from(document.querySelectorAll(".form-step"));
  const progress = document.getElementById("progress");
  const stepCounter = document.getElementById("stepCounter");
  const timeline = document.getElementById("timeline");
  const wizard = document.getElementById("wizard");

  if (!steps.length || !progress || !stepCounter || !timeline || !wizard) {
    console.error("Faltan elementos requeridos: .form-step / #progress / #stepCounter / #timeline / #wizard");
    return;
  }

  const TOTAL = steps.length; // Debe ser 18 en tu HTML

  // Títulos del mapa (ajústalos si quieres)
  const mapTitles = [
    "Bienvenida",
    "Identificación",
    "Ubicación",
    "Elegibilidad",
    "Disponibilidad",
    "Condiciones",
    "Experiencia",
    "Compromiso",
    "Assessment 1",
    "Assessment 2",
    "Assessment 3",
    "Assessment 4",
    "Assessment 5",
    "Assessment 6",
    "Assessment 7",
    "Assessment 8",
    "Assessment 9",
    "Assessment 10",
  ];

  // ========================
  // Helpers
  // ========================
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  function safeCSSescape(value) {
    // CSS.escape no existe en algunos browsers viejos
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  function saveStep(n) {
    try {
      localStorage.setItem(STORAGE_KEY, String(n));
    } catch {}
  }

  function loadStep() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      const n = Number(v);
      if (Number.isFinite(n) && n >= 1 && n <= TOTAL) return n;
    } catch {}
    return 1;
  }

  function scrollTopToForm() {
    if (!SCROLL_TO_TOP_ON_STEP_CHANGE) return;
    // intenta subir al inicio del panel/app
    const app = document.querySelector(".app") || document.body;
    app.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ========================
  // Map render
  // ========================
  function renderMap() {
    timeline.innerHTML = "";

    for (let i = 1; i <= TOTAL; i++) {
      const item = document.createElement("div");
      item.className = "mstep locked";
      item.dataset.go = String(i);

      const dot = document.createElement("div");
      dot.className = "dot";
      dot.textContent = String(i);

      const text = document.createElement("div");
      text.className = "mtext";
      text.innerHTML = `
        <div class="t1">Paso ${i}</div>
        <div class="t2">${mapTitles[i - 1] || ""}</div>
      `;

      item.appendChild(dot);
      item.appendChild(text);
      timeline.appendChild(item);
    }
  }

  // ========================
  // Validation
  // ========================
  function hideStepErrors(stepEl) {
    // Oculta errores tipo pair-error
    stepEl.querySelectorAll(".pair-error").forEach((el) => (el.style.display = "none"));

    // Limpia estados visuales opcionales
    stepEl.querySelectorAll("[data-invalid='1']").forEach((el) => {
      el.removeAttribute("data-invalid");
      el.style.outline = "";
    });
  }

  function markInvalid(el) {
    el.setAttribute("data-invalid", "1");
    el.style.outline = "2px solid rgba(185,28,28,.35)";
    el.style.outlineOffset = "2px";
  }

  function validateActiveStep(current) {
    const stepEl = steps[current - 1];
    hideStepErrors(stepEl);

    const required = Array.from(stepEl.querySelectorAll("[required]"));

    // 1) Radios por grupo (name)
    const radios = required.filter((el) => el.tagName === "INPUT" && el.type === "radio" && el.name);
    if (radios.length) {
      const groupNames = Array.from(new Set(radios.map((r) => r.name)));

      for (const name of groupNames) {
        const group = Array.from(stepEl.querySelectorAll(`input[type="radio"][name="${safeCSSescape(name)}"]`));
        const checked = group.some((r) => r.checked);

        if (!checked) {
          // show pair error if exists
          const err = stepEl.querySelector(".pair-error");
          if (err) err.style.display = "block";

          // focus first radio
          if (group[0]) group[0].focus();

          // mark all labels of that group (optional)
          group.forEach(markInvalid);
          return false;
        }
      }
    }

    // 2) Checkboxes / Inputs / Selects / Textareas
    for (const el of required) {
      if (el.tagName === "INPUT" && el.type === "radio") continue;

      if (el.tagName === "INPUT" && el.type === "checkbox") {
        if (!el.checked) {
          el.focus();
          markInvalid(el);
          return false;
        }
        continue;
      }

      // texto / select / textarea
      const val = (el.value ?? "").toString().trim();
      if (!val) {
        el.focus();
        markInvalid(el);
        return false;
      }

      // email simple
      if (el.tagName === "INPUT" && el.type === "email") {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!ok) {
          el.focus();
          markInvalid(el);
          return false;
        }
      }
    }

    return true;
  }

  // ========================
  // State + UI
  // ========================
  let current = loadStep(); // 1-based

  function updateUI() {
    // Step visibility
    steps.forEach((s) => s.classList.remove("active"));
    steps[current - 1].classList.add("active");

    // Progress bar
    const pct = TOTAL === 1 ? 100 : ((current - 1) / (TOTAL - 1)) * 100;
    progress.style.width = pct + "%";

    // Counter
    stepCounter.textContent = `Paso ${current} de ${TOTAL}`;

    // Map status
    const mapItems = Array.from(document.querySelectorAll(".mstep"));
    mapItems.forEach((it, idx) => {
      const stepNum = idx + 1;
      it.classList.remove("done", "active", "locked");

      if (stepNum < current) it.classList.add("done");
      else if (stepNum === current) it.classList.add("active");
      else it.classList.add("locked");

      const dot = it.querySelector(".dot");
      if (dot) dot.textContent = stepNum < current ? "✓" : String(stepNum);
    });

    // Prev enable/disable
    document.querySelectorAll(".prev").forEach((b) => (b.disabled = current === 1));
    document.querySelectorAll(".next").forEach((b) => (b.disabled = false));

    saveStep(current);
  }

  function goTo(stepNumber, { skipValidation = false } = {}) {
    const next = clamp(stepNumber, 1, TOTAL);

    // Si vamos hacia delante, valida el step actual
    if (!skipValidation && next > current) {
      if (!validateActiveStep(current)) return;
    }

    current = next;
    updateUI();
    scrollTopToForm();
  }

  // ========================
  // Events
  // ========================
  document.addEventListener("click", (e) => {
    const t = e.target;

    // Next
    if (t && t.classList && t.classList.contains("next")) {
      goTo(current + 1);
      return;
    }

    // Prev
    if (t && t.classList && t.classList.contains("prev")) {
      goTo(current - 1, { skipValidation: true });
      return;
    }

    // Map click
    const item = t && t.closest ? t.closest(".mstep") : null;
    if (item) {
      const go = Number(item.dataset.go);
      // Solo permite ir a pasos ya completados o al actual
      if (Number.isFinite(go) && go <= current) {
        goTo(go, { skipValidation: true });
      }
      return;
    }
  });

  // Enter key: evita que te brinque raro con inputs (opcional)
  wizard.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      // si estás en textarea, sí deja
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
      if (tag !== "textarea") e.preventDefault();
    }
  });

  // Submit final
  wizard.addEventListener("submit", (e) => {
    // valida step final
    if (!validateActiveStep(current)) {
      e.preventDefault();
      return;
    }

    // Demo: aquí tú lo mandas a tu backend si quieres
    alert("✅ Aplicación enviada (demo).");
    e.preventDefault();

    // Si quieres resetear al final:
    // try { localStorage.removeItem(STORAGE_KEY); } catch {}
    // goTo(1, { skipValidation: true });
  });

  // ========================
  // Init
  // ========================
  renderMap();
  current = clamp(loadStep(), 1, TOTAL);
  updateUI();
})();
