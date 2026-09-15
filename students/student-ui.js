(()=>{'use strict';
if(/^#stage-(p1|p2|r|t1|t2|t3)$/.test(location.hash)||location.hash==='#route'){location.replace('route.html'+location.hash);return;}
const $=id=>document.getElementById(id), reduced=matchMedia('(prefers-reduced-motion: reduce)');
let motionOff=reduced.matches,manualOff=false;
function animateContent(el){el.getAnimations().forEach(a=>a.cancel());if(!motionOff)el.animate([{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'});}
// Typography scene follows the user's «СЕКРЕТ» reference.
const letterScene=window.createLetterScene();
$('reshape').addEventListener('click',()=>{letterScene.shuffle();$('announcer').textContent='Буквы заголовка набраны разными шрифтами.';});
$('reset-type').addEventListener('click',()=>{letterScene.reset();$('reshape').focus({preventScroll:true});$('announcer').textContent='Буквы снова набраны исходным шрифтом.';});
$('wave-type').addEventListener('click',()=>{if(motionOff){$('announcer').textContent='Движение выключено.';return;}letterScene.pulse();});
function setMotion(){motionOff=manualOff||reduced.matches;document.documentElement.dataset.motion=motionOff?'off':'on';$('motion-toggle').setAttribute('aria-pressed',String(motionOff));$('motion-label').textContent=motionOff?'Движение выключено':'Без движения';$('type-hint').textContent='Нажми на фразу. Пять нажатий включают быстрый ритм.';if(motionOff){document.getAnimations().forEach(a=>a.cancel());}letterScene.setMotion(motionOff);}
$('motion-toggle').addEventListener('click',()=>{if(reduced.matches){$('announcer').textContent='Движение отключено в настройках устройства.';return;}manualOff=!manualOff;setMotion();});reduced.addEventListener('change',setMotion);
window.createProductDemo((button,message)=>{animateContent($('demo-content'));$('announcer').textContent=message;});
setMotion();
})();
