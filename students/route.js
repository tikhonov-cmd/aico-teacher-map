(()=>{'use strict';
const stages=[
 {id:'p1',code:'P1',name:'Старт курса',short:'Старт курса',time:'В начале курса',description:'Ты начинаешь учиться по обычной программе. Команда расскажет об исследовании и условиях участия.',actions:['Ознакомься с информацией об исследовании и документами своего вуза.','Уточни, где будут появляться даты, инструкции и сообщения команды.'],note:'Точные сроки определяются календарём твоего курса.'},
 {id:'p2',code:'P2',name:'Входной тест',short:'Исходный замер',time:'До выдачи доступа к AICO',description:'Перед запуском AICO команда фиксирует исходный уровень и учебный контекст участников.',actions:['Пройди входной тест и опросы, если они предусмотрены на твоём курсе.','Следуй инструкции к замеру: правила использования ИИ определяются отдельно.'],note:'Набор тестов, опросов и данных зависит от курса. Этот этап помогает точнее сравнить условия обучения.'},
 {id:'r',code:'R',name:'Распределение доступа',short:'Доступ к AICO',time:'После исходного замера',description:'Команда сообщает, назначен ли тебе доступ к AICO. С этого момента участники учатся в согласованных условиях.',actions:['Если доступ назначен, открой ссылку из сообщения команды и проверь вход.','Если доступа нет, продолжай учиться по обычной программе. Общие замеры остаются частью маршрута. После окончания экспериментального периода ты тоже получишь доступ к платформе.'],note:'Активности внутри AICO не дают официальных баллов и не становятся условием допуска.'},
 {id:'t1',code:'T1',name:'Промежуточный тест',short:'Промежуточный тест',time:'Если предусмотрен на курсе',description:'Небольшой замер помогает понять, как проходит обучение и с какими трудностями сталкиваются участники.',actions:['Выполни тест по инструкции команды курса.','Если предусмотрен опрос, расскажи о нагрузке, использовании ИИ и технических проблемах.'],note:'Формат, срок и правила использования ИИ подтверждаются отдельно. Не на каждом курсе этот этап будет проводиться.'},
 {id:'t2',code:'T2',name:'Итоговый тест',short:'Итоговый тест',time:'В конце основного периода',description:'Главный замер исследования: что ты понимаешь и можешь применить самостоятельно.',actions:['Выполни предметный тест без AICO, других ИИ-сервисов и поиска ответов в интернете.','Следуй общей инструкции и заполни итоговые опросы, если они предусмотрены.'],note:'Дата и содержание теста привязаны к твоему курсу. Количество сообщений в AICO не заменяет самостоятельный результат.'},
 {id:'t3',code:'T3',name:'Проверка спустя время',short:'Пост-тест',time:'После итогового теста · если подтверждён',description:'Отсроченный замер помогает понять, что сохранилось в памяти и как знания работают в новой ситуации.',actions:['Уточни у команды, будет ли этот этап на твоём курсе.','Если он проводится, выполни задания самостоятельно, без AICO, других ИИ-сервисов и поиска ответов в интернете.'],note:'Возможность и дату пост-теста подтверждают отдельно. Он не обязательно повторяет задания итогового теста.'}
];


const $=id=>document.getElementById(id);let active=0;const navButtons=[];
function renderStage(){const s=stages[active];
 $('event-title').textContent=s.name;
 $('event-code').textContent=`Этап ${active+1} из ${stages.length}`;
 $('event-time').textContent=s.time;$('event-note').textContent=s.note;
 $('next').disabled=active===stages.length-1;$('previous').disabled=active===0;
 $('next-text').textContent=active===stages.length-1?'Последний этап':'Дальше';
 const body=$('stage-body');body.replaceChildren();
 const p=document.createElement('p');p.className='event-description';p.textContent=s.description;
 const heading=document.createElement('h3');heading.textContent='Что нужно сделать';
 const list=document.createElement('ul');list.className='event-actions';
 s.actions.forEach(t=>{const li=document.createElement('li');li.textContent=t;list.append(li);});body.append(p,heading,list);
}
function selectStage(i,writeHash=true){active=i;navButtons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));renderStage();
 if(writeHash&&location.hash!==`#stage-${stages[i].id}`)history.pushState(null,'',`#stage-${stages[i].id}`);
 $('announcer').textContent=`Этап ${i+1} из 6. ${stages[i].name}. ${stages[i].time}.`;
}
stages.forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button');
 b.type='button';b.className='route-button';b.setAttribute('aria-pressed',String(i===0));b.setAttribute('aria-controls','event-copy');
 const optional=s.id==='t1'||s.id==='t3';
 b.innerHTML=`<span class="route-num">0${i+1}</span><span class="route-title">${s.name}<span class="route-code">${optional?'Если предусмотрен курсом':s.time}</span></span>`;
 b.addEventListener('click',()=>selectStage(i));
 b.addEventListener('keydown',e=>{let j=i;if(e.key==='ArrowRight'||e.key==='ArrowDown')j=(i+1)%6;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')j=(i+5)%6;else if(e.key==='Home')j=0;else if(e.key==='End')j=5;else return;e.preventDefault();navButtons[j].focus({preventScroll:true});selectStage(j);});
 li.append(b);$('route-nav').append(li);navButtons.push(b);
});
$('next').addEventListener('click',()=>{if(active<5)selectStage(active+1);});
$('previous').addEventListener('click',()=>{if(active>0)selectStage(active-1);});
function fromHash(){const m=/^#stage-(p1|p2|r|t1|t2|t3)$/.exec(location.hash);selectStage(m?stages.findIndex(s=>s.id===m[1]):0,false);}
window.addEventListener('hashchange',fromHash);window.addEventListener('popstate',fromHash);
fromHash();})();
