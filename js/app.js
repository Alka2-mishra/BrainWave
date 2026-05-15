const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

let darkMode = localStorage.getItem('brainwave-theme') === 'dark';

function applyTheme() {
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('brainwave-theme', darkMode ? 'dark' : 'light');

  if (themeIcon) {
    themeIcon.textContent = darkMode ? '☀️' : '🌙';
  }
}

if(themeToggle){
  applyTheme();
  themeToggle.addEventListener('click', () => {

    darkMode = !darkMode;
    applyTheme();

  });
}