/* Authored examples illustrate the product; no live course or AI requests.
   Causal-inference reference: https://www.worldbank.org/en/programs/sief-trust-fund/publication/impact-evaluation-in-practice */
window.createProductDemo = function (onChange) {
  const $ = id => document.getElementById(id);
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
    case: ['Попробовать знания в деле', 'Пройди три шага: выбери показатель, посчитай результат и реши, что делать дальше.'],
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
  const caseState = { step: 0, passed: [false, false, false] };
  const caseChoices = [
    {
      title: 'Что считать успехом?',
      prompt: 'Цель редакции — больше дослушанных выпусков. Какой показатель выберешь до начала теста?',
      answers: ['Долю открывших выпуск среди увидевших анонс.', 'Долю дослушавших среди всех, кому показали анонс.', 'Долю дослушавших только среди открывших выпуск.'],
      correct: 1,
      feedback: ['Открытие — лишь первый шаг. Заголовок может привлечь клики, но не привести к дослушиванию.', 'Этот показатель учитывает весь путь от анонса до конца выпуска. Знаменатель — вся группа, которой показали вариант.', 'Так мы исключим тех, кто не открыл выпуск. А заголовок влияет и на открытие: сравнение только слушателей потеряет часть его эффекта.']
    },
    null,
    {
      title: 'Выбирать победителя уже можно?',
      prompt: 'У A дослушали 8%, у B — 6,4%. Редактор предлагает сразу заменить все анонсы на A. Что ответишь?',
      answers: ['Согласен: любое преимущество означает, что A надёжно лучше.', 'Лучше выбрать B: он привёл больше открытий.', 'A впереди в этих данных. Сначала оценим неопределённость разницы и сверимся с заранее заданным правилом решения.'],
      correct: 2,
      feedback: ['Наблюдаемая разница могла частично возникнуть случайно. Одних процентов недостаточно для уверенного вывода.', 'Открытий больше, но цель — дослушивания. По выбранному показателю B сейчас уступает.', 'Разница — 1,6 процентного пункта в пользу A. Для решения нужна оценка её точности, например доверительный интервал, и заранее выбранный порог полезного эффекта.']
    }
  ];
  function feedback(element, correct, explanation) {
    element.dataset.result = correct ? 'correct' : 'incorrect';
    element.innerHTML = `<p><strong>${correct ? 'Верно.' : 'Неверно.'}</strong> ${explanation.replace(/^Верно[.:]\s*/, '')}</p>`;
    element.hidden = false;
  }
  function markAnswer(button, selector, correct) {
    document.querySelectorAll(selector).forEach(b => {
      b.setAttribute('aria-pressed', String(b === button));
      delete b.dataset.result;
    });
    button.dataset.result = correct ? 'correct' : 'incorrect';
  }
  function caseStudy() {
    const step = caseState.step;
    if (step === 3) return `<p class="demo-progress">Кейс завершён · 3 шага</p><h4>Клики — ещё не цель</h4><p>Ты выбрал долю дослушавших среди всех увидевших анонс: <strong>A — 8%, B — 6,4%</strong>. Преимущество A в этих данных — 1,6 процентного пункта.</p><p>B привлёк больше открытий, но до конца выпуска дошло меньше людей. Поэтому сначала выбираем показатель под задачу, затем сравниваем доли и оцениваем неопределённость.</p><p><strong>Следующий шаг редакции:</strong> рассчитать доверительный интервал разницы и принять решение по заранее выбранному правилу. Эти данные сами по себе ещё не объявляют победителя.</p><button type="button" class="demo-action" id="case-restart">Пройти заново</button>`;
    const table = `<table class="demo-table"><caption>Условные данные. В каждой группе анонс увидели 1000 человек.</caption><thead><tr><th scope="col">Заголовок</th><th scope="col">Открыли</th><th scope="col">Дослушали</th></tr></thead><tbody><tr><th scope="row">A: «Как спят птицы»</th><td>100</td><td>80</td></tr><tr><th scope="row">B: «Сон на лету — это как?»</th><td>160</td><td>64</td></tr></tbody></table>`;
    const task = step === 1
      ? `<h4>Кликнули чаще. А дослушали?</h4><p>2000 студентов случайно разделили на две группы по 1000. Выпуск, место и время показа одинаковые; различаются только заголовки.</p>${table}<p>Посчитай долю дослушавших <strong>среди всех увидевших анонс</strong> в каждой группе.</p><form id="case-calculation" novalidate><div class="case-fields"><label for="case-rate-a">Вариант A, %<input id="case-rate-a" name="rateA" inputmode="decimal" type="text" autocomplete="off" aria-describedby="case-feedback"></label><label for="case-rate-b">Вариант B, %<input id="case-rate-b" name="rateB" inputmode="decimal" type="text" autocomplete="off" aria-describedby="case-feedback"></label></div><button class="demo-action" type="submit">Проверить расчёт</button></form>`
      : `<h4>${caseChoices[step].title}</h4>${step === 0 ? '<p>Ты помогаешь редакции научного подкаста сравнить два заголовка анонса одного выпуска: A — «Как спят птицы», B — «Сон на лету — это как?».</p>' : ''}<p>${caseChoices[step].prompt}</p><div class="demo-answers" role="group" aria-label="Твоё решение">${caseChoices[step].answers.map((label,i)=>`<button type="button" data-case-answer="${i}" aria-pressed="false">${label}</button>`).join('')}</div>`;
    return `<p class="demo-progress">Шаг ${step + 1} из 3 · ${['Выбираем показатель', 'Считаем результат', 'Принимаем решение'][step]}</p>${task}<div id="case-feedback" class="demo-feedback" role="status" aria-live="polite" hidden></div><button type="button" class="demo-action" id="case-next" hidden>${step === 2 ? 'Собрать вывод' : 'Следующий шаг'}</button>`;
  }
  function advanceCase() {
    render();
    const heading = $('demo-content').querySelector('h4');
    heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true });
    onChange(null, caseState.step === 3 ? 'Кейс завершён.' : `Шаг ${caseState.step + 1} из 3.`);
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
      const answer = Number(button.dataset.answer), q = quizQuestions[state.question];
      markAnswer(button, '[data-answer]', answer === q.correct);
      feedback($('quiz-feedback'), answer === q.correct, q.feedback[answer]);
    } else if (button.id === 'next-question') {
      state.question = (state.question + 1) % quizQuestions.length; render();
      $('demo-content').querySelector('h4').setAttribute('tabindex', '-1');
      $('demo-content').querySelector('h4').focus({preventScroll:true});
      onChange(null, `Вопрос ${state.question + 1} из ${quizQuestions.length}.`);
    } else if (button.dataset.caseAnswer !== undefined) {
      const q = caseChoices[caseState.step], answer = Number(button.dataset.caseAnswer);
      const correct = answer === q.correct;
      markAnswer(button, '[data-case-answer]', correct);
      feedback($('case-feedback'), correct, q.feedback[answer]);
      caseState.passed[caseState.step] = correct;
      $('case-next').hidden = !correct;
    } else if (button.id === 'case-next' && caseState.passed[caseState.step]) {
      caseState.step++; advanceCase();
    } else if (button.id === 'case-restart') {
      caseState.step = 0; caseState.passed.fill(false); advanceCase();
    } else if (button.dataset.question !== undefined) {
      document.querySelectorAll('[data-question]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      $('chat-reply').innerHTML = paragraphs([replies[Number(button.dataset.question)][state.level]]); $('chat-reply').hidden = false;
    }
  });
  $('demo-content').addEventListener('submit', e => {
    if (e.target.id !== 'case-calculation') return;
    e.preventDefault();
    const inputs = [$('case-rate-a'), $('case-rate-b')];
    const values = inputs.map(input => input.value.trim().replace(',', '.'));
    const valid = values.map(value => /^\d+(?:\.\d+)?$/.test(value));
    const correct = valid.every(Boolean) && Number(values[0]) === 8 && Number(values[1]) === 6.4;
    inputs.forEach((input,i) => input.setAttribute('aria-invalid', String(!valid[i] || Number(values[i]) !== [8, 6.4][i])));
    caseState.passed[1] = correct;
    feedback($('case-feedback'), correct, correct
      ? 'A: 80 / 1000 × 100 = 8%. B: 64 / 1000 × 100 = 6,4%. У B больше открытий, но доля дослушавших ниже.'
      : !valid.every(Boolean) ? 'Введи два числа в процентах. Дробную часть можно отделить точкой или запятой.'
      : 'Раздели число дослушавших на всех 1000 увидевших анонс и умножь на 100. Число открывших здесь не знаменатель. Попробуй ещё раз.');
    $('case-next').hidden = !correct;
  });
  $('demo-content').addEventListener('input', e => {
    if (!e.target.closest('#case-calculation')) return;
    caseState.passed[1] = false; $('case-next').hidden = true;
    $('case-feedback').hidden = true;
    e.target.removeAttribute('aria-invalid');
  });
  render();
};
