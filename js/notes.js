const noteInput = document.getElementById('noteInput');
const addNote = document.getElementById('addNote');
const notesList = document.getElementById('notesList');

addNote.addEventListener('click', () => {

  const note = document.createElement('div');
  note.classList.add('note');
  note.innerText = noteInput.value;

  notesList.appendChild(note);

  noteInput.value = '';

});