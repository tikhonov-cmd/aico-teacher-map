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
    "title": "Карточки помогли запомнить — или тест стал легче?",
    "situation": "Учебный пример: группа стала повторять материал по карточкам. Доля верных ответов выросла с 60% до 80%. Но второй тест содержал больше знакомых задач. Что именно улучшило результат?",
    "alternative": "Знакомые задачи проще решить. Результат мог вырасти и без нового способа подготовки.",
    "design": "Случайно распределить студентов между повторением по карточкам и перечитыванием конспекта. Дать одинаковое время на подготовку и общий новый тест.",
    "caseTitle": "Стоит ли переходить на карточки?",
    "caseText": "Одна группа перешла на карточки, другая продолжила перечитывать конспект. Обеим дали дополнительное занятие. Способ подготовки студенты выбрали сами.",
    "metric": "Доля верных ответов",
    "treatment": "Карточки",
    "control": "Конспект",
    "before": 60,
    "after": 80,
    "controlAfter": 70
  },
  "minecraft": {
    "title": "Чертёж помог — или дом стал попроще?",
    "situation": "Учебная модель по мотивам Minecraft: команда начала строить по чертежам. Доля домов, законченных за час, выросла с 60% до 80%. Но вместо замков теперь строят небольшие коттеджи. Что сработало?",
    "alternative": "Коттедж быстрее построить, чем замок. Без чертежей результат тоже мог улучшиться.",
    "design": "Случайно разделить игроков на группы с чертежом и без. Дать одинаковые материалы, время и проекты сопоставимой сложности."
  },
  "dune": {
    "title": "Новая навигация или день без песчаной бури?",
    "situation": "Учебная модель по мотивам «Дюны»: после обучения навигации доля отрядов, вернувшихся вовремя, выросла с 50% до 70%. Одновременно стихли песчаные бури. Насколько помогло обучение?",
    "alternative": "В спокойную погоду двигаться проще. Рост результата ещё не доказывает эффект обучения.",
    "design": "В симуляторе случайно назначить отрядам новую или обычную подготовку. Проверить их на сопоставимых маршрутах при одинаковой погоде."
  },
  "sims": {
    "title": "Сим научился готовить. Или мы просто сменили плиту?",
    "situation": "Учебная модель по мотивам The Sims: после кулинарных уроков доля ужинов без пожара выросла с 40% до 80%. В тот же день старую плиту заменили новой. Сертификат шефа пока подождёт.",
    "alternative": "Новая плита могла снизить число пожаров и без уроков. Два изменения произошли одновременно.",
    "design": "В симуляторе случайно распределить персонажей между уроками и обычной практикой. Оставить одинаковые плиты и рецепты. Огнетушители — тоже."
  }
};
  const formats = {
    read: ['Разобраться в теме до лекции', 'Прочитай объяснение в удобной тебе подаче.'],
    test: ['Проверить, что уже понятно', 'Выбери ответ и посмотри, почему он подходит или не подходит.'],
    case: ['Попробовать знания в деле', 'Примени идею к новой ситуации, затем сравни своё решение с разбором.'],
    chat: ['Разобрать то, что осталось непонятным', 'В AICO можно задать свой вопрос. Здесь выбери один из примеров.']
  };
  function paragraphs(items) { return items.map(text => `<p>${text}</p>`).join(''); }
  function read(theme) {
    const explanations = [
      `${theme.alternative} Чтобы понять эффект изменения, нужно оценить, что произошло бы без него в тот же период. Одного сравнения «до и после» для этого мало.`,
      `${theme.alternative} Это смешивающий фактор: вместе с нашим изменением меняются и другие условия, влияющие на результат. Нужна контрольная группа — она помогает оценить, что было бы без вмешательства.`,
      `Причинный эффект — разность между результатом при вмешательстве Y(1) и без него Y(0). Для одного и того же участника в одном сценарии мы наблюдаем только один исход. Сравнение «до и после» не восстанавливает недостающий контрфактический исход: одновременно изменились условия. Рандомизация делает группы сопоставимыми в среднем, но оценка всё равно имеет статистическую неопределённость.`
    ];
    return `<h4>${theme.title}</h4>${paragraphs([theme.situation, explanations[state.level]])}<p><strong>Как проверить.</strong> ${theme.design}</p>`;
  }
  const quizQuestions = [
  {
    "title": "Карточки работают — или их выбирают самые мотивированные?",
    "context": "Студенты сами выбрали способ подготовки. Среди использовавших карточки новый тест прошли 80%, среди остальных — 60%. Можно ли считать разницу в 20 процентных пунктов эффектом карточек?",
    "answers": [
      "Да: достаточно вычесть 60% из 80%.",
      "Нет: группы могли различаться мотивацией и исходными знаниями.",
      "Да, если собрать данные ещё у тысячи студентов."
    ],
    "correct": 1,
    "feedback": [
      "Это разница результатов, но в неё могут входить и эффект карточек, и исходные различия между студентами.",
      "Верно. Более мотивированные студенты могли чаще выбирать карточки. Без сопоставимых групп мы не отделим эффект способа подготовки от этих различий.",
      "Большая выборка уменьшает случайную погрешность, но не устраняет самоотбор: группы всё ещё могут различаться до подготовки."
    ]
  },
  {
    "title": "Как проверить новый способ подготовки?",
    "context": "Теперь нужно оценить именно эффект предложения карточек. Как организовать сравнение?",
    "answers": [
      "Случайно предложить карточки половине студентов, дать всем одинаковое время и общий тест.",
      "Сравнить эту группу с прошлогодней: тогда тема была другой.",
      "Сравнить только тех, кто активно пользовался карточками, с теми, кто отказался."
    ],
    "correct": 0,
    "feedback": [
      "Верно. Случайное распределение делает группы сопоставимыми в среднем. Сравнивать нужно всех по назначенным группам, включая тех, кто не стал пользоваться предложенными карточками.",
      "Другой год и другая тема добавляют различия. Нельзя уверенно приписать весь результат способу подготовки.",
      "Так снова возникает самоотбор. Активные пользователи карточек могут отличаться мотивацией и исходной подготовкой."
    ]
  }
];
  function quiz() {
    const q = quizQuestions[state.question];
    return `<h4>${q.title}</h4>${paragraphs([q.context])}<div class="demo-answers" role="group" aria-label="Выбери ответ">${q.answers.map((label, i) => `<button type="button" data-answer="${i}" aria-pressed="false">${label}</button>`).join('')}</div><div id="quiz-feedback" class="demo-feedback" role="status" aria-live="polite" hidden></div><button type="button" class="demo-action" id="next-question">${state.question === 0 ? 'Следующий вопрос' : 'К первому вопросу'}</button>`;
  }
  function caseStudy(theme) {
    const gain = theme.after - theme.before, background = theme.controlAfter - theme.before, effect = gain - background;
    const asks = [
      'Какую часть улучшения можно было бы связать с изменением, если бы без него обе группы улучшались одинаково? Хватит ли этих чисел для уверенного решения?',
      'Сравни прирост показателя в двух группах. Оцени эффект методом разности разностей и назови условие, без которого причинный вывод не получится.',
      'Рассчитай DiD-оценку и сформулируй предпосылку параллельных трендов. Достаточно ли совпадения исходных уровней, чтобы считать её выполненной?'
    ];
    const answers = [
      `В группе с изменением рост составил ${gain} процентных пунктов, без него — ${background}. Если общий фон влиял на группы одинаково, оставшиеся ${effect} процентных пунктов можно связать с изменением. Но группы не распределяли случайно: сначала нужно проверить, не различались ли они по другим важным условиям.`,
      `Разность разностей: (${theme.after} − ${theme.before}) − (${theme.controlAfter} − ${theme.before}) = ${effect} процентных пунктов. Это предварительная оценка эффекта, если без вмешательства показатели двух групп менялись бы параллельно. Проверь более ранние периоды, состав групп и другие изменения. Для вывода о надёжности нужны также размеры выборок и оценка неопределённости.`,
      `DiD = (${theme.after} − ${theme.before}) − (${theme.controlAfter} − ${theme.before}) = ${effect} процентных пунктов. Для причинного вывода нужны параллельные тренды без вмешательства, отсутствие влияния на контроль и отдельных изменений в группах. Равные исходные уровни не доказывают параллельность трендов. Без размеров выборок и структуры данных доверительный интервал не оценить.`
    ];
    return `<h4>${theme.caseTitle}</h4>${paragraphs([theme.caseText])}<table class="demo-table"><caption>${theme.metric}. Условные данные.</caption><thead><tr><th scope="col">Группа</th><th scope="col">До</th><th scope="col">После</th></tr></thead><tbody><tr><th scope="row">${theme.treatment}</th><td>${theme.before}%</td><td>${theme.after}%</td></tr><tr><th scope="row">${theme.control}</th><td>${theme.before}%</td><td>${theme.controlAfter}%</td></tr></tbody></table>${paragraphs([asks[1]])}<button type="button" class="demo-action" id="case-reveal" aria-expanded="false" aria-controls="case-feedback">Показать разбор</button><div id="case-feedback" class="demo-feedback" hidden>${paragraphs([answers[1]])}</div>`;
  }
  const questions = ['Зачем случайное распределение, если люди всё равно разные?', 'Может ли большая выборка исправить плохой эксперимент?', 'Что делать, если карточки уже получили все?'];
  const replies = [
    [
      'Люди действительно разные. Случайное распределение нужно, чтобы в одну группу не попали преимущественно хорошо подготовленные студенты, а в другую — студенты, впервые знакомящиеся с темой. Оно не делает людей одинаковыми, но помогает сравнивать группы без систематического преимущества одной из них.',
      'Рандомизация не уравнивает каждого участника с другим. Она убирает систематическую связь между попаданием в группу и исходными особенностями людей. В конкретной выборке различия всё равно возможны, поэтому важны объём данных и оценка неопределённости результата.',
      'Случайное назначение делает вмешательство независимым от потенциальных исходов в среднем по возможным распределениям. Это позволяет оценивать эффект назначения по разнице средних, если группы не влияют друг на друга и результат измеряется сопоставимо. В конечной выборке баланс не гарантирован, а дифференциальные потери наблюдений могут внести смещение.'
    ],
    [
      'Нет. Если карточки выбирают прежде всего самые мотивированные студенты, миллион наблюдений не сделает их похожими на остальных. Большое число данных помогает точнее измерить разницу, но не объясняет, чем она вызвана.',
      'Нужно различать случайную погрешность и систематическое смещение. Большая выборка обычно уменьшает первую. Но самоотбор, разные сезоны или неверная контрольная группа могут смещать оценку независимо от размера выборки.',
      'Рост выборки может уменьшать дисперсию оценки, не устраняя её смещение. Узкий доверительный интервал вокруг смещённой оценки не решает проблему идентификации причинного эффекта. Сначала нужны обоснованные дизайн и допущения, затем — расчёт неопределённости.'
    ],
      [
      'Тогда простого сравнения двух одновременных групп уже нет. Можно поискать похожие учебные группы, где карточки не использовали, и изучить изменения за несколько периодов. Но если подходящего сравнения нет, честный вывод — пока нельзя уверенно отделить эффект карточек от других причин.',
      'Можно рассмотреть разность разностей с сопоставимой группой без карточек или анализ временного ряда. Нужно обосновать, что без карточек динамика была бы сравнимой, и проверить, какие ещё изменения совпали с запуском. Выбор метода зависит от доступных данных.',
      'Возможны квазиэкспериментальные подходы: DiD при обоснованных параллельных трендах, синтетический контроль или прерванный временной ряд. Каждый требует своих допущений; длинная история наблюдений сама по себе не заменяет контрфактическое сравнение. При одновременных изменениях без подходящего контроля эффект может остаться неидентифицируемым.'
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
    $('demo-content').innerHTML = state.format === 'read' ? read(themes[state.interest]) : state.format === 'case' ? caseStudy(themes.plain) : state.format === 'test' ? quiz() : chat();
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
      measure('case',caseStudy(themes.plain),'compact');
      for(state.level=0;state.level<3;state.level++){
        for(const theme of Object.values(themes))measure('read',read(theme),state.level===0?'compact':'expanded');
        for(const reply of replies)measure('chat',chat().replace('<div id="chat-reply" class="demo-feedback" aria-live="polite" hidden></div>',`<div class="demo-feedback">${paragraphs([reply[state.level]])}</div>`));
      }
      for(state.question=0;state.question<quizQuestions.length;state.question++){
        measure('test',quiz(),'compact');
        for(const feedback of quizQuestions[state.question].feedback)measure('test',quiz().replace('<div id="quiz-feedback" class="demo-feedback" role="status" aria-live="polite" hidden></div>',`<div class="demo-feedback">${paragraphs([feedback])}</div>`));
      }
      measure('case',caseStudy(themes.plain).replace('id="case-feedback" class="demo-feedback" hidden','id="case-feedback" class="demo-feedback"').replace('Показать разбор','Скрыть разбор'));
    } finally {Object.assign(state,saved);}
  },{twoSizes:true});
};
