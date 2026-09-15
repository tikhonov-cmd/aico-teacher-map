(()=>{'use strict';
if(/^#stage-(p1|p2|r|t1|t2|t3)$/.test(location.hash)||location.hash==='#route'){location.replace('route.html'+location.hash);return;}
const $=id=>document.getElementById(id), reduced=matchMedia('(prefers-reduced-motion: reduce)');
const modes={
 brief:{name:'сразу суть',title:'Один курс. Разный опыт.',body:'<p>Ты учишься по программе своего курса. Часть участников получает доступ к AICO, часть учится без него.</p><p>Общие замеры помогают сравнить, что участники понимают и умеют применять самостоятельно.</p>',status:'Собрали главное об участии.'},
 steps:{name:'по шагам',title:'Разложим по порядку.',body:'<ol><li><strong>Начни с курса.</strong> Ознакомься с исследованием и пройди исходные замеры по инструкции.</li><li><strong>Узнай свои условия.</strong> Команда сообщит, назначен ли тебе доступ к AICO.</li><li><strong>Учись и проходи замеры.</strong> Они помогут сравнить самостоятельный результат участников.</li></ol>',status:'Разложили участие по шагам.'},
 example:{name:'на примере',title:'Представь: начинается курс.',body:'<p>Ты и другой участник изучаете один предмет. Тебе назначили доступ к AICO, ему — нет. Учебная программа у вас общая.</p><p>В конце вы выполняете итоговый тест <strong>самостоятельно, без ИИ.</strong> Эти результаты и исходные замеры помогают исследовать различия в обучении.</p>',status:'Показали участие на примере.'}
};
let mode='brief',motionOff=reduced.matches,manualOff=false;
const modeButtons=[...document.querySelectorAll('.mode-button')];
function animateContent(el){el.getAnimations().forEach(a=>a.cancel());if(!motionOff)el.animate([{opacity:.55,transform:'translateY(8px)',clipPath:'inset(0 0 8% 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0)'}],{duration:380,easing:'cubic-bezier(.16,1,.3,1)'});}
function setMode(next){if(next===mode)return;mode=next;document.querySelectorAll('a[href^="route.html"]').forEach(a=>a.href='route.html?mode='+mode);modeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));$('response-title').innerHTML=modes[mode].title;$('response-body').innerHTML=modes[mode].body;$('mode-status').textContent=modes[mode].status;animateContent($('explanation'));moveWash();visitChoice();$('announcer').textContent=`Объясняем ${modes[mode].name}. Объяснение исследования обновлено.`;}
modeButtons.forEach((b,i)=>{b.addEventListener('click',()=>setMode(b.dataset.mode));b.addEventListener('keydown',e=>{let j=i;if(e.key==='ArrowRight')j=(i+1)%3;else if(e.key==='ArrowLeft')j=(i+2)%3;else if(e.key==='Home')j=0;else if(e.key==='End')j=2;else return;e.preventDefault();modeButtons[j].focus();setMode(modeButtons[j].dataset.mode);});});
function moveWash(){const b=modeButtons.find(b=>b.dataset.mode===mode),parent=$('mode-switch').getBoundingClientRect(),r=b.getBoundingClientRect();$('choice-wash').style.width=r.width+'px';$('choice-wash').style.transform=`translateX(${r.left-parent.left}px)`;}
// The companion visits the selected control and settles at the explanation margin.
const marker=$('companion'),markerState={x:0,y:0,vx:0,vy:0,tx:0,ty:0},initialHome=$('response-title');let home=initialHome;let markerFrame=0,markerTimer=0,markerLast=0,atChoice=false;
function markerTarget(el,choice=false){const p=document.body.getBoundingClientRect(),r=el.getBoundingClientRect(),size=marker.offsetWidth,inside=el.matches('summary,.stage-mode');markerState.tx=choice?r.left-p.left+5:inside?r.left-p.left+1:r.left-p.left-size-9;markerState.ty=choice?r.top-p.top+(r.height-size)/2:inside?r.top-p.top+(el.matches('summary')?(r.height-size)/2:0):r.top-p.top+8;marker.classList.toggle('home',!choice);if(motionOff){markerState.x=markerState.tx;markerState.y=markerState.ty;markerState.vx=markerState.vy=0;paintMarker();}else if(!markerFrame){markerLast=performance.now();markerFrame=requestAnimationFrame(markerTick);}}
function paintMarker(){marker.style.visibility='visible';marker.style.transform=`translate(${markerState.x}px,${markerState.y}px) rotate(${Math.max(-18,Math.min(18,markerState.vx*2))}deg)`;}
function markerTick(t){markerFrame=0;const dt=Math.min((t-markerLast)/16.667||1,2);markerLast=t;let moving=false;for(const axis of ['x','y']){const v='v'+axis;markerState[v]=(markerState[v]+(markerState['t'+axis]-markerState[axis])*.10*dt)*Math.pow(.64,dt);markerState[axis]+=markerState[v]*dt;if(Math.abs(markerState['t'+axis]-markerState[axis])>.08||Math.abs(markerState[v])>.08)moving=true;else{markerState[axis]=markerState['t'+axis];markerState[v]=0;}}paintMarker();if(moving&&!motionOff&&!document.hidden)markerFrame=requestAnimationFrame(markerTick);}
function followAnchor(el){clearTimeout(markerTimer);atChoice=false;home=el;markerTarget(home);}
function visitChoice(){clearTimeout(markerTimer);home=initialHome;atChoice=true;markerTarget(modeButtons.find(b=>b.dataset.mode===mode),true);markerTimer=setTimeout(()=>{atChoice=false;markerTarget(home);},motionOff?0:650);}
// Typography scene follows the user's «СЕКРЕТ» reference.
const letterScene=window.createLetterScene();
$('reshape').addEventListener('click',()=>{letterScene.shuffle();$('announcer').textContent='Буквы заголовка набраны разными шрифтами.';});
$('reset-type').addEventListener('click',()=>{letterScene.reset();$('reshape').focus({preventScroll:true});$('announcer').textContent='Буквы снова набраны исходным шрифтом.';});
$('wave-type').addEventListener('click',()=>{if(motionOff){$('announcer').textContent='Движение выключено.';return;}letterScene.pulse();});
function setMotion(){motionOff=manualOff||reduced.matches;document.documentElement.dataset.motion=motionOff?'off':'on';$('motion-toggle').setAttribute('aria-pressed',String(motionOff));$('motion-label').textContent=motionOff?'Движение выключено':'Без движения';$('type-hint').textContent='Нажми на фразу. Пять нажатий включают быстрый ритм.';if(motionOff){cancelAnimationFrame(markerFrame);markerFrame=0;clearTimeout(markerTimer);atChoice=false;document.getAnimations().forEach(a=>a.cancel());markerTarget(home);}moveWash();letterScene.setMotion(motionOff);}
$('motion-toggle').addEventListener('click',()=>{if(reduced.matches){$('announcer').textContent='Движение отключено в настройках устройства.';return;}manualOff=!manualOff;setMotion();});reduced.addEventListener('change',setMotion);
function layout(){moveWash();markerTarget(atChoice?modeButtons.find(b=>b.dataset.mode===mode):home,atChoice);}
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)followAnchor(d.querySelector('summary'));else if(home===d.querySelector('summary'))followAnchor(initialHome);}));
new ResizeObserver(()=>markerTarget(atChoice?modeButtons.find(b=>b.dataset.mode===mode):home,atChoice)).observe(document.body);
new ResizeObserver(layout).observe($('personalizer'));document.fonts.ready.then(layout);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(markerFrame);markerFrame=0;}else{markerTarget(home);}});
setMotion();layout();
})();
