# MessageSocket.py
from messaging.MessagingDBInterface import save_message_to_db
from flask import request
from flask_socketio import emit

user_sockets = {}

def register_socket_events(socketio):
    @socketio.on('connect')
    def on_connect():
        user_id = request.args.get('uid')
        if user_id:
            user_sockets[user_id] = request.sid
            print(f"User with ID: {user_id} connected")

    @socketio.on('disconnect')
    def disconnect():
        print("Client disconnected")

    @socketio.on('new_message')
    def handle_new_message(message_data):
        # Save the message to the database
        success = save_message_to_db(message_data)

        if success:
            print("Message saved to database. now broadcasting...")
            to_uid = message_data['toUid']
            # Check if the recipient is connected
            if to_uid in user_sockets:
                # Emit the message to the recipient's socket session ID
                emit('got_message', message_data, room=user_sockets[to_uid])
            else:
                print(f"User {to_uid} is not connected.")

            # Additionally, you may want to broadcast the message to the sender for confirmation
            from_uid = message_data['fromUid']
            if from_uid in user_sockets:
                emit('got_message', message_data, room=user_sockets[from_uid])
        else:
            print("Error saving message to database.")
            # Handle the error case
