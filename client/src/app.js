// Available due to src import from html file
// AND socket.io wrapper on server side
const socket = io();

const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector("#events");

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};

const onFormSubmitted = (e) => {
  // No reload page
  e.preventDefault();

  // Save the input and reset the input box
  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  socket.emit('message', text);
};

writeEvent('Welcome to RPS!');

socket.on('message', (message) => {
  writeEvent(message);
});

document.querySelector('#chat-form').addEventListener('submit', onFormSubmitted);