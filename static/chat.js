// Initialize Socket.IO connection
var socket = io();
var username = null;

// Set username and show chat container
document.getElementById('set-name-btn').onclick = function() {
    username = document.getElementById('username').value;
    if (username) {
        document.getElementById('name-modal').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        socket.emit('user_status', { user: username, status: 'online' });
    } else {
        alert("Please enter a name");
    }
};

// Allow sending message with Enter key
document.getElementById('msg-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Handle sending messages
document.getElementById('send-btn').onclick = sendMessage;

function sendMessage() {
    var msg = document.getElementById('msg-input').value;
    if (msg && username) {
        socket.emit('message', { user: username, text: msg });
        document.getElementById('msg-input').value = '';
    }
}

// Listen for messages
socket.on('message', function(msg) {
    var messageDiv = document.createElement('div');
    var nameSpan = document.createElement('span');
    var messageSpan = document.createElement('span');
    var timeSpan = document.createElement('span');  // Create the timestamp element
    var timestamp = new Date().toLocaleTimeString();

    nameSpan.textContent = msg.user + ": ";
    nameSpan.classList.add('name');

    messageSpan.textContent = msg.text;
    messageSpan.classList.add('message');

    // Add the time with a timestamp class
    timeSpan.textContent = ` (${timestamp})`;
    timeSpan.classList.add('timestamp');  // Assign class to timestamp

    messageDiv.classList.add(msg.user === username ? 'my-message' : 'other-message');
    messageDiv.appendChild(nameSpan);
    messageDiv.appendChild(messageSpan);
    messageDiv.appendChild(timeSpan);  // Append the timeSpan to the messageDiv

    document.getElementById('messages').appendChild(messageDiv);

    // Auto-scroll to the latest message
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;

    var notificationSound = new Audio('/static/notification.mp3');
    if (msg.user !== username) {
        notificationSound.play();
    }
});

// Typing Indicator
document.getElementById('msg-input').addEventListener('input', () => {
    socket.emit('typing', username);
});

socket.on('typing', function(user) {
    document.getElementById('typing-indicator').textContent = `${user} is typing...`;
});

socket.on('stop typing', function() {
    document.getElementById('typing-indicator').textContent = '';
});

// User Status Indicator
socket.on('user_status', function(status) {
    document.getElementById('status-indicator').textContent = `${status.user} is ${status.status}`;
});
