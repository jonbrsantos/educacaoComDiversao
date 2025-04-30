// script.js
document.addEventListener('DOMContentLoaded', () => {
    const shapeTypes = ['circle', 'square', 'triangle', 'star'];
    const shapeIcons = {
      circle:   '●',
      square:   '■',
      triangle: '▲',
      star:     '★'
    };
  
    const GRID_SIZE     = 8;
    const MISSING_COUNT = 3;
  
    // DOM references
    const gridContainer    = document.getElementById('grid');
    const paletteContainer = document.getElementById('palette-container');
    const feedbackEl       = document.getElementById('feedback');
    const correctEl        = document.getElementById('correct-count');
    const errorEl          = document.getElementById('error-count');
    const timerEl          = document.getElementById('timer');
    const popup            = document.getElementById('popup');
    const timeSpentEl      = document.getElementById('time-spent');
    const restartButton    = document.getElementById('restart-button');
    const closeButton      = document.getElementById('close-button');
    const gameContainer    = document.getElementById('game-container');
  
    let patternShape, direction, stripeKeys, patternKey, stripeMap, missingCells;
    let correctCount, errorCount, timer, timerInterval;
  
    // Fisher–Yates shuffle (in-place)
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  
    // Pick the pattern stripe, map every stripe to a shape,
    // then pick 3 distinct stripes (including the pattern stripe)
    // and choose one random cell in each to be empty.
    function choosePattern() {
      // 1) pick a random shape for the pattern stripe
      patternShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  
      // 2) pick a random direction for stripes
      const dirs = [
        { dr: 0,  dc: 1 },   // horizontal
        { dr: 1,  dc: 0 },   // vertical
        { dr: 1,  dc: 1 },   // main diagonal
        { dr: 1,  dc: -1 }   // anti-diagonal
      ];
      direction = dirs[Math.floor(Math.random() * dirs.length)];
  
      // 3) build the list of stripe keys for that direction
      if (direction.dr === 0) {
        stripeKeys = [...Array(GRID_SIZE).keys()];        // rows 0..7
      } else if (direction.dc === 0) {
        stripeKeys = [...Array(GRID_SIZE).keys()];        // cols 0..7
      } else if (direction.dc === 1) {
        stripeKeys = Array.from({length:2*GRID_SIZE-1}, (_,i)=>i-(GRID_SIZE-1));  // r-c
      } else {
        stripeKeys = [...Array(2*GRID_SIZE-1).keys()];    // r+c
      }
  
      // 4) pick a random stripe as the pattern stripe
      patternKey = stripeKeys[Math.floor(Math.random() * stripeKeys.length)];
  
      // 5) map each stripeKey to a random shape
      stripeMap = {};
      let pool = [];
      while (pool.length < stripeKeys.length) pool = pool.concat(shapeTypes);
      shuffle(pool);
      stripeKeys.forEach((k,i) => {
        stripeMap[k] = pool[i];
      });
      // override the pattern stripe
      stripeMap[patternKey] = patternShape;
  
      // 6) choose MISSING_COUNT distinct stripes
      const otherStripes = stripeKeys.filter(k => k !== patternKey);
      shuffle(otherStripes);
      const missingStripes = [patternKey].concat(otherStripes.slice(0, MISSING_COUNT-1));
  
      // 7) in each chosen stripe, pick one random cell to be empty
      missingCells = [];
      missingStripes.forEach(k => {
        const coords = [];
        for (let r=0; r<GRID_SIZE; r++) {
          for (let c=0; c<GRID_SIZE; c++) {
            const inStripe =
              (direction.dr === 0 && r === k) ||
              (direction.dc === 0 && c === k) ||
              (direction.dr === 1 && direction.dc === 1 && (r - c) === k) ||
              (direction.dr === 1 && direction.dc === -1 && (r + c) === k);
            if (inStripe) coords.push([r, c]);
          }
        }
        const [rr, cc] = coords[Math.floor(Math.random() * coords.length)];
        missingCells.push([rr, cc]);
      });
    }
  
    // Render the 8×8 grid: each non-empty cell takes its shape from stripeMap
    // and adds a class for coloring.
    function renderGrid() {
      gridContainer.innerHTML = '';
      for (let r=0; r<GRID_SIZE; r++) {
        for (let c=0; c<GRID_SIZE; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
  
          // empty (droppable) cell?
          if (missingCells.some(pc=>pc[0]===r&&pc[1]===c)) {
            cell.classList.add('empty');
            cell.addEventListener('dragover', e=>e.preventDefault());
            cell.addEventListener('dragenter', e=>cell.classList.add('drag-over'));
            cell.addEventListener('dragleave', e=>cell.classList.remove('drag-over'));
            cell.addEventListener('drop', e=>{
              cell.classList.remove('drag-over');
              handleDrop(e, r, c, cell);
            });
          } else {
            // find stripe key
            let k;
            if (direction.dr === 0)      k = r;
            else if (direction.dc === 0) k = c;
            else if (direction.dc === 1) k = r - c;
            else                          k = r + c;
            const shape = stripeMap[k];
            cell.textContent = shapeIcons[shape];
            cell.classList.add(`shape-${shape}`);
          }
          gridContainer.appendChild(cell);
        }
      }
    }
  
    // Render the palette of draggable shapes
    function renderPalette() {
      paletteContainer.innerHTML = '';
      shapeTypes.forEach(type => {
        const d = document.createElement('div');
        d.className = 'draggable-shape';
        d.textContent = shapeIcons[type];
        d.draggable = true;
        d.dataset.shape = type;
        d.addEventListener('dragstart', e => {
          e.dataTransfer.setData('text/plain', type);
        });
        paletteContainer.appendChild(d);
      });
    }
  
    // Timer helpers
    function startTimer() {
      clearInterval(timerInterval);
      timer = 0; timerEl.textContent = timer;
      timerInterval = setInterval(() => {
        timer++;
        timerEl.textContent = timer;
      }, 1000);
    }
    function stopTimer() {
      clearInterval(timerInterval);
    }
  
    // Handle a drop into an empty cell
    function handleDrop(e, r, c, cell) {
      e.preventDefault();
      const dragged = e.dataTransfer.getData('text/plain');
  
      // recompute stripe key
      let k;
      if (direction.dr === 0)      k = r;
      else if (direction.dc === 0) k = c;
      else if (direction.dc === 1) k = r - c;
      else                          k = r + c;
  
      if (dragged === stripeMap[k]) {
        cell.textContent = shapeIcons[dragged];
        cell.classList.remove('empty');
        cell.classList.add(`shape-${dragged}`);
        correctCount++;
        correctEl.textContent = correctCount;
        feedbackEl.textContent = '✔ Correto!';
        if (correctCount === MISSING_COUNT) {
          stopTimer();
          timeSpentEl.textContent = timer;
          setTimeout(() => popup.classList.remove('hidden'), 300);
        }
      } else {
        errorCount++;
        errorEl.textContent = errorCount;
        feedbackEl.textContent = '✖ Errado, tente outra vez.';
      }
    }
  
    // Initialize or reset the game
    function initGame() {
      correctCount = 0;
      errorCount   = 0;
      correctEl.textContent = 0;
      errorEl.textContent   = 0;
      feedbackEl.textContent = '';
      popup.classList.add('hidden');
  
      choosePattern();
      renderGrid();
      renderPalette();
      startTimer();
    }
  
    // Button handlers
    restartButton.addEventListener('click', initGame);
    closeButton.addEventListener('click', () => {
      popup.classList.add('hidden');
      gameContainer.innerHTML = '<h2>Obrigado por jogar!</h2>';
      stopTimer();
    });
  
    // Start the very first game
    initGame();
  });
  