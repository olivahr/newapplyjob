<script>
(() => {
  'use strict';

  const steps = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('.next');
  const prevBtns = document.querySelectorAll('.prev');
  const progress = document.getElementById('progress');

  let currentStep = 0;
  const totalSteps = steps.length;

  /* ================= INIT ================= */
  function init(){
    steps.forEach((step, index) => {
      step.classList.remove('active');
      step.style.display = 'none';
      if(index === 0){
        step.style.display = 'block';
        step.classList.add('active');
      }
    });
    updateProgress();
  }

  /* ================= PROGRESS ================= */
  function updateProgress(){
    if(!progress) return;
    const percent = (currentStep / (totalSteps - 1)) * 100;
    progress.style.width = percent + '%';
  }

  /* ================= SHOW STEP ================= */
  function showStep(index){
    if(index < 0) index = 0;
    if(index >= totalSteps) index = totalSteps - 1;

    steps.forEach((step, i) => {
      step.classList.remove('active');
      step.style.display = 'none';
      if(i === index){
        step.style.display = 'block';
        setTimeout(() => step.classList.add('active'), 10);
      }
    });

    currentStep = index;
    updateProgress();
  }

  /* ================= VALIDATION ================= */
  function validateStep(index){
    const step = steps[index];
    if(!step) return true;

    const fields = step.querySelectorAll('input, select, textarea');
    for(const field of fields){
      if(!field.checkValidity()){
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  /* ================= NEXT ================= */
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {

      // Paso final (submit visual)
      if(btn.type === 'submit'){
        if(!validateStep(currentStep)) return;

        const confetti = document.getElementById('confettiMsg');
        if(confetti){
          confetti.style.display = 'block';
          confetti.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      if(validateStep(currentStep)){
        showStep(currentStep + 1);
      }
    });
  });

  /* ================= PREV ================= */
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showStep(currentStep - 1);
    });
  });

  init();
})();
</script>
