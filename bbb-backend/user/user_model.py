# from flask_login import UserMixin
from flask import Flask, jsonify, request, current_app
# from flask import current_app as app
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

class User:
    # def __init__(self, id, email, firstname, lastname):
    #     self.id = id
    #     self.email = email
    #     self.firstname = firstname
    #     self.lastname = lastname

#     @staticmethod
#     def get_by_auth(email, password):
#         rows = app.db.execute("""
# SELECT password, id, email, firstname, lastname
# FROM Users
# WHERE email = :email
# """,
#                               email=email)
#         if not rows:  # email not found
#             return None
#         elif not check_password_hash(rows[0][0], password):
#             # incorrect password
#             return None
#         else:
#             return User(*(rows[0][1:]))

    @staticmethod
    def email_exists(email_addr):
        mongo = current_app.config['MONGO']
        users  = mongo.db.users
        rows = users.find({ 'email': email_addr })
        # print(rows)
        return rows.count() > 0

    @staticmethod
    def register(firstname, lastname, email, password):
        try:
            print("hello")
            mongo = current_app.config['MONGO']
            users  = mongo.db.users
            print("hi")
            user = {
                "id": uuid.uuid4().hex,
                "firstname": firstname,
                "firstname": lastname,
                "email": email,
                "password": generate_password_hash(password)
            }
            print(user)
            if users.find_one({"email": user["email"]}):
                return jsonify({"error": "Already a user with this email"}), 400

            if users.insert_one(user):
                return jsonify(user), 200
            
            return jsonify({"error": "Failed to sign up"}), 200

        except Exception as e:
            # likely email already in use; better error checking and reporting needed;
            # the following simply prints the error to the console:
            print(str(e))
            return None

#     @staticmethod
#     @login.user_loader
#     def get(id):
#         rows = app.db.execute("""
# SELECT id, email, firstname, lastname
# FROM Users
# WHERE id = :id
# """,
#                               id=id)
#         return User(*(rows[0])) if rows else None
