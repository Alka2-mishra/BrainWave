import { quizBank, shuffle, detectTopic, buildFallbackQuiz } from './data.js';

const subjectInput = document.getElementById('subjectInput');
const countInput = document.getElementById('countInput');
const generateQuizBtn = document.getElementById('generateQuiz');
const questionCount = document.getElementById('questionCount');
const quizTopic = document.getElementById('quizTopic');
const questionText = document.getElementById('questionText');
const options = document.getElementById('options');
const feedback = document.getElementById('feedback');
const submitAnswer = document.getElementById('submitAnswer');
const nextQuestion = document.getElementById('nextQuestion');
const resultOverlay = document.getElementById('resultOverlay');
const resultSummary = document.getElementById('resultSummary');
const resultCorrect = document.getElementById('resultCorrect');
const resultTotal = document.getElementById('resultTotal');
const resultPercent = document.getElementById('resultPercent');
const closeResult = document.getElementById('closeResult');
const restartQuiz = document.getElementById('restartQuiz');

let activeQuiz = [];
let currentIndex = 0;
let selectedAnswer = null;
let score = 0;

function buildQuiz(subjectText, count) {
  const topic = detectTopic(subjectText);
  const cleanSubject = subjectText.trim();
  const topicLabel = cleanSubject || 'General Study';
  const safeCount = Math.max(1, Math.min(Number(count) || 5, 10));
  const source = topic === 'general' ? buildFallbackQuiz(subjectText, Math.max(safeCount, 3)) : quizBank[topic];
  const pool = shuffle(source).slice(0, safeCount);

  activeQuiz = pool.map(item => ({
    ...item,
    options: shuffle(item.options)
  }));

  currentIndex = 0;
  score = 0;
  selectedAnswer = null;
  quizTopic.textContent = topicLabel;
  feedback.textContent = 'Quiz generated. Select an answer and press Submit.';
  hideResult();
  renderQuestion();
}

function showResult() {
  const total = activeQuiz.length;
  const percent = total ? Math.round((score / total) * 100) : 0;

  resultCorrect.textContent = String(score);
  resultTotal.textContent = String(total);
  resultPercent.textContent = `${percent}%`;
  resultSummary.textContent = percent >= 80
    ? 'Strong result. You handled the quiz well.'
    : percent >= 50
      ? 'Good effort. A quick review should improve your score.'
      : 'Keep practicing. A second round will help reinforce the topic.';

  resultOverlay.classList.add('open');
  resultOverlay.setAttribute('aria-hidden', 'false');
}

function hideResult() {
  resultOverlay.classList.remove('open');
  resultOverlay.setAttribute('aria-hidden', 'true');
}

function renderQuestion() {
  const current = activeQuiz[currentIndex];

  if (!current) {
    questionCount.textContent = 'Quiz complete';
    questionText.textContent = `You finished the quiz with a score of ${score}/${activeQuiz.length}.`;
    options.innerHTML = '';
    feedback.textContent = 'Opening results window...';
    submitAnswer.disabled = true;
    nextQuestion.disabled = true;
    showResult();
    return;
  }

  questionCount.textContent = `Question ${currentIndex + 1} of ${activeQuiz.length}`;
  questionText.textContent = current.question;
  options.innerHTML = '';
  feedback.textContent = 'Choose one option to lock in your answer.';
  selectedAnswer = null;
  submitAnswer.disabled = false;
  nextQuestion.disabled = true;

  current.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    btn.addEventListener('click', () => {
      selectedAnswer = option;
      [...options.querySelectorAll('button')].forEach(button => button.classList.remove('selected'));
      btn.classList.add('selected');
    });
    options.appendChild(btn);
  });
}

function gradeAnswer() {
  const current = activeQuiz[currentIndex];

  if (!current) return;

  if (!selectedAnswer) {
    feedback.textContent = 'Please select an answer before submitting.';
    return;
  }

  const optionButtons = [...options.querySelectorAll('button')];
  optionButtons.forEach(button => {
    const text = button.textContent.slice(3);
    if (text === current.answer) {
      button.classList.add('correct');
    }
    if (text === selectedAnswer && selectedAnswer !== current.answer) {
      button.classList.add('wrong');
    }
    button.disabled = true;
  });

  if (selectedAnswer === current.answer) {
    score += 1;
    feedback.textContent = `Correct. ${current.answer} is the right answer.`;
  } else {
    feedback.textContent = `Not quite. The correct answer is ${current.answer}.`;
  }

  submitAnswer.disabled = true;
  nextQuestion.disabled = false;
}

function next() {
  currentIndex += 1;
  renderQuestion();
}

generateQuizBtn?.addEventListener('click', () => {
  buildQuiz(subjectInput?.value || '', Number(countInput?.value || 5));
});

submitAnswer?.addEventListener('click', gradeAnswer);
nextQuestion?.addEventListener('click', next);
closeResult?.addEventListener('click', hideResult);
restartQuiz?.addEventListener('click', () => {
  hideResult();
  buildQuiz(subjectInput?.value || '', Number(countInput?.value || 5));
});
resultOverlay?.addEventListener('click', event => {
  if (event.target === resultOverlay) {
    hideResult();
  }
});

buildQuiz(subjectInput?.value || 'Physics', Number(countInput?.value || 5));