from flask import current_app, Blueprint
from flask_socketio import Namespace, emit

class MessageSocket(Namespace):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def emit_new_messages(self):
        # while loop to continuously listen for new messages

        # Send new message to all connected clients
        emit('new_message', cursor.next(), broadcast=True)

    def on_connect(self):
        # Start a background task for listening new messages
        current_app._get_current_object().socketio.start_background_task(self.emit_new_messages)

        emit('connection_success')

    def on_new_message(self, message_data):
        # Save message to MongoDB

        # Emit new message to connected clients
        emit('new_message', message_data, broadcast=True)

message_socket = MessageSocket('/message-socket')
