document.addEventListener('DOMContentLoaded', () => {
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const TOTAL_MISSING = 5;
  
    const alphabetContainer   = document.getElementById('alphabet-container');
    const draggablesContainer = document.getElementById('draggables');
    const feedbackEl          = document.getElementById('feedback');
    const errorCountEl        = document.getElementById('error-count');
    const correctCountEl      = document.getElementById('correct-count');
    const timerEl             = document.getElementById('timer');
    const popup               = document.getElementById('popup');
    const timeSpentEl         = document.getElementById('time-spent');
    const restartButton       = document.getElementById('restart-button');
    const closeButton         = document.getElementById('close-button');
    const gameContainer       = document.getElementById('game-container');
  
    let errorCount   = 0;
    let correctCount = 0;
    let missingIndices = [];
    let missingLetters = [];
    let timer        = 0;
    let timerInterval;
  
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  
    function pickMissing() {
      missingIndices = [];
      while (missingIndices.length < TOTAL_MISSING) {
        const idx = Math.floor(Math.random() * ALPHABET.length);
        if (!missingIndices.includes(idx)) missingIndices.push(idx);
      }
      missingLetters = missingIndices.map(i => ALPHABET[i]);
    }
  
    function renderSlots() {
      alphabetContainer.innerHTML = '';
      ALPHABET.forEach((letter, idx) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.letter = letter;
  
        if (!missingIndices.includes(idx)) {
          slot.textContent = letter;
          slot.classList.add('filled');
        }
  
        slot.addEventListener('dragover', e => e.preventDefault());
        slot.addEventListener('dragenter', e => {
          if (!slot.classList.contains('filled'))
            slot.classList.add('drag-over');
        });
        slot.addEventListener('dragleave', e => {
          slot.classList.remove('drag-over');
        });
        slot.addEventListener('drop', e => {
          slot.classList.remove('drag-over');
          handleDrop(e);
        });
  
        alphabetContainer.appendChild(slot);
      });
    }
  
    function renderDraggables() {
      draggablesContainer.innerHTML = '';
      shuffle(missingLetters);
      missingLetters.forEach(letter => {
        const d = document.createElement('div');
        d.className = 'draggable';
        d.textContent = letter;
        d.draggable = true;
        d.dataset.letter = letter;
        d.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', letter);
        });
        draggablesContainer.appendChild(d);
      });
    }
  
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
  
    function handleDrop(e) {
      e.preventDefault();
      const slot = e.currentTarget;
      const dragged = e.dataTransfer.getData('text/plain');
  
      if (slot.classList.contains('filled')) {
        feedbackEl.textContent = '⚠️ Já tem letra aqui.';
        return;
      }
  
      if (dragged === slot.dataset.letter) {
        slot.textContent = dragged;
        slot.classList.add('filled');
        feedbackEl.textContent = '✔ Acertou!';
  
        const elem = [...draggablesContainer.children]
          .find(x => x.dataset.letter === dragged);
        elem.classList.add('locked');
        elem.draggable = false;
  
        correctCount++;
        correctCountEl.textContent = correctCount;
  
        if (correctCount === TOTAL_MISSING) {
          stopTimer();
          timeSpentEl.textContent = timer;
          popup.classList.remove('hidden');
        }
      } else {
        errorCount++;
        errorCountEl.textContent = errorCount;
        feedbackEl.textContent = '✖ Tente de novo.';
      }
    }
  
    function initGame() {
      errorCount = 0;
      correctCount = 0;
      errorCountEl.textContent = 0;
      correctCountEl.textContent = 0;
      feedbackEl.textContent = '';
  
      pickMissing();
      renderSlots();
      renderDraggables();
      startTimer();
    }
  
    restartButton.addEventListener('click', () => {
      popup.classList.add('hidden');
      initGame();
    });
    closeButton.addEventListener('click', () => {
      popup.classList.add('hidden');
      gameContainer.innerHTML = '<h2>Obrigado por jogar!</h2>';
      stopTimer();
    });
  
    initGame();
  });
  