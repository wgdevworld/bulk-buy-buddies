from flask import current_app

def save_message_to_db(message_data):
    print("Saving message to db...")
    try:
        # Assuming 'mongo' is the PyMongo instance initialized in main.py
        mongo = current_app.config['MONGO']
        messages_collection = mongo.db.messages
        message_dict = {
            "_id": message_data['id'],
            "text": message_data['text'],
            "fromUid": message_data['fromUid'],
            "toUid": message_data['toUid'],
            "timestamp": message_data['timestamp'],
        }
        messages_collection.insert_one(message_dict)
        return True
    except Exception as e:
        print(f"Error saving message: {str(e)}")
        return False
