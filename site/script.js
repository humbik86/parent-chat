// Анимация появления секций при прокрутке
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
});

document.querySelectorAll('.section, .hero').forEach((block) => {
  observer.observe(block);
});

// Карточки — лёгкая анимация при клике
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('click', () => {
    if (card.hasAttribute('data-index')) {
      // Для заповедей: toggle expanded
      card.classList.toggle('expanded');
      const title = card.querySelector('h3')?.textContent || 'Правило';
      showToast(card.classList.contains('expanded') ? `Раскрыто: ${title}` : `Скрыто: ${title}`);
    } else {
      // Для других карточек: обычная анимация
      card.classList.add('active-card');
      setTimeout(() => card.classList.remove('active-card'), 220);
      const role = card.getAttribute('data-role') || 'Карточка';
      const title = card.querySelector('h3')?.textContent || role;
      showToast(`Вы выбрали: ${title}`);
    }
  });
});

// Функция для перемешивания массива
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Мини-тест — массив вопросов (перемешиваем при загрузке)
const quizQuestions = [
  {
    question: 'Что лучше сделать перед тем, как переслать важный пост в общий чат?',
    answers: [
      { text: 'Сразу отправить, вдруг пропустят', correct: false },
      { text: 'Проверить, не было ли уже в чате', correct: true },
      { text: 'Добавить личную историю и переслать', correct: false }
    ]
  },
  {
    question: 'Какой тон лучше использовать в спорных ситуациях?',
    answers: [
      { text: 'Резкий и обвинительный', correct: false },
      { text: 'Спокойный и конструктивный', correct: true },
      { text: 'Игнорировать проблему', correct: false }
    ]
  },
  {
    question: 'Что делать, если вы не уверены в факте?',
    answers: [
      { text: 'Распространить как есть', correct: false },
      { text: 'Уточнить у надежного источника', correct: true },
      { text: 'Добавить "кажется"', correct: false }
    ]
  },
  {
    question: 'Как часто можно напоминать о вопросе?',
    answers: [
      { text: 'Каждые 5 минут', correct: false },
      { text: 'Один раз, затем подождать', correct: true },
      { text: 'До тех пор, пока не ответят', correct: false }
    ]
  },
  {
    question: 'Что такое спам в чате?',
    answers: [
      { text: 'Отправка одного сообщения', correct: false },
      { text: 'Повторные напоминания без ответа', correct: true },
      { text: 'Использование смайликов', correct: false }
    ]
  },
  {
    question: 'Как сделать сообщение понятным?',
    answers: [
      { text: 'Использовать сложные слова', correct: false },
      { text: 'Указать все детали: кто, что, когда', correct: true },
      { text: 'Отправить голосовое', correct: false }
    ]
  },
  {
    question: 'Что важно учесть при выборе платформы для чата?',
    answers: [
      { text: 'Только удобство для себя', correct: false },
      { text: 'Поддержка файлов и модерации', correct: true },
      { text: 'Количество участников', correct: false }
    ]
  },
  {
    question: 'Как педагогу реагировать на конфликт в чате?',
    answers: [
      { text: 'Игнорировать', correct: false },
      { text: 'Ответить спокойно и обстоятельно', correct: true },
      { text: 'Заблокировать сразу', correct: false }
    ]
  },
  {
    question: 'Что делать, если правила чата нарушаются?',
    answers: [
      { text: 'Ничего', correct: false },
      { text: 'Напомнить о правилах вежливо', correct: true },
      { text: 'Удалить чат', correct: false }
    ]
  }
];

// Перемешать вопросы
shuffleArray(quizQuestions);

let currentQuestionIndex = 0;
const quizQuestionEl = document.querySelector('.question');
const quizAnswersEl = document.querySelector('.answers');
const quizFeedback = document.getElementById('quizFeedback');
const progressFill = document.getElementById('progressFill');

// Загрузка прогресса из localStorage
function loadProgress() {
  const saved = localStorage.getItem('quizProgress');
  const completed = localStorage.getItem('quizCompleted');
  if (completed) {
    showCompletion();
  } else if (saved) {
    currentQuestionIndex = parseInt(saved, 10);
    if (currentQuestionIndex >= quizQuestions.length) {
      currentQuestionIndex = 0;
    }
  }
}

// Сохранение прогресса
function saveProgress() {
  localStorage.setItem('quizProgress', currentQuestionIndex);
}

// Сброс прогресса
function resetProgress() {
  currentQuestionIndex = 0;
  localStorage.removeItem('quizProgress');
  loadQuestion();
  showToast('Прогресс сброшен!');
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  progressFill.style.width = `${progress}%`;
}

function loadQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  quizQuestionEl.textContent = question.question;
  quizAnswersEl.innerHTML = '';
  question.answers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.textContent = answer.text;
    btn.setAttribute('data-correct', answer.correct);
    btn.addEventListener('click', () => checkAnswer(answer.correct));
    quizAnswersEl.appendChild(btn);
  });
  quizFeedback.textContent = '';
  updateProgress();
}

function checkAnswer(isCorrect) {
  if (isCorrect) {
    quizFeedback.textContent = '🎉 Правильно! Отличный выбор.';
    showToast('Верно! Продолжаем...');
    playSound('success');
    setTimeout(() => nextQuestion(), 1500);
  } else {
    quizFeedback.textContent = '❌ Почти. Попробуйте ещё раз.';
    showToast('Не совсем. Попробуйте другой вариант.');
    playSound('wrong');
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= quizQuestions.length) {
    // Завершение теста
    showCompletion();
  } else {
    saveProgress();
    loadQuestion();
  }
}

// Функция для создания конфетти эффекта
function createConfetti() {
  const confettiCount = 50;
  const confettiContainer = document.createElement('div');
  confettiContainer.id = 'confetti-container';
  confettiContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(confettiContainer);

  const colors = ['#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = Math.random() * window.innerWidth;
    const delay = Math.random() * 0.2;
    
    confetti.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${color};
      border-radius: 50%;
      left: ${startX}px;
      top: -10px;
      opacity: 1;
      animation: fall ${2 + Math.random() * 1}s linear ${delay}s forwards;
    `;
    confettiContainer.appendChild(confetti);
  }

  // Добавим стиль для анимации падения конфетти
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Удалим контейнер конфетти через 3 секунды
  setTimeout(() => {
    confettiContainer.remove();
  }, 3000);
}

// Функция для воспроизведения звука (используем Web Audio API для простого звука)
function playSound(type = 'success') {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  if (type === 'success') {
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } else if (type === 'wrong') {
    oscillator.frequency.value = 400;
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }
}

function showCompletion() {
  quizQuestionEl.textContent = '🎉 Поздравляем! Ты прошел тест!';
  quizAnswersEl.innerHTML = '<p>Ты молодец! Теперь ты знаешь основы этикета родительского чата. 😊</p><button id="restartQuiz" class="btn btn-primary">Пройти заново</button>';
  quizFeedback.textContent = '';
  progressFill.style.width = '100%';
  progressFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)'; // Зелёный для завершения
  localStorage.setItem('quizCompleted', 'true');
  showToast('Тест завершен! Ты супер!');
  
  // Конфетти эффект и звук при завершении
  createConfetti();
  playSound('success');
  
  // Кнопка перезапуска
  document.getElementById('restartQuiz').addEventListener('click', () => {
    resetProgress();
    localStorage.removeItem('quizCompleted');
  });
}

// Инициализация
loadProgress();
loadQuestion();

// Кнопка сброса
document.getElementById('resetQuiz').addEventListener('click', resetProgress);

// Кнопка из Hero ведёт к правилам
const gotoRules = document.getElementById('gotoRules');
if (gotoRules) {
  gotoRules.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#rules').scrollIntoView({ behavior: 'smooth' });
  });
}

// Кнопка к советам для педагогов
const gotoTeachers = document.querySelector('a[href="#teachers"]');
if (gotoTeachers) {
  gotoTeachers.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#teachers').scrollIntoView({ behavior: 'smooth' });
  });
}

// Уведомления
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// Переключение темы
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  // Загрузка сохраненной темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️'; // Солнце для переключения на светлую
  } else {
    themeToggle.textContent = '🌙'; // Луна для переключения на темную
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    showToast(isDark ? 'Тёмная тема включена' : 'Светлая тема включена');
  });
}

