/* Authored examples illustrate the product; no live course or AI requests. */
window.createProductDemo = function (onChange) {
  const $ = id => document.getElementById(id);
  const state = { format: 'read', level: 0, interest: 'plain' };
  const names = { read: 'Лонгрид', test: 'Тест', case: 'Кейс', chat: 'Чат' };
  const levels = [
    'Без сложных терминов, с объяснением каждого шага.',
    'Больше деталей: определения, формула и разбор примера.',
    'Точнее в терминах: условия, обозначения и границы применимости.'
  ];
  const themes = {
    plain: { title: 'Как посчитать шанс?', situation: 'Из 20 карточек пять — синие. Ты берёшь одну наугад, и любая карточка может попасться с одинаковой вероятностью.', outcome: 'вытянуть синюю карточку', event: 'выбрана синяя карточка', case: 'В первом наборе 20 карточек, из них пять синих. Во втором — 10 карточек, из них три синие.' },
    space: { title: 'Какой шанс найти запас для полёта?', situation: 'На орбитальной станции 20 одинаковых контейнеров. В пяти лежат запасные батареи. Ты открываешь один наугад: любой контейнер может попасться с одинаковой вероятностью.', outcome: 'найти батарею', event: 'в контейнере есть батарея', case: 'На первом складе станции 20 контейнеров, из них пять с батареями. На втором — 10 контейнеров, из них три с батареями.' },
    pirates: { title: 'Какой шанс найти карту сокровищ?', situation: 'На корабле 20 одинаковых сундуков. В пяти спрятаны карты сокровищ. Ты открываешь один наугад: любой сундук может попасться с одинаковой вероятностью.', outcome: 'найти карту сокровищ', event: 'в сундуке есть карта', case: 'На первом корабле 20 сундуков, из них пять с картами сокровищ. На втором — 10 сундуков, из них три с картами.' },
    marvel: { title: 'Какой шанс получить миссию с Человеком-пауком?', situation: 'Представь колоду из 20 карточек с миссиями героев Marvel. В пяти участвует Человек-паук. Ты тянешь одну наугад: все карточки равновероятны.', outcome: 'получить миссию с Человеком-пауком', event: 'выбрана миссия с Человеком-пауком', case: 'В первой колоде 20 миссий, из них пять с Человеком-пауком. Во второй — 10 миссий, из них три с ним.' }
  };
  const formats = {
    read: ['Разобраться в теме до лекции', 'Открой лонгрид, чтобы познакомиться с темой или вернуться к трудному месту. Выбери глубину объяснения и близкие тебе примеры.'],
    test: ['Проверить, что уже понятно', 'Ответь на вопрос и посмотри объяснение. Такой формат помогает заметить, к чему стоит вернуться в материалах курса.'],
    case: ['Попробовать знания в деле', 'Разбери ситуацию, предложи решение и сравни его с разбором. Здесь важно применить идею, а не только вспомнить формулу.'],
    chat: ['Разобрать то, что осталось непонятным', 'В AICO можно задать свой вопрос по материалу. В этом примере выбери один из двух вопросов и посмотри, как меняется глубина ответа.']
  };
  function paragraphs(items) {
    return items.map(text => `<p>${text.replace(/5 ÷ 20|5 \/ 20|3 \/ 10|P(?:₁|₂)?(?:\(A\))? =/g, term => `<span class="demo-formula">${term}</span>`)}</p>`).join('');
  }
  function read(theme) {
    const explanations = [
      `Пять подходящих вариантов из двадцати — это 5 ÷ 20 = ¼, или 25%. Так мы выражаем шанс ${theme.outcome}.`,
      `Вероятность показывает долю подходящих исходов среди всех возможных. Здесь подходящих исходов пять, а всего их двадцать. Поэтому P = 5 / 20 = 0,25 = 25%. Формула работает, потому что все варианты равновероятны.`,
      `Пусть Ω — множество из 20 равновероятных исходов, а A — событие «${theme.event}». Тогда |A| = 5 и P(A) = |A| / |Ω| = 5 / 20 = 0,25. Если исходы имеют разные вероятности, одного подсчёта количества недостаточно: нужно сложить вероятности исходов, входящих в A.`
    ];
    return `<h4>${theme.title}</h4>${paragraphs([theme.situation, explanations[state.level]])}`;
  }
  function quiz() {
    const questions = [
      'Из 20 карточек пять — синие. Если взять одну наугад, каков шанс вытянуть синюю?',
      'В наборе 20 карточек, пять из них синие. Все карточки равновероятны. Чему равна вероятность выбрать синюю?',
      'В пространстве из 20 равновероятных исходов событию A благоприятствуют пять. Найди P(A).'
    ];
    return `<h4>${questions[state.level]}</h4><div class="demo-answers" role="group" aria-label="Выбери ответ">${['5%', '25%', '50%'].map((label, i) => `<button type="button" data-answer="${i}" aria-pressed="false">${label}</button>`).join('')}</div><div id="quiz-feedback" class="demo-feedback" role="status" aria-live="polite" hidden></div>`;
  }
  function caseStudy(theme) {
    const asks = ['Ты выбираешь один набор и берёшь из него один предмет наугад. Где шанс получить нужный выше? Подумай, а затем открой разбор.', 'Внутри каждого набора все варианты равновероятны. Сравни шансы получить нужный исход и выбери более выгодный набор.', 'Пусть A — нужный исход. Сравни P(A) для двух равномерных распределений: пяти подходящих исходов из двадцати и трёх из десяти.'];
    return `<h4>Где шанс выше?</h4>${paragraphs([theme.case, asks[state.level]])}<button type="button" class="demo-action" id="case-reveal" aria-expanded="false" aria-controls="case-feedback">Показать разбор</button><div id="case-feedback" class="demo-feedback" hidden>${paragraphs([
      ['Во втором наборе шанс выше: 3 из 10 — это 30%, а 5 из 20 — только 25%. Важна доля подходящих вариантов, а не просто их количество.', 'Первый набор: P₁ = 5 / 20 = 0,25. Второй: P₂ = 3 / 10 = 0,30. Выбираем второй: шанс выше на 5 процентных пунктов.', 'При равновероятных исходах P₁(A) = 5/20 = 0,25, P₂(A) = 3/10 = 0,30. Разница — 0,05, то есть 5 процентных пунктов. Большее абсолютное число подходящих исходов не гарантирует большую вероятность.'][state.level]
    ])}</div>`;
  }
  const questions = ['Почему мы делим именно на 20?', '25% — это обязательно каждый четвёртый раз?'];
  function chat() {
    return `<h4>Что хочется уточнить?</h4><div class="demo-chat-questions" role="group" aria-label="Выбери вопрос">${questions.map((q, i) => `<button type="button" data-question="${i}" aria-pressed="false">${q}</button>`).join('')}</div><div id="chat-reply" class="demo-feedback" aria-live="polite" hidden></div>`;
  }
  function render() {
    const themed = state.format === 'read' || state.format === 'case';
    $('interest-row').hidden = !themed;
    $('level-note').textContent = levels[state.level];
    $('response-title').textContent = formats[state.format][0];
    $('demo-purpose').textContent = formats[state.format][1];
    $('demo-content').innerHTML = state.format === 'read' ? read(themes[state.interest]) : state.format === 'case' ? caseStudy(themes[state.interest]) : state.format === 'test' ? quiz() : chat();
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
      document.querySelectorAll('[data-answer]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      const correct = button.dataset.answer === '1';
      const reasoning = ['Пять из двадцати — четверть: 5 ÷ 20 = 0,25, или 25%.', 'Делим число подходящих исходов на общее число: 5 / 20 = 0,25 = 25%. Все карточки равновероятны.', 'Для равномерного распределения P(A) = |A| / |Ω| = 5 / 20 = 0,25. В процентах это 25%.'][state.level];
      $('quiz-feedback').innerHTML = paragraphs([correct ? 'Да, 25%.' : 'Пока не совпало. Верный ответ — 25%.', reasoning]); $('quiz-feedback').hidden = false;
    } else if (button.id === 'case-reveal') {
      const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open)); button.textContent = open ? 'Скрыть разбор' : 'Показать разбор'; $('case-feedback').hidden = !open;
    } else if (button.dataset.question !== undefined) {
      document.querySelectorAll('[data-question]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      const replies = [
        ['Потому что выбрать можно любую из двадцати карточек. Из них нам подходят пять. Деление показывает, какую часть всех вариантов они составляют.', 'Знаменатель — это число всех возможных исходов: двадцать карточек. Числитель — число подходящих: пять синих. При равных шансах каждой карточки их отношение даёт вероятность.', 'Двадцать — мощность пространства исходов |Ω|. При равномерном распределении каждый исход имеет вероятность 1/20. У события A пять таких исходов, поэтому P(A) = 5 × 1/20 = 1/4.'],
        ['Нет. Это шанс при одном выборе, а не обещание результата через каждые четыре попытки. Можно несколько раз подряд вытянуть синюю карточку или не вытянуть ни одной.', 'Нет. Вероятность 25% описывает шанс одного события. Даже при повторных независимых попытках результат не обязан появляться строго раз в четыре раза.', 'Нет. Для независимых повторений с возвращением карточки P(A) = 0,25 в каждой попытке. Частота при большом числе повторений стремится к этой вероятности, но в короткой серии может сильно отличаться. Без возвращения состав набора и вероятности меняются.']
      ];
      $('chat-reply').innerHTML = paragraphs([replies[Number(button.dataset.question)][state.level]]); $('chat-reply').hidden = false;
    }
  });
  render();
};
