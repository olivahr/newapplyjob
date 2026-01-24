(() => {
  'use strict';

  // =========================================================
  // ======================= IDIOMAS ==========================
  // =========================================================
  const langSelect = document.getElementById('langSelect');

  const TEXT_MAP = {
    es: {
      continue: 'Continuar',
      back: 'Anterior',
      completeFirst: 'Completar primera parte',
      submit: 'Enviar Solicitud',
      select: 'Seleccione',
      selectCountry: 'Seleccione su país',
      usResidentQ: '¿Es residente de Estados Unidos? (No requerido para aprobación)',
      usResidentYes: 'Sí, soy residente de EE.UU.',
      citizenship: 'País de ciudadanía',
      housingAgree: 'Acepto las reglas de la corporación durante la estadía del contrato',
      housingPayment: 'Acepto realizar el pago de la primera semana una vez aprobada mi aplicación.',
      step1desc:
        'Complete todos los campos con información personal exacta. Esto permite al equipo de contratación conocer sus datos correctamente.',
      step2desc:
        'Ingrese su experiencia laboral, habilidades relevantes y disponibilidad para contratos. Esto permite asignarle trabajos adecuados.',
      step3desc:
        'Seleccione el tipo de habitación corporativa que usará durante el contrato. Todas las reservas se pagan dentro del portal corporativo.',
      step4desc: 'Proporcione documentos legales y de identidad necesarios para la contratación.',
      step5desc:
        'Revise y acepte las condiciones del contrato de 9 meses y las políticas corporativas antes de continuar con la aplicación.',
    },
    en: {
      continue: 'Continue',
      back: 'Back',
      completeFirst: 'Complete first part',
      submit: 'Submit Application',
      select: 'Select',
      selectCountry: 'Select your country',
      usResidentQ: 'Are you a U.S. resident? (Not required for approval)',
      usResidentYes: 'Yes, I am a U.S. resident.',
      citizenship: 'Citizenship country',
      housingAgree: 'I accept the corporation rules during the contract stay',
      housingPayment: 'I agree to make the first-week payment once my application is approved.',
      step1desc:
        'Complete all fields with accurate personal information. This helps the hiring team record your details correctly.',
      step2desc:
        'Enter your work experience, relevant skills, and availability. This helps assign you suitable work.',
      step3desc:
        'Select the corporate housing room type you will use during the contract. All reservations are paid inside the corporate portal.',
      step4desc: 'Provide the legal and identity documents required for hiring.',
      step5desc:
        'Review and accept the 9-month contract terms and corporate policies before continuing with the application.',
    },
  };

  function setOptionLang(option, lang) {
    // si tiene "ES / EN", lo separa y guarda
    if (!option.dataset.esText && option.textContent.includes(' / ')) {
      const parts = option.textContent.split(' / ');
      option.dataset.esText = parts[0].trim();
      option.dataset.enText = parts[parts.length - 1].trim();
    }

    if (option.dataset.esText && option.dataset.enText) {
      option.textContent = lang === 'en' ? option.dataset.enText : option.dataset.esText;
      return;
    }

    // placeholders típicos
    const t = option.textContent.trim();
    if (t === 'Seleccione' || t === 'Select') option.textContent = TEXT_MAP[lang].select;
    if (t === 'Seleccione su país' || t === 'Select your country') option.textContent = TEXT_MAP[lang].selectCountry;
  }

  function applyLanguage(lang) {
    const L = lang === 'en' ? 'en' : 'es';
    if (langSelect) langSelect.value = L;

    try {
      localStorage.setItem('appLang', L);
    } catch (_) {}

    // data-es / data-en
    document.querySelectorAll('[data-es][data-en]').forEach((el) => {
      const val = el.getAttribute('data-' + L);
      if (val != null) el.textContent = val;
    });

    // Step desc solo para index (si existen ids step1..step5)
    const stepDescById = {
      step1: TEXT_MAP[L].step1desc,
      step2: TEXT_MAP[L].step2desc,
      step3: TEXT_MAP[L].step3desc,
      step4: TEXT_MAP[L].step4desc,
      step5: TEXT_MAP[L].step5desc,
    };

    Object.entries(stepDescById).forEach(([id, text]) => {
      const st = document.getElementById(id);
      if (!st) return;
      const p = st.querySelector('.step-desc');
      if (p && !p.hasAttribute('data-es') && !p.hasAttribute('data-en')) p.textContent = text;
    });

    // botones
    document.querySelectorAll('button').forEach((b) => {
      const txt = (b.textContent || '').trim();
      if (txt === TEXT_MAP.es.continue || txt === TEXT_MAP.en.continue) b.textContent = TEXT_MAP[L].continue;
      if (txt === TEXT_MAP.es.back || txt === TEXT_MAP.en.back) b.textContent = TEXT_MAP[L].back;
      if (txt === TEXT_MAP.es.completeFirst || txt === TEXT_MAP.en.completeFirst) b.textContent = TEXT_MAP[L].completeFirst;
      if (txt === TEXT_MAP.es.submit || txt === TEXT_MAP.en.submit) b.textContent = TEXT_MAP[L].submit;
    });

    // checkboxes del step3 (index)
    const housingAgree = document.querySelector('input[name="housingAgree"]');
    if (housingAgree && housingAgree.closest('label')) {
      const lab = housingAgree.closest('label');
      Array.from(lab.childNodes).forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) n.textContent = '';
      });
      lab.appendChild(document.createTextNode(' ' + TEXT_MAP[L].housingAgree));
    }

    const housingPayment = document.querySelector('input[name="housingPayment"]');
    if (housingPayment && housingPayment.closest('label')) {
      const lab = housingPayment.closest('label');
      Array.from(lab.childNodes).forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) n.textContent = '';
      });
      lab.appendChild(document.createTextNode(' ' + TEXT_MAP[L].housingPayment));
    }

    // label sueltas (index step4)
    document.querySelectorAll('label').forEach((lab) => {
      const t = (lab.textContent || '').trim();
      if (t.includes('¿Es residente de Estados Unidos') || t.includes('Are you a U.S. resident')) {
        lab.textContent = TEXT_MAP[L].usResidentQ;
      }
      if (t.includes('País de ciudadanía') || t.includes('Citizenship')) {
        lab.textContent = TEXT_MAP[L].citizenship;
      }
    });

    // span de US resident
    document.querySelectorAll('span').forEach((sp) => {
      const t = (sp.textContent || '').trim();
      if (t === TEXT_MAP.es.usResidentYes || t === TEXT_MAP.en.usResidentYes) {
        sp.textContent = TEXT_MAP[L].usResidentYes;
      }
    });

    // options de selects
    document.querySelectorAll('select').forEach((sel) => {
      sel.querySelectorAll('option').forEach((opt) => setOptionLang(opt, L));
    });

    // placeholders "ES / EN"
    document.querySelectorAll('input, textarea').forEach((el) => {
      if (!el.placeholder) return;
      if (el.placeholder.includes(' / ')) {
        const parts = el.placeholder.split(' / ');
        el.placeholder = L === 'en' ? parts[parts.length - 1].trim() : parts[0].trim();
      }
    });
  }

  // init idioma SIEMPRE
  (function initLanguage() {
    if (!langSelect) return;

    let lang = 'es';
    try {
      const saved = localStorage.getItem('appLang');
      if (saved === 'en' || saved === 'es') lang = saved;
    } catch (_) {}

    langSelect.value = lang;
    langSelect.addEventListener('change', (e) => applyLanguage(e.target.value));
    applyLanguage(lang);
  })();

  // =========================================================
  // ================== STEPS / PROGRESO ======================
  // =========================================================
  const steps = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('.next');
  const prevBtns = document.querySelectorAll('.prev');
  const progress = document.getElementById('progress');
  let currentStep = 0;

  // Si no hay steps, salimos (pero el idioma ya quedó inicializado arriba)
  if (!steps || steps.length === 0) return;

  function updateProgress() {
    const percent = ((currentStep + 1) / steps.length) * 100;
    if (progress) progress.style.width = percent + '%';

    steps.forEach((step, index) => {
      const scoreFill = step.querySelector('.score-fill');
      if (scoreFill) scoreFill.style.width = index <= currentStep ? '100%' : '0%';
    });
  }

  function initSteps() {
    steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.add('active');
        step.style.display = 'flex';
      } else {
        step.classList.remove('active');
        step.style.display = 'none';
      }
    });
    updateProgress();
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      if (i === index) {
        step.style.display = 'flex';
        setTimeout(() => step.classList.add('active'), 10);
      } else {
        step.classList.remove('active');
        step.style.display = 'none';
      }
    });
    updateProgress();
  }

  function validateStep(index) {
    const step = steps[index];
    if (!step) return true;

    const inputs = step.querySelectorAll('input, select, textarea');
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].checkValidity()) {
        inputs[i].reportValidity();
        return false;
      }
    }

    // ✅ Solo aplica al index.html (step5 existe allí). En continuar.html no existe step5.
    if (step.id === 'step5') {
      const policies = step.querySelector('[name="policiesAgree"]');
      const contract = step.querySelector('[name="contractAgree"]');

      const requireChecked = (el, msg) => {
        if (!el) return true;
        if (el.type === 'checkbox') {
          if (!el.checked) {
            el.setCustomValidity(msg);
            el.reportValidity();
            return false;
          }
          el.setCustomValidity('');
          return true;
        }
        // fallback si alguien lo vuelve select
        const v = (el.value || '').trim().toLowerCase();
        const isNo = v === 'no' || v.startsWith('no ') || v.includes('no /');
        if (!v || isNo) {
          el.setCustomValidity(msg);
          el.reportValidity();
          return false;
        }
        el.setCustomValidity('');
        return true;
      };

      if (!requireChecked(policies, 'Debe aceptar las políticas de la empresa para continuar.')) return false;
      if (!requireChecked(contract, 'Debe aceptar el contrato de 9 meses para continuar.')) return false;
    }

    return true;
  }

  function showConfettiMessage() {
    const confettiMsg = document.getElementById('confettiMsg');
    if (!confettiMsg) return;
    confettiMsg.style.display = 'block';
    confettiMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // botón final de index (data-step="end")
      if (btn.dataset.step === 'end') {
        if (validateStep(currentStep)) showConfettiMessage();
        return;
      }

      if (validateStep(currentStep)) {
        currentStep++;
        if (currentStep >= steps.length) currentStep = steps.length - 1;
        showStep(currentStep);
      }
    });
  });

  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentStep--;
      if (currentStep < 0) currentStep = 0;
      showStep(currentStep);
    });
  });

  // scroll suave
  steps.forEach((step) => {
    step.style.maxHeight = '80vh';
    step.style.overflowY = 'auto';
    step.style.webkitOverflowScrolling = 'touch';
    step.style.overscrollBehavior = 'contain';
  });

  // ✅ AHORA SÍ: inicializa steps (esto arregla el “continuar.html en blanco”)
  initSteps();

  // =========================================================
  // ============== OVERLAY FINAL (solo continuar) ============
  // =========================================================
  let celebrationRAF = null;

  function startCelebration(canvas) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const confetti = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1.5 + Math.random() * 2.2,
      r: 2 + Math.random() * 3,
      a: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.15,
    }));

    let t = 0;
    const loop = () => {
      t++;

      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of confetti) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.va;

        if (p.y > window.innerHeight + 20) {
          p.y = -20;
          p.x = Math.random() * window.innerWidth;
        }
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2.2, p.r);
        ctx.restore();
      }

      celebrationRAF = requestAnimationFrame(loop);
    };

    canvas._celebrationCleanup = () => {
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    loop();
  }

  function stopCelebration() {
    if (celebrationRAF) {
      cancelAnimationFrame(celebrationRAF);
      celebrationRAF = null;
    }
    const canvas = document.getElementById('celebrationCanvas');
    if (canvas && canvas._celebrationCleanup) {
      canvas._celebrationCleanup();
      canvas._celebrationCleanup = null;
    }
  }

  function showFinishOverlay() {
    const overlay = document.getElementById('finishOverlay');
    const canvas = document.getElementById('celebrationCanvas');
    const closeBtn = document.getElementById('finishCloseBtn');
    const consent = document.getElementById('consentContact');

    if (!overlay || !canvas) return;

    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // habilitar botón si acepta contacto
    if (closeBtn && consent) {
      const sync = () => (closeBtn.disabled = !consent.checked);
      consent.addEventListener('change', sync);
      sync();
    }

    // Finalizar => pantalla negra final
    if (closeBtn) {
      closeBtn.addEventListener(
        'click',
        () => {
          stopCelebration();

          // deja fondo negro limpio
          const canvasEl = document.getElementById('celebrationCanvas');
          if (canvasEl) canvasEl.style.display = 'none';

          const card = overlay.querySelector('.finish-card');
          if (card) {
            const isEN = langSelect && langSelect.value === 'en';
            card.innerHTML = `
              <div style="text-align:center;">
                <div style="
                  width:70px;height:70px;margin:0 auto 14px;
                  border-radius:18px;
                  display:flex;align-items:center;justify-content:center;
                  background:rgba(255,255,255,0.06);
                  border:1px solid rgba(255,255,255,0.10);
                  font-size:34px;
                ">✅</div>

                <h3 style="margin:0 0 10px; font-size:22px; font-weight:900;">
                  ${isEN ? 'Application completed' : 'Aplicación completada'}
                </h3>

                <p style="margin:0 0 14px; color:rgba(255,255,255,0.80); line-height:1.45;">
                  ${
                    isEN
                      ? 'Your application was submitted successfully. You may now close this page and contact your recruiter for next steps.'
                      : 'Tu aplicación fue enviada con éxito. Ya puedes cerrar esta página y contactar a tu reclutador para los próximos pasos.'
                  }
                </p>

                <div style="margin-top:10px;font-size:12px;color:rgba(255,255,255,0.45);">
                  SunPower Corporation • Recruiting Process
                </div>
              </div>
            `;
          }

          // libera scroll (aunque el overlay siga visible)
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';

          try {
            window.close();
          } catch (e) {}
        },
        { once: true }
      );
    }

    startCelebration(canvas);
  }

  // submit SOLO en continuar.html (si existe finishOverlay)
  const form = document.getElementById('app');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      if (document.getElementById('finishOverlay')) {
        showFinishOverlay();
      }
    });
  }
})();
