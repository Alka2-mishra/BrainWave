const quizBank = {
  physics: [
    {
      question: 'Which quantity remains constant in ideal projectile motion (ignoring air resistance)?',
      options: ['Vertical velocity', 'Horizontal velocity', 'Vertical acceleration', 'Both A and B'],
      answer: 'Horizontal velocity'
    },
    {
      question: 'What is the SI unit of force?',
      options: ['Joule', 'Watt', 'Newton', 'Pascal'],
      answer: 'Newton'
    },
    {
      question: 'Which law explains action and reaction?',
      options: ['First law', 'Second law', 'Third law', 'Law of gravitation'],
      answer: 'Third law'
    },
    {
      question: 'What does a concave lens do to parallel rays?',
      options: ['Converges them', 'Diverges them', 'Reflects them', 'Absorbs them'],
      answer: 'Diverges them'
    },
    {
      question: 'The speed of light in vacuum is approximately?',
      options: ['3 x 10^8 m/s', '3 x 10^6 m/s', '3 x 10^5 m/s', '3 x 10^7 m/s'],
      answer: '3 x 10^8 m/s'
    }
  ],
  biology: [
    {
      question: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'],
      answer: 'Mitochondria'
    },
    {
      question: 'Which pigment gives plants their green color?',
      options: ['Hemoglobin', 'Melanin', 'Chlorophyll', 'Keratin'],
      answer: 'Chlorophyll'
    },
    {
      question: 'Where does photosynthesis mainly occur?',
      options: ['Mitochondria', 'Chloroplast', 'Vacuole', 'Cell wall'],
      answer: 'Chloroplast'
    },
    {
      question: 'What part of blood helps in clotting?',
      options: ['RBC', 'WBC', 'Platelets', 'Plasma'],
      answer: 'Platelets'
    },
    {
      question: 'Which organ pumps blood?',
      options: ['Liver', 'Brain', 'Kidney', 'Heart'],
      answer: 'Heart'
    }
  ],
  math: [
    {
      question: 'What is the value of pi approximately?',
      options: ['2.14', '3.14', '3.41', '4.13'],
      answer: '3.14'
    },
    {
      question: 'What is 12 × 8?',
      options: ['84', '96', '108', '102'],
      answer: '96'
    },
    {
      question: 'The derivative of x² is?',
      options: ['x', '2x', 'x²', '2'],
      answer: '2x'
    },
    {
      question: 'What is the sum of angles in a triangle?',
      options: ['90°', '180°', '270°', '360°'],
      answer: '180°'
    },
    {
      question: 'A number divisible by 2 is called?',
      options: ['Odd', 'Prime', 'Even', 'Composite'],
      answer: 'Even'
    }
  ],
  history: [
    {
      question: 'Who was the first President of the United States?',
      options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
      answer: 'George Washington'
    },
    {
      question: 'The Great Wall is located in which country?',
      options: ['India', 'China', 'Japan', 'Korea'],
      answer: 'China'
    },
    {
      question: 'Which war ended in 1945?',
      options: ['World War I', 'World War II', 'Civil War', 'Cold War'],
      answer: 'World War II'
    },
    {
      question: 'The Renaissance began in which country?',
      options: ['France', 'Italy', 'Germany', 'Spain'],
      answer: 'Italy'
    },
    {
      question: 'Who discovered penicillin?',
      options: ['Marie Curie', 'Alexander Fleming', 'Isaac Newton', 'Louis Pasteur'],
      answer: 'Alexander Fleming'
    }
  ]
};

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

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function normalizeText(value) {
  return (value || '').trim().toLowerCase();
}

function detectTopic(subjectText) {
  const subject = normalizeText(subjectText);

  if (/physics|force|motion|energy|velocity|projectile|gravity/.test(subject)) return 'physics';
  if (/bio|cell|plant|animal|genetic|dna|organ|photosynthesis/.test(subject)) return 'biology';
  if (/math|algebra|geometry|equation|fraction|calculus|probability/.test(subject)) return 'math';
  if (/history|war|empire|revolution|president|civilization|world war/.test(subject)) return 'history';

  return 'general';
}

function buildFallbackQuiz(subjectText, count) {
  const cleanSubject = subjectText.trim() || 'the topic';
  const templates = [
    {
      question: `What is the main focus of ${cleanSubject}?`,
      options: ['Key idea or definition', 'Random fact', 'Unrelated event', 'None of these'],
      answer: 'Key idea or definition'
    },
    {
      question: `Which statement is most likely true about ${cleanSubject}?`,
      options: ['It has concepts to understand', 'It is always unrelated to exams', 'It has no useful details', 'It only contains dates'],
      answer: 'It has concepts to understand'
    },
    {
      question: `When revising ${cleanSubject}, what should you do first?`,
      options: ['Read the core concept', 'Skip the chapter', 'Memorize everything blindly', 'Avoid practice'],
      answer: 'Read the core concept'
    },
    {
      question: `What helps most while studying ${cleanSubject}?`,
      options: ['Active recall', 'Ignoring examples', 'Only reading once', 'No revision'],
      answer: 'Active recall'
    },
    {
      question: `Why is ${cleanSubject} useful to practice?`,
      options: ['It builds understanding', 'It removes all questions', 'It never appears in exams', 'It has no value'],
      answer: 'It builds understanding'
    }
  ];

  return shuffle(templates).slice(0, count);
}

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