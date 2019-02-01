$(document).ready(function() {
  $('#action_menu_btn').click(function() {
    $('.action_menu').toggle();
  });
});
let socket = io.connect('http://19.74.4.155:4000');
var app = new Vue({
  el: '#app',
  data: {
    messages: [],
    message: '',
    username: null,
    feedback: null,
    state: 0
  },
  methods: {
    playSound(sound) {
      if (sound) {
        console.log('Should be sound');
        const audio = new Audio(sound);
        audio.play();
      } else {
        console.log('Should not be sound');
      }
    },
    signout: () => {
      socket.emit('Signout', app.username);
      app.state = 0;
    },
    sendFeedback: () => {
      socket.emit('Typing', app.username);
    },
    sendMessage: () => {
      socket.emit('Chat', {
        Output: app.message,
        handle: app.username
      });
      app.message = '';
    },
    setUsername: () => {
      socket.emit('Join', app.username);
      app.state = 1;
    },
    continueWithoutUsername: () => {
      app.state = 1;
      this.username = 'Guest';
      socket.emit('Join', app.username);
    }
  },
  created: () => {
    socket = io.connect('http://19.74.4.155:4000');
  },
  mounted: () => {
    socket
      .on('Chat', message => {
        console.log('Recieved Chat');
        app.playSound('./quite-impressed.mp3');
        app.feedback = null;
        app.messages.push(message);
        // this needs to be done AFTER vue updates the page!!
        app.$nextTick(() => {
          if (app.state === 1) {
            const messageBox = document.getElementById('chatbox');
            messageBox.scrollTop = messageBox.scrollHeight;
          }
        });
      })
      .on('Typing', data => {
        app.feedback = data;
      });
  }
});
