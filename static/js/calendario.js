// script.js
document.addEventListener('DOMContentLoaded', () => {
    const weekdays = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const YEARS = [2020,2021,2022,2023,2024,2025];
  
    const TOTAL_QUESTIONS = 5;
  
    // DOM refs
    const calendarEl      = document.getElementById('calendar');
    const questionEl      = document.getElementById('question');
    const optionsEl       = document.getElementById('options');
    const feedbackEl      = document.getElementById('feedback');
    const correctEl       = document.getElementById('correct-count');
    const errorEl         = document.getElementById('error-count');
    const timerEl         = document.getElementById('timer');
    const popup           = document.getElementById('popup');
    const finalCorrectEl  = document.getElementById('final-correct');
    const finalTimeEl     = document.getElementById('final-time');
    const restartBtn      = document.getElementById('restart-button');
    const closeBtn        = document.getElementById('close-button');
    const gameContainer   = document.getElementById('game-container');
  
    let questions, currentQ, correctCount, errorCount, timer, timerInterval;
  
    // inicia/reinicia o jogo
    function initGame() {
      correctCount = 0;
      errorCount   = 0;
      currentQ     = 0;
      correctEl.textContent = 0;
      errorEl.textContent   = 0;
      feedbackEl.textContent= '';
      popup.classList.add('hidden');
  
      questions = generateQuestions(TOTAL_QUESTIONS);
      startTimer();
      renderQuestion();
    }
  
    // gera n perguntas de tipos variados
    function generateQuestions(n) {
      const qs = [];
      for (let i = 0; i < n; i++) {
        const year  = YEARS[Math.floor(Math.random()*YEARS.length)];
        const month = Math.floor(Math.random()*12);
        const daysInMonth = new Date(year, month+1, 0).getDate();
  
        const type = Math.floor(Math.random()*6); // 0..5
        let text, correct, opts;
  
        switch(type) {
          case 0: { // primeiro dia da semana
            text    = `Em qual dia da semana cai o 1º de ${MONTH_NAMES[month]}/${year}?`;
            correct = new Date(year, month, 1).getDay();
            opts    = uniqueRandomInts(0,6, correct, 4);
            break;
          }
          case 1: { // dia aleatório
            const day = 1 + Math.floor(Math.random()*daysInMonth);
            text    = `Em qual dia da semana cai o dia ${day} de ${MONTH_NAMES[month]}/${year}?`;
            correct = new Date(year, month, day).getDay();
            opts    = uniqueRandomInts(0,6, correct, 4);
            break;
          }
          case 2: { // quantos domingos no mês
            text = `Quantos domingos temos em ${MONTH_NAMES[month]}/${year}?`;
            let count=0;
            for (let d=1; d<=daysInMonth; d++) {
              if (new Date(year, month, d).getDay()===0) count++;
            }
            correct = count;
            opts    = uniqueRandomInts(1,6, correct, 4);
            break;
          }
          case 3: { // qual o mês
            text    = `Qual o mês deste calendário?`;
            correct = month;
            opts    = uniqueRandomInts(0,11, correct, 4);
            break;
          }
          case 4: { // qual o ano
            text    = `Qual o ano deste calendário?`;
            correct = year;
            opts    = uniqueRandomYears(year, 4);
            break;
          }
          case 5: { // quantos dias tem o mês
            text    = `Quantos dias tem o mês de ${MONTH_NAMES[month]}/${year}?`;
            correct = daysInMonth;
            opts    = uniqueRandomInts(28,31, correct, 4);
            break;
          }
        }
  
        shuffle(opts);
        qs.push({ year, month, type, text, correct, opts });
      }
      return qs;
    }
  
    // exibe a pergunta atual
    function renderQuestion() {
      const q = questions[currentQ];
      renderCalendar(q.year, q.month);
      questionEl.textContent = q.text;
      optionsEl.innerHTML = '';
  
      q.opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option';
  
        // define label conforme tipo
        if (q.type === 0 || q.type === 1) {
          btn.textContent = weekdays[opt];
        } else if (q.type === 2 || q.type === 5) {
          btn.textContent = String(opt);
        } else if (q.type === 3) {
          btn.textContent = MONTH_NAMES[opt];
        } else { // type 4
          btn.textContent = String(opt);
        }
  
        btn.dataset.value = opt;
        btn.addEventListener('click', handleAnswer);
        optionsEl.appendChild(btn);
      });
    }
  
    // desenha o calendário
    function renderCalendar(year, month) {
      calendarEl.innerHTML = '';
      const title = document.createElement('div');
      title.className = 'calendar-title';
      title.textContent = `${MONTH_NAMES[month]} ${year}`;
      calendarEl.appendChild(title);
  
      const grid = document.createElement('div');
      grid.className = 'calendar';
      weekdays.forEach(d => {
        const dn = document.createElement('div');
        dn.className = 'day-name';
        dn.textContent = d.slice(0,3);
        grid.appendChild(dn);
      });
  
      const firstDow = new Date(year, month, 1).getDay();
      for (let i=0; i<firstDow; i++) {
        const empty = document.createElement('div');
        empty.className = 'day-number';
        grid.appendChild(empty);
      }
  
      const daysInMonth = new Date(year, month+1, 0).getDate();
      for (let d=1; d<=daysInMonth; d++){
        const dn = document.createElement('div');
        dn.className = 'day-number';
        dn.textContent = d;
        grid.appendChild(dn);
      }
  
      calendarEl.appendChild(grid);
    }
  
    // trata resposta
    function handleAnswer(e) {
      const q = questions[currentQ];
      const val = q.type===0||q.type===1
        ? weekdays.indexOf(e.currentTarget.textContent)
        : Number(e.currentTarget.dataset.value);
  
      if (val === q.correct) {
        correctCount++;
        correctEl.textContent = correctCount;
        feedbackEl.textContent = '✔ Acertou!';
      } else {
        errorCount++;
        errorEl.textContent = errorCount;
        feedbackEl.textContent = '✖ Errado!';
      }
  
      currentQ++;
      if (currentQ < questions.length) {
        setTimeout(() => {
          feedbackEl.textContent = '';
          renderQuestion();
        }, 800);
      } else {
        finishGame();
      }
    }
  
    // finaliza
    function finishGame() {
      stopTimer();
      finalCorrectEl.textContent = correctCount;
      finalTimeEl.textContent    = timer;
      popup.classList.remove('hidden');
    }
  
    // timer
    function startTimer() {
      clearInterval(timerInterval);
      timer = 0;
      timerEl.textContent = timer;
      timerInterval = setInterval(() => {
        timer++;
        timerEl.textContent = timer;
      }, 1000);
    }
    function stopTimer() {
      clearInterval(timerInterval);
    }
  
    // utils
    function uniqueRandomInts(min, max, correct, n) {
      const s = new Set([correct]);
      while (s.size < n) {
        s.add(Math.floor(Math.random()*(max-min+1))+min);
      }
      return Array.from(s);
    }
    function uniqueRandomYears(correctYear, n) {
      const s = new Set([correctYear]);
      while (s.size < n) {
        s.add(YEARS[Math.floor(Math.random()*YEARS.length)]);
      }
      return Array.from(s);
    }
    function shuffle(a) {
      for (let i=a.length-1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        [a[i],a[j]]=[a[j],a[i]];
      }
      return a;
    }
  
    restartBtn.addEventListener('click', initGame);
    closeBtn.addEventListener('click', () => {
      popup.classList.add('hidden');
      gameContainer.innerHTML = '<h2>Obrigado por jogar!</h2>';
      stopTimer();
    });
  
    // início
    initGame();
  });
  