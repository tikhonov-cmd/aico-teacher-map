(()=>{'use strict';
if(/^#stage-(p1|p2|r|t1|t2|t3)$/.test(location.hash)||location.hash==='#route'){location.replace('route.html'+location.hash);return;}
const $=id=>document.getElementById(id), reduced=matchMedia('(prefers-reduced-motion: reduce)');
let motionOff=reduced.matches,manualOff=false;
function animateContent(el){el.getAnimations().forEach(a=>a.cancel());if(!motionOff)el.animate([{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'});}
// The companion follows the active explanation or expanded answer.
const marker=$('companion'),markerState={x:0,y:0,vx:0,vy:0,tx:0,ty:0},initialHome=$('response-title');let home=initialHome;let markerFrame=0,markerLast=0;
function markerTarget(el,choice=false){const p=document.body.getBoundingClientRect(),r=el.getBoundingClientRect(),size=marker.offsetWidth,inside=el.matches('summary,.stage-mode');markerState.tx=choice?r.left-p.left+5:inside?r.left-p.left+1:r.left-p.left-size-9;markerState.ty=choice?r.top-p.top+(r.height-size)/2:inside?r.top-p.top+(el.matches('summary')?(r.height-size)/2:0):r.top-p.top+8;marker.classList.toggle('home',!choice);if(motionOff){markerState.x=markerState.tx;markerState.y=markerState.ty;markerState.vx=markerState.vy=0;paintMarker();}else if(!markerFrame){markerLast=performance.now();markerFrame=requestAnimationFrame(markerTick);}}
function paintMarker(){marker.style.visibility='visible';marker.style.transform=`translate(${markerState.x}px,${markerState.y}px) rotate(${Math.max(-18,Math.min(18,markerState.vx*2))}deg)`;}
function markerTick(t){markerFrame=0;const dt=Math.min((t-markerLast)/16.667||1,2);markerLast=t;let moving=false;for(const axis of ['x','y']){const v='v'+axis;markerState[v]=(markerState[v]+(markerState['t'+axis]-markerState[axis])*.10*dt)*Math.pow(.64,dt);markerState[axis]+=markerState[v]*dt;if(Math.abs(markerState['t'+axis]-markerState[axis])>.08||Math.abs(markerState[v])>.08)moving=true;else{markerState[axis]=markerState['t'+axis];markerState[v]=0;}}paintMarker();if(moving&&!motionOff&&!document.hidden)markerFrame=requestAnimationFrame(markerTick);}
function followAnchor(el){home=el;markerTarget(home);}
// Typography scene follows the user's «СЕКРЕТ» reference.
const letterScene=window.createLetterScene();
$('reshape').addEventListener('click',()=>{letterScene.shuffle();$('announcer').textContent='Буквы заголовка набраны разными шрифтами.';});
$('reset-type').addEventListener('click',()=>{letterScene.reset();$('reshape').focus({preventScroll:true});$('announcer').textContent='Буквы снова набраны исходным шрифтом.';});
$('wave-type').addEventListener('click',()=>{if(motionOff){$('announcer').textContent='Движение выключено.';return;}letterScene.pulse();});
function setMotion(){motionOff=manualOff||reduced.matches;document.documentElement.dataset.motion=motionOff?'off':'on';$('motion-toggle').setAttribute('aria-pressed',String(motionOff));$('motion-label').textContent=motionOff?'Движение выключено':'Без движения';$('type-hint').textContent='Нажми на фразу. Пять нажатий включают быстрый ритм.';if(motionOff){cancelAnimationFrame(markerFrame);markerFrame=0;document.getAnimations().forEach(a=>a.cancel());markerTarget(home);}letterScene.setMotion(motionOff);}
$('motion-toggle').addEventListener('click',()=>{if(reduced.matches){$('announcer').textContent='Движение отключено в настройках устройства.';return;}manualOff=!manualOff;setMotion();});reduced.addEventListener('change',setMotion);
function layout(){markerTarget(home);}
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)followAnchor(d.querySelector('summary'));else if(home===d.querySelector('summary'))followAnchor(initialHome);}));
new ResizeObserver(()=>markerTarget(home)).observe(document.body);
new ResizeObserver(layout).observe($('personalizer'));document.fonts.ready.then(layout);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(markerFrame);markerFrame=0;}else{markerTarget(home);}});
window.createProductDemo((button,message)=>{animateContent($('demo-content'));followAnchor(initialHome);$('announcer').textContent=message;});
setMotion();layout();
})();
