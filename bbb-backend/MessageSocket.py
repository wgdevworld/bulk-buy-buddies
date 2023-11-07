# MessageSocket.py

def register_socket_events(socketio):
    @socketio.on('connect')
    def connect():
        print("Client connected")

    @socketio.on('disconnect')
    def disconnect():
        print("Client disconnected")

    @socketio.on('new_message')
    def handle_new_message(messageData):
        # Your logic to handle incoming messages and broadcasting them
        # ...
        print("new message received")
        
