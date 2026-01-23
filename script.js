(() => {
'use strict';

const steps = document.querySelectorAll('.form-step');
const nextBtns = document.querySelectorAll('.next');
const prevBtns = document.querySelectorAll('.prev');
const progress = document.getElementById('progress');
let currentStep = 0;

/* ================= INIT ================= */
function init(){
  steps.forEach((s,i)=>{
    s.style.display = i===0?'flex':'none';
    if(i===0) s.classList.add('active');
  });
  updateProgress();
}
init();

/* ================= PROGRESS ================= */
function updateProgress(){
  const percent = (currentStep / (steps.length - 1)) * 100;
  if(progress) progress.style.width = percent + '%';
}

/* ================= SHOW STEP ================= */
function showStep(i){
  steps.forEach((s,idx)=>{
    s.classList.remove('active');
    s.style.display='none';
    if(idx===i){
      s.style.display='flex';
      setTimeout(()=>s.classList.add('active'),10);
    }
  });
  updateProgress();
}

/* ================= VALIDATION ================= */
function validateStep(i){
  const inputs = steps[i].querySelectorAll('input,select,textarea');
  for(const el of inputs){
    if(!el.checkValidity()){
      el.reportValidity();
      return false;
    }
  }
  return true;
}

/* ================= NAV ================= */
nextBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(btn.dataset.step === 'end'){
      if(validateStep(currentStep)){
        document.getElementById('confettiMsg').style.display='block';
        document.getElementById('confettiMsg')
          .scrollIntoView({behavior:'smooth'});
      }
      return;
    }
    if(validateStep(currentStep)){
      currentStep++;
      showStep(currentStep);
    }
  });
});

prevBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    currentStep--;
    if(currentStep<0) currentStep=0;
    showStep(currentStep);
  });
});

})();
