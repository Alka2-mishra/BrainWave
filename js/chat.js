const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

const replies = [
  'Revise JavaScript arrays.',
  'Practice DSA consistently.',
  'Create short notes for revision.',
  'Focus on frontend projects.'
];

function addMessage(text, className){

  const div = document.createElement('div');
  div.classList.add('message', className);
  div.innerText = text;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', () => {

  const message = userInput.value;

  if(message === '') return;

  addMessage(message, 'user');

  userInput.value = '';

  setTimeout(() => {

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    addMessage(randomReply, 'bot');

  }, 1000);

});