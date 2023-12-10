from flask import Flask, request, jsonify, Blueprint, current_app
from messaging.MessagingDBInterface import save_message_to_db

# Flask Blueprint configuration
messaging_blueprint = Blueprint('messaging_blueprint', __name__)

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
@messaging_blueprint.route("/save_message", methods=['POST', 'OPTIONS'])
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
@messaging_blueprint.route("/get_chats", methods=['GET'])
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


'''

'''
@messaging_blueprint.route("/get_user_info", methods=['POST', 'OPTIONS'])
def get_user_info():
    if request.method == 'OPTIONS':
        # Handle the OPTIONS method
        response = current_app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'  # Set appropriate CORS headers
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    uid = request.get_json()['uid']
    print(uid)

    # Set mongoDB configs
    mongo = current_app.config['MONGO']
    users_collection = mongo.db.users

    print("Getting user info API called...")

    user_infos = users_collection.find({
        "uid": uid
    })

    specified_user = None

    # there should be only one result
    for info in user_infos:
        specified_user = info
        specified_user['_id'] = str(specified_user['_id'])
    
    print("User info: ", specified_user)
    
    return jsonify(specified_user)

@messaging_blueprint.route("/delete_message", methods=['POST'])
def delete_message():
    message_id = request.get_json().get('message_id')

    if not message_id:
        return jsonify({"error": "Message ID is required"}), 400

    mongo = current_app.config['MONGO']
    messages_collection = mongo.db.messages

    delete_result = messages_collection.delete_one({"_id": message_id})

    if delete_result.deleted_count == 0:
        return jsonify({"error": "Message deletion failed"}), 500

    return jsonify({"success": True})

@messaging_blueprint.route("/like_unlike_message", methods=['POST'])
def like_unlike_message():
    message_id = request.get_json().get('message_id')
    action = request.get_json().get('action')  # 'like' or 'unlike'

    if not message_id or not action:
        return jsonify({"error": "Message ID and action are required"}), 400

    mongo = current_app.config['MONGO']
    messages_collection = mongo.db.messages

    if action == 'like':
        # Logic to like a message
        update_result = messages_collection.update_one({"_id": message_id}, {"$set": {"liked": True}})
    elif action == 'unlike':
        # Logic to unlike a message
        update_result = messages_collection.update_one({"_id": message_id}, {"$unset": {"liked": ""}})
    else:
        return jsonify({"error": "Invalid action"}), 400

    if update_result.modified_count == 0:
        return jsonify({"error": "Message update failed"}), 500

    return jsonify({"success": True})