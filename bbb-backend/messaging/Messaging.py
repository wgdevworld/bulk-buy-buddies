from flask import Flask, request, jsonify, Blueprint, current_app
from messaging.MessagingDBInterface import save_message_to_db

# Flask Blueprint configuration
messaging_api = Blueprint('messaging_api', __name__)

"""Saves a new message to the messages MongoDB collection.

Parameters:
- None

Returns:
- JSON response with 'success' key on success
- JSON response with 'error' key on failure

This route handles saving a new message to the MongoDB messages collection. 
It then unpacks the message data from the POST request body JSON.
On success, a JSON response with a 'success' key is returned.
On failure, a JSON response with an 'error' key containing the exception message is returned.
"""
@messaging_api.route("/save_message", methods=['POST', 'OPTIONS'])
def save_message():
    print("Saving message API called...")
    if request.method == 'OPTIONS':
        # Handle the OPTIONS method
        response = current_app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'  # Set appropriate CORS headers
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    message_data = request.get_json()
    # save the messages database
    success = save_message_to_db(message_data)
    if success:
        return jsonify(success=True)
    else:
        return jsonify(error="failed to save message"), 500


"""Gets chat messages for a user.

Parameters:
- user: The user ID to get chats for

Returns: 
- JSON response containing chats object on success
- JSON response with error message on failure

This route handles getting all chat messages for a specific user.
It queries the MongoDB messages collection for all messages 
where the user is either the sender or recipient.

The messages are divided by opponent UID into separate chats.

The chat messages are returned in a JSON response containing a 
chats object mapping opponent UID to an array of messages.
"""
@messaging_api.route("/get_chats", methods=['GET'])
def get_chat_messages():
    # Set mongoDB configs
    mongo = current_app.config['MONGO']
    messages_collection = mongo.db.messages

    # which user we are getting the chats for
    user = request.args.get("user")
    
    # if user is empty, return error response
    if not user:
        return jsonify({"error": "User parameter is required"}), 400

    # MongoDB Query for all messages related to this user
    # Sorted by time
    all_messages = messages_collection.find({
        "$or": [
            {"fromUid": user},
            {"toUid": user}
        ]
    }).sort("timestamp")

    chats = {}
    # divide the messages into chats, i.e. which opponent
    for message in all_messages:

        # Convert ObjectId to string
        message["_id"] = str(message["_id"])

        # set opponent uid depending on chat
        if message["fromUid"] == user:
            opponentUid = message["toUid"]
        else:
            opponentUid = message["fromUid"]
        
        # append the message to the chat
        if opponentUid not in chats:
            chats[opponentUid] = []
        chats[opponentUid].append(message)
    
    return jsonify({"chats": chats})
