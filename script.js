"use strict";

/* ================= CONFIG ================= */
const STORAGE_KEY = "jobapp_step_current_v1";
const SCROLL_TO_TOP_ON_STEP_CHANGE = true;

/* ================= DOM ================= */
const steps = Array.from(document.querySelectorAll(".form-step"));
const progress = document.getElementById("progress");
const stepCounter = document.getElementById("stepCounter");
const timeline = document.getElementById("timeline");
const wizard = document.getElementById("wizard");

if (!steps.length || !progress || !stepCounter || !timeline || !wizard) {
  console.error("❌ Elementos principales no encontrados en el DOM");
}

/* ================= DATA ================= */
const TOTAL = steps.length;

const mapTitles = [
  "Bienvenida","Identificación","Ubicación","Elegibilidad","Disponibilidad",
  "Condiciones","Experiencia","Compromiso",
  "Assessment 1","Assessment 2","Assessment 3","Assessment 4","Assessment 5",
  "Assessment 6","Assessment 7","Assessment 8","Assessment 9","Assessment 10"
];

/* ================= MAPA ================= */
(function buildTimeline(){
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
})();

const mapItems = Array.from(document.querySelectorAll(".mstep"));

/* ================= STATE ================= */
let current = Number(localStorage.getItem(STORAGE_KEY)) || 1;

/* ================= CORE ================= */
function setActive(stepNumber){
  current = Math.min(Math.max(stepNumber, 1), TOTAL);
  localStorage.setItem(STORAGE_KEY, current);
  update();
}

function update(){
  // Mostrar solo el paso activo
  steps.forEach(s => s.classList.remove("active"));
  steps[current - 1].classList.add("active");

  // Progreso
  const pct = ((current - 1) / (TOTAL - 1)) * 100;
  progress.style.width = pct + "%";
  stepCounter.textContent = `Paso ${current} de ${TOTAL}`;

  // Timeline
  mapItems.forEach((item, idx) => {
    const stepNum = idx + 1;
    item.classList.remove("done", "active", "locked");

    const dot = item.querySelector(".dot");

    if (stepNum < current) {
      item.classList.add("done");
      dot.textContent = "✓";
    } else if (stepNum === current) {
      item.classList.add("active");
      dot.textContent = stepNum;
    } else {
      item.classList.add("locked");
      dot.textContent = stepNum;
    }
  });

  // Botones
  document.querySelectorAll(".prev").forEach(b => {
    b.disabled = current === 1;
  });

  if (SCROLL_TO_TOP_ON_STEP_CHANGE) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ================= VALIDATION ================= */
function isStepValid(){
  const active = steps[current - 1];

  // ocultar errores
  active.querySelectorAll(".pair-error").forEach(e => e.style.display = "none");

  const required = Array.from(active.querySelectorAll("[required]"));

  // Radios por grupo
  const radios = required.filter(el => el.type === "radio");
  if (radios.length) {
    const names = [...new Set(radios.map(r => r.name))];
    for (const name of names) {
      const group = active.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`);
      if (![...group].some(r => r.checked)) {
        const err = active.querySelector(".pair-error");
        if (err) err.style.display = "block";
        group[0]?.focus();
        return false;
      }
    }
  }

  // Otros campos
  for (const el of required) {
    if (el.type === "radio") continue;

    if (el.type === "checkbox") {
      if (!el.checked) {
        el.focus();
        return false;
      }
    } else {
      if (!el.value.trim()) {
        el.focus();
        return false;
      }
      if (el.type === "email") {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
        if (!ok) {
          el.focus();
          return false;
        }
      }
    }
  }

  return true;
}

/* ================= EVENTS ================= */
document.addEventListener("click", e => {
  const t = e.target;

  if (t.classList.contains("next")) {
    if (!isStepValid()) return;
    setActive(current + 1);
  }

  if (t.classList.contains("prev")) {
    setActive(current - 1);
  }

  const map = t.closest(".mstep");
  if (map) {
    const go = Number(map.dataset.go);
    if (go <= current) setActive(go);
  }
});

wizard.addEventListener("submit", e => {
  if (!isStepValid()) {
    e.preventDefault();
    return;
  }
  alert("✅ Aplicación enviada (demo).");
  localStorage.removeItem(STORAGE_KEY);
  e.preventDefault();
});

/* ================= INIT ================= */
setActive(current);
