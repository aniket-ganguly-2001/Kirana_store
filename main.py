import hash
from flask import Flask, request, redirect, jsonify, render_template
from flask_cors import CORS
from flask_restful import Api
from flask_security import Security, SQLAlchemyUserDatastore, utils
from flask_login import LoginManager, login_required, logout_user, current_user
from config import LocalDevelopmentConfig
from models import *
from api import *

app = Flask(__name__, template_folder='templates')
app.config.from_object(LocalDevelopmentConfig)
db.init_app(app)
CORS(app)

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

login_manager = LoginManager(app)

api = Api(app)

api.add_resource(UserApi, '/api/user/','/api/user/<string:email>/<string:password>')
api.add_resource(ManagerQueueApi, '/api/queue')

def create_app():
    with app.app_context():
        inspector = db.inspect(db.engine)
        table_names = inspector.get_table_names()

        if not table_names:
            db.create_all()

            admin_role = Role(name='admin', description='Administrator')
            manager_role = Role(name='manager', description='Store Manager')
            customer_role = Role(name='customer', description='Regular customer')
            db.session.add(admin_role)
            db.session.add(manager_role)
            db.session.add(customer_role)
            db.session.commit()

            admin_user = user_datastore.create_user(
                name="Admin",
                email='ganguly@kiranastore.com',
                password=hash.calculate_sha256_hash('123456789'),
                active=1
            )
            admin_user.roles.append(admin_role)

            db.session.commit()
            print("Database tables created!")
        else:
            print("Database tables already exist")

create_app()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/signup', methods=['POST'])
def create_customer():
    data = request.json
    customer_role = Role.query.filter_by(name="customer").first()
    customer = user_datastore.create_user(
        username=data['username'],
        email=data['email'],
        password=utils.hash_password(data['password'])
    )
    customer.roles.append(customer_role)
    db.session.commit()
    return jsonify({"message": "User Created"})

@login_manager.user_loader
def signin(username, password):
    return User.query.filter_by(email=username, password=password ).first()

@login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect('/')

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify('Logged out'), 200

if __name__ == '__main__':
    app.run(debug=True)
