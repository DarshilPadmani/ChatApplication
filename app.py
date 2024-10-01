from flask import Flask, render_template
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

# Serve the chat page
@app.route('/')
def chat():
    return render_template('chat.html')

# Handle incoming messages
@socketio.on('message')
def handle_message(msg):
    print(f"{msg['user']}: {msg['text']}")
    send(msg, broadcast=True)  # Broadcast to all connected clients

if __name__ == '__main__':
    socketio.run(app, debug=True)
