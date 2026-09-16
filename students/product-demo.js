/* Authored examples illustrate the product; no live course or AI requests.
   Causal-inference reference: https://www.worldbank.org/en/programs/sief-trust-fund/publication/impact-evaluation-in-practice */
window.createProductDemo = function (onChange) {
  const $ = id => document.getElementById(id);
  let panelSizer;
  const state = { format: 'read', level: 0, interest: 'plain', question: 0 };
  const names = { read: 'Лонгрид', test: 'Тест', case: 'Кейс', chat: 'Чат' };
  const levels = [
    'Без сложных терминов, с объяснением каждого шага.',
    'Больше деталей: определения, формула и разбор примера.',
    'Точнее в терминах: условия, обозначения и границы применимости.'
  ];
  const themes = {
  "plain": {
    "title": "Мини-карта помогает пройти квест?",
    "goal": "На научном фестивале участники ищут следующую станцию. Нужно понять, поможет ли мини-карта добраться до неё за 10 минут.",
    "a": "текстовая подсказка",
    "b": "та же подсказка с мини-картой",
    "conditions": "Маршрут и время одинаковые; участники идут по одному и не обмениваются подсказками.",
    "result": "До станции вовремя дошли 60 из 100 участников A и 75 из 100 участников B."
  },
  "minecraft": {
    "title": "Чертёж помогает закончить постройку?",
    "goal": "Новички в Minecraft строят маяк по заданию. Нужно понять, поможет ли чертёж закончить его без ошибок за 20 минут.",
    "a": "текстовая инструкция",
    "b": "та же инструкция с чертежом",
    "conditions": "Модель маяка, материалы и время одинаковые; каждый строит отдельно.",
    "result": "Маяк вовремя и без ошибок построили 60 из 100 игроков A и 75 из 100 игроков B."
  },
  "astro": {
    "title": "Звёзды резче с новой инструкцией?",
    "goal": "В учебном симуляторе астрофото новички наводят камеру на резкость. Помогут ли образцы снимков получить резкие звёзды за 10 минут?",
    "a": "текстовая инструкция по фокусировке",
    "b": "та же инструкция с образцами резких и размытых звёзд",
    "conditions": "Симулятор, настройки камеры и время одинаковые. Резкость оценивают по одному правилу.",
    "result": "Получить резкие звёзды успели 60 из 100 участников A и 75 из 100 участников B."
  },
  "printing": {
    "title": "Первый слой без второй попытки?",
    "goal": "На занятии по 3D-печати новички настраивают принтер. Помогут ли фотографии-образцы напечатать ровный первый слой с первой попытки?",
    "a": "текстовая инструкция по настройке",
    "b": "та же инструкция с фотографиями удачного и неудачного первого слоя",
    "conditions": "Модель, пластик и тип принтера одинаковые. Качество слоя оценивают по одному правилу.",
    "result": "Ровный первый слой получили 60 из 100 участников A и 75 из 100 участников B."
  }
};
  const formats = {
    read: ['Разобраться в теме до лекции', 'Прочитай объяснение в удобной тебе подаче.'],
    test: ['Проверить, что уже понятно', 'Три самостоятельных вопроса. Всё нужное есть в условиях — лонгрид читать необязательно.'],
    case: ['Попробовать знания в деле', 'Примени идею к новой ситуации, затем сравни своё решение с разбором.'],
    chat: ['Разобрать то, что осталось непонятным', 'В AICO можно задать свой вопрос. Здесь выбери один из примеров.']
  };
  function paragraphs(items) { return items.map(text => `<p>${text}</p>`).join(''); }
  function read(theme) {
    const explanations = [
  "В группе B успехов на 15 из 100 больше: 75% − 60% = 15 процентных пунктов. Это оценка эффекта новой подсказки. Но часть разницы могла возникнуть случайно: перед выводом о пользе нужно оценить точность результата.",
  "Заранее выбираем показатель: долю участников, выполнивших задачу. Здесь A = 60%, B = 75%, разница — 15 процентных пунктов. Относительный рост — 15 / 60 = 25%. Это разные способы описать один результат. Чтобы судить об эффекте, нужен ещё доверительный интервал — оценка неопределённости разницы.",
  "Оценка эффекта назначения B: p̂B − p̂A = 0,75 − 0,60 = 0,15, то есть 15 процентных пунктов. Сравниваем всех по назначенной группе, даже если подсказкой не воспользовались. Случайное распределение позволяет оценить причинный эффект при отсутствии обмена подсказками и систематических потерь данных. Размер выборки и правило остановки задаём заранее; неопределённость отражаем доверительным интервалом."
];
    return `<h4>${theme.title}</h4><p><strong>Задача.</strong> ${theme.goal}</p><p><strong>Проверка A/B.</strong> Случайно делим 200 участников на две группы по 100. A — ${theme.a}; B — ${theme.b}. ${theme.conditions}</p><p><strong>Условный результат.</strong> ${theme.result}</p><p><strong>Вывод.</strong> ${explanations[state.level]}</p>`;
  }
  const quizQuestions = [
  {
    "title": "Две афиши — как сравнить честно?",
    "context": "Астроклуб хочет привлечь студентов на бесплатную экскурсию в обсерваторию. Есть два текста приглашения, A и B. Как проверить, какой чаще приводит к записи?",
    "answers": [
      "Показать A утром, а B вечером: так их увидят разные люди.",
      "Случайно показывать студентам A или B в один период; место публикации и условия записи оставить одинаковыми.",
      "Сравнить A в этом семестре с B в прошлом."
    ],
    "correct": 1,
    "feedback": [
      "Утром и вечером могут приходить разные люди. Разница в записях будет связана не только с текстом приглашения.",
      "Верно. Меняем текст, сохраняем условия и распределяем людей случайно. Затем сравниваем долю записавшихся среди всех, кому показали каждый вариант.",
      "За семестр могли измениться аудитория, расписание и сама экскурсия. Так трудно выделить эффект текста."
    ]
  },
  {
    "title": "60 записей лучше, чем 20?",
    "context": "На бесплатный мастер-класс по записи звука приглашали двумя способами. В случайно сформированной группе A приглашение увидели 100 человек, записались 20. В группе B его увидели 500, записались 60. У какого варианта выше доля записавшихся в этих данных?",
    "answers": [
      "У A: 20% против 12% у B.",
      "У B: 60 записей больше, чем 20.",
      "Сравнить доли нельзя: размеры групп разные."
    ],
    "correct": 0,
    "feedback": [
      "Верно: 20 / 100 = 20%, а 60 / 500 = 12%. В этих данных доля выше у A. Для вывода о надёжности различия нужно отдельно оценить неопределённость.",
      "Вариант B увидело в пять раз больше людей. Сравниваем доли среди увидевших приглашение, а не только количество записей.",
      "Доли как раз позволяют сравнить группы разного размера: 20% и 12%. Но размеры групп влияют на точность оценки."
    ]
  },
  {
    "title": "Что именно сработало в аудиогиде?",
    "context": "Музей случайно показывал посетителям две версии аудиогида. В B одновременно увеличили кнопку запуска и добавили превью записи; в A остались прежняя кнопка и отсутствие превью. В B запись запускали чаще. Какой вывод корректен?",
    "answers": [
      "Причина — большая кнопка: её легче заметить.",
      "Причина — превью: кнопку можно вернуть как было.",
      "Пока сравнили пакет из двух изменений. Вклад каждого по отдельности неизвестен."
    ],
    "correct": 2,
    "feedback": [
      "Это правдоподобное объяснение, но вместе с кнопкой изменилось и превью. Этот тест не разделяет их вклад.",
      "Превью могло помочь, но эффект кнопки и взаимодействие двух изменений тоже возможны. Отдельно их не проверяли.",
      "Верно. Даже если разница надёжна, она относится к новой версии целиком. Чтобы разделить эффекты, нужен следующий тест, например только с изменением кнопки."
    ]
  }
];
  function quiz() {
    const q = quizQuestions[state.question];
    return `<p class="demo-progress">Вопрос ${state.question + 1} из ${quizQuestions.length}</p><h4>${q.title}</h4>${paragraphs([q.context])}<div class="demo-answers" role="group" aria-label="Выбери ответ">${q.answers.map((label, i) => `<button type="button" data-answer="${i}" aria-pressed="false">${label}</button>`).join('')}</div><div id="quiz-feedback" class="demo-feedback" role="status" aria-live="polite" hidden></div><button type="button" class="demo-action" id="next-question">${state.question < quizQuestions.length - 1 ? 'Следующий вопрос' : 'К первому вопросу'}</button>`;
  }
  function caseStudy() {
    return `<h4>Кликнули чаще. А дослушали?</h4><p>Редакция научного подкаста проверяет два заголовка анонса. Цель — чтобы больше студентов дослушали выпуск. 2000 студентов случайно разделили на две группы по 1000; выпуск, место и время показа одинаковые.</p><table class="demo-table"><caption>Условные данные. В каждой группе анонс увидели 1000 человек.</caption><thead><tr><th scope="col">Заголовок</th><th scope="col">Открыли</th><th scope="col">Дослушали</th></tr></thead><tbody><tr><th scope="row">A: «Как спят птицы»</th><td>100</td><td>80</td></tr><tr><th scope="row">B: «Сон на лету — это как?»</th><td>160</td><td>64</td></tr></tbody></table><p><strong>Твоё решение.</strong> Какой заголовок ближе к цели в этих данных? Почему больше открытий ещё не означает лучший результат?</p><button type="button" class="demo-action" id="case-reveal" aria-expanded="false" aria-controls="case-feedback">Показать разбор</button><div id="case-feedback" class="demo-feedback" hidden><p>По выбранной цели впереди A: выпуск дослушали 80 / 1000 = 8%, в B — 64 / 1000 = 6,4%. Разница — 1,6 процентного пункта в пользу A. Заголовок B дал больше открытий, но меньше дослушиваний.</p><p>Знаменатель — все, кому показали анонс. Сравнение только открывших отвечает на другой вопрос. Это пока наблюдаемый результат: для решения о победителе нужно оценить неопределённость разницы.</p></div>`;
  }
  const questions = [
  "Зачем распределять случайно, если люди всё равно разные?",
  "Спасёт ли большая выборка неудачное сравнение?",
  "Почему нельзя просто сравнить «до» и «после»?"
];
  const replies = [
  [
    "Чтобы вариант A не достался, например, только опытным участникам, а B — только новичкам. Случайное распределение не делает людей одинаковыми. Оно убирает выбор группы по подготовке или желанию участника и позволяет честнее сравнить варианты.",
    "Рандомизация устраняет систематическую связь между назначенным вариантом и исходными особенностями участников. Случайные различия между группами остаются возможными, поэтому важны объём данных и оценка неопределённости.",
    "Случайное назначение делает вариант независимым от потенциальных исходов в среднем по возможным распределениям. Разница долей оценивает эффект назначения при сопоставимом измерении, отсутствии влияния групп друг на друга и систематических потерь наблюдений. Баланс в конкретной выборке не гарантирован."
  ],
  [
    "Не обязательно. Если вариант A показывают только новичкам, а B — только опытным, даже миллион наблюдений не отделит эффект варианта от опыта участников. Сначала нужно организовать сопоставимое сравнение.",
    "Большая выборка обычно уменьшает случайную погрешность. Но если группы систематически различаются, смещение может остаться. Точная оценка разницы между несопоставимыми группами ещё не показывает эффект изменения.",
    "Увеличение выборки может уменьшать дисперсию оценки, не устраняя её смещение. Даже узкий доверительный интервал не делает причинный вывод обоснованным. Нужны подходящая схема назначения, заранее выбранная метрика и корректный учёт пропусков."
  ],
  [
    "Допустим, в квест добавили карту, а на следующий день пришли участники, уже знающие маршрут. Они могли пройти быстрее и без карты. Одновременные группы A и B помогают отделить изменение подсказки от изменения аудитории.",
    "В сравнении «до и после» вместе с новой подсказкой могут измениться аудитория, погода и сложность маршрута. Без контрольной группы их влияние смешивается с эффектом подсказки. В A/B-тесте случайно назначенные варианты проверяют в один период.",
    "Для эффекта нужен результат, который был бы в тот же период без вмешательства. Прошлый результат не всегда заменяет его: возможны временной тренд, смена состава и другие одновременные изменения. Случайное назначение A и B в один период позволяет оценить этот недостающий исход на уровне групп."
  ]
];
  function chat() {
    return `<h4>Что хочется уточнить?</h4><div class="demo-chat-questions" role="group" aria-label="Выбери вопрос">${questions.map((q, i) => `<button type="button" data-question="${i}" aria-pressed="false">${q}</button>`).join('')}</div><div id="chat-reply" class="demo-feedback" aria-live="polite" hidden></div>`;
  }
  function render() {
    const themed = state.format === 'read';
    $('interest-row').hidden = !themed;
    $('level-row').hidden = state.format === 'test' || state.format === 'case';
    $('level-note').textContent = levels[state.level];
    $('response-title').textContent = formats[state.format][0];
    $('demo-purpose').textContent = formats[state.format][1];
    $('demo-content').innerHTML = state.format === 'read' ? read(themes[state.interest]) : state.format === 'case' ? caseStudy() : state.format === 'test' ? quiz() : chat();
    for (const key of ['format', 'level', 'interest']) document.querySelectorAll(`[data-${key}]`).forEach(b => b.setAttribute('aria-pressed', String(b.dataset[key] === String(state[key]))));
    panelSizer?.fit();
  }
  $('demo-controls').hidden = false;
  $('demo-controls').addEventListener('click', e => {
    const button = e.target.closest('button'); if (!button) return;
    for (const key of ['format', 'level', 'interest']) if (button.dataset[key] !== undefined) {
      const value = key === 'level' ? Number(button.dataset[key]) : button.dataset[key];
      if (state[key] === value) return;
      state[key] = value; render(); onChange(button, `${names[state.format]}. Пример обновлён.`);
    }
  });
  // Each choice group supports both Tab and arrow-key navigation.
  document.querySelectorAll('.demo-options').forEach(group => group.addEventListener('keydown', e => {
    const buttons = [...group.querySelectorAll('button')], i = buttons.indexOf(document.activeElement); if (i < 0) return;
    let next; if (e.key === 'ArrowRight') next = (i + 1) % buttons.length; else if (e.key === 'ArrowLeft') next = (i + buttons.length - 1) % buttons.length; else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = buttons.length - 1; else return;
    e.preventDefault(); buttons[next].focus(); buttons[next].click();
  }));
  $('demo-content').addEventListener('click', e => {
    const button = e.target.closest('button'); if (!button) return;
    if (button.dataset.answer !== undefined) {
      document.querySelectorAll('[data-answer]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      const answer = Number(button.dataset.answer), q = quizQuestions[state.question];
      $('quiz-feedback').innerHTML = paragraphs([q.feedback[answer]]); $('quiz-feedback').hidden = false;
    } else if (button.id === 'next-question') {
      state.question = (state.question + 1) % quizQuestions.length; render();
      $('demo-content').querySelector('h4').setAttribute('tabindex', '-1');
      $('demo-content').querySelector('h4').focus({preventScroll:true});
      onChange(null, `Вопрос ${state.question + 1} из ${quizQuestions.length}.`);
    } else if (button.id === 'case-reveal') {
      const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open)); button.textContent = open ? 'Скрыть разбор' : 'Показать разбор'; $('case-feedback').hidden = !open;
    } else if (button.dataset.question !== undefined) {
      document.querySelectorAll('[data-question]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      $('chat-reply').innerHTML = paragraphs([replies[Number(button.dataset.question)][state.level]]); $('chat-reply').hidden = false;
    }
    panelSizer?.fit();
  });
  render();
  window.stabilizePanel($('demo-controls'),(clone,sample)=>{
    clone.querySelectorAll('[hidden]').forEach(el=>el.hidden=false);
    for(const note of levels){clone.querySelector('#level-note').textContent=note;sample();}
  });
  panelSizer=window.stabilizePanel(document.querySelector('.demo-preview'), (clone, sample) => {
    const saved={...state};
    function measure(format,html,size='expanded'){
      clone.querySelector('#response-title').textContent=formats[format][0];
      clone.querySelector('#demo-purpose').textContent=formats[format][1];
      clone.querySelector('#demo-content').innerHTML=html;
      sample(size);
    }
    try {
      measure('chat',chat(),'compact');
      measure('case',caseStudy(),'compact');
      for(state.level=0;state.level<3;state.level++){
        for(const theme of Object.values(themes))measure('read',read(theme),state.level===0?'compact':'expanded');
        for(const reply of replies)measure('chat',chat().replace('<div id="chat-reply" class="demo-feedback" aria-live="polite" hidden></div>',`<div class="demo-feedback">${paragraphs([reply[state.level]])}</div>`));
      }
      for(state.question=0;state.question<quizQuestions.length;state.question++){
        measure('test',quiz(),'compact');
        for(const feedback of quizQuestions[state.question].feedback)measure('test',quiz().replace('<div id="quiz-feedback" class="demo-feedback" role="status" aria-live="polite" hidden></div>',`<div class="demo-feedback">${paragraphs([feedback])}</div>`));
      }
      measure('case',caseStudy().replace('id="case-feedback" class="demo-feedback" hidden','id="case-feedback" class="demo-feedback"').replace('Показать разбор','Скрыть разбор'));
    } finally {Object.assign(state,saved);}
  },{twoSizes:true});
};
