const fenceElement = document.getElementById('fence');
const cardsContainer = document.getElementById('cards');
const feedbackElement = document.getElementById('feedback');
const correctCountElement = document.getElementById('correct-count');
const errorCountElement = document.getElementById('error-count');
const timerElement = document.getElementById('timer');
const popupElement = document.getElementById('popup');
const timeSpentElement = document.getElementById('time-spent');
const restartButton = document.getElementById('restart-button');

let correctCount = 0;
let errorCount = 0;
let timer = 0;
let timerInterval;
let currentAnswer = 0;
let rounds = 0;
const totalRounds = 10;

// Função para gerar número aleatório entre min e max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para criar galinhas na cerca
function createChickens(quantity) {
  fenceElement.innerHTML = '';
  for (let i = 0; i < quantity; i++) {
    const chicken = document.createElement('span');
    chicken.textContent = '🐓';
    chicken.classList.add('chicken');
    fenceElement.appendChild(chicken);
  }
}

// Função para criar cartões com opções
function createCards(correctAnswer) {
  cardsContainer.innerHTML = '';
  const answers = new Set();
  answers.add(correctAnswer);

  // Gera 2 números aleatórios diferentes
  while (answers.size < 5) {
    answers.add(getRandomInt(1, 9));
  }

  const shuffledAnswers = Array.from(answers).sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach(answer => {
    const card = document.createElement('button');
    card.classList.add('card');
    card.textContent = answer;
    card.addEventListener('click', () => checkAnswer(answer));
    cardsContainer.appendChild(card);
  });
}

// Função para verificar a resposta
function checkAnswer(selectedAnswer) {
  if (selectedAnswer === currentAnswer) {
    correctCount++;
    feedbackElement.textContent = 'Correto! 🎉';
    feedbackElement.style.color = 'green';
  } else {
    errorCount++;
    feedbackElement.textContent = 'Ops! Tente novamente. ❌';
    feedbackElement.style.color = 'red';
  }

  updateScore();
  rounds++;

  if (rounds >= totalRounds) {
    endGame();
  } else {
    nextRound();
  }
}

// Função para atualizar placar
function updateScore() {
  correctCountElement.textContent = correctCount;
  errorCountElement.textContent = errorCount;
}

// Função para começar uma nova rodada
function nextRound() {
  currentAnswer = getRandomInt(1, 9);
  createChickens(currentAnswer);
  createCards(currentAnswer);
}

// Função para iniciar o timer
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerElement.textContent = timer;
  }, 1000);
}

// Função para iniciar o jogo
function startGame() {
  correctCount = 0;
  errorCount = 0;
  timer = 0;
  rounds = 0;
  updateScore();
  timerElement.textContent = 0;
  feedbackElement.textContent = '';
  popupElement.classList.add('hidden');
  startTimer();
  nextRound();
}

// Função para terminar o jogo
function endGame() {
  clearInterval(timerInterval);
  timeSpentElement.textContent = timer;
  popupElement.classList.remove('hidden');
}

// Botão de jogar novamente
restartButton.addEventListener('click', function () {
  startGame();
});

// Iniciar o jogo automaticamente ao carregar
startGame();
