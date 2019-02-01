//Client - Listen to Port 4000
const socket = io.connect('http://localhost:4000');

//Predefine constants pointing to required elements
const Output = document.getElementById('Output');
const Message = document.getElementById('Message');
const handle = document.getElementById('handle');
const feedback = document.getElementById('feedback');
const btn = document.getElementById('send');

//Event Lenter - Fires when typing
Message.addEventListener('keypress', () => {
  //Send the sender name typing to stream "Typing"
  socket.emit('Typing', handle.value);
});

//Send a message function
sendMessage = () => {
  //Setting constans for ease of code
  const MSG = Message.value; //Message Text
  const HND = handle.value; //Sender name

  //Send the message to the server "Chat Stream"
  socket.emit('Chat', {
    Output: MSG,
    handle: HND
  });

  //Clear elements
  clearExtras();
};

//Function - Clear Unused elements
clearExtras = () => {
  Message.innerHTML = '';
  feedback.innerHTML = '';
  Message.value = '';
  feedback.value = '';
};

//Listeners
socket.on('Typing', data => {
  // Someone is typing
  feedback.innerHTML = `<p><em> ${data} is typing... </em></p>`;
});

socket.on('Chat', data => {
  //Someone sent a message
  clearExtras();
  Output.innerHTML += `<p><strong>${data.handle}: </strong>${data.Output}</p>`;
});
