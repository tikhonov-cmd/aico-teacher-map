// Shared navigation. Rules are a section of the overview, not a separate page.
(()=>{'use strict';
 const home=document.querySelector('[data-nav="home"]');
 const rules=document.querySelector('[data-nav="rules"]');
 const section=document.getElementById('rules');
 if(!section)return;
 const end=document.getElementById('data');
 let queued=false;
 function update(){
  queued=false;
  const readingRules=section.getBoundingClientRect().top<=innerHeight*.3&&end.getBoundingClientRect().bottom>innerHeight*.3;
  home.toggleAttribute('aria-current',!readingRules);
  rules.toggleAttribute('aria-current',readingRules);
  if(readingRules)rules.setAttribute('aria-current','location');else home.setAttribute('aria-current','page');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 window.addEventListener('pageshow',schedule);
 update();
})();
