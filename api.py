import hashlib
from flask import request
from flask_restful import Resource, fields, marshal_with
from models import db, User, Queue, Category, Item, Transaction
from errors import NotFoundError, ValidationError
from mail_config import send_email

class UserApi(Resource):
    output = {"user_id": fields.Integer, "name": fields.String, "email": fields.String,
              "password": fields.String, "active": fields.Boolean}

    @marshal_with(output)
    def get(self, email: str, password: str):
        obj = User.query.filter_by(email=email, password=password).first()

        if not obj:
            raise NotFoundError(404)

        obj.active = True
        db.session.commit()
        return obj, 200

    @marshal_with(output)
    def put(self, email: str=None):
        
        if not email:
            form = request.get_json()
            print(form)
            
            obj = User(name=form.get("name"), email=form.get("email"),
                   password=hashlib.sha256(form.get("password").encode('utf-8')).hexdigest())
            
            if not isinstance(obj.name, str) or len(obj.name) == 0:
                raise ValidationError(
                    status_code=400, error_code="USER001", error_msg="Invalid name!")

            if not isinstance(obj.email, str) or len(obj.email) == 0:
                raise ValidationError(
                    status_code=400, error_code="USER002", error_msg="Invalid email!")

            if not isinstance(obj.password, str) or len(obj.password) == 0:
                raise ValidationError(
                    status_code=400, error_code="USER003", error_msg="Invalid password!")

            if User.query.filter_by(email=obj.email).first():
                raise ValidationError(
                    status_code=409, error_code='USER004', error_msg='User already exists!')
                
            db.session.add(obj)
            db.session.commit()
            return obj, 201
        
        obj = User.query.filter_by(email=email).first()

        if not obj:
            raise NotFoundError(status_code=404)

        password_data = request.get_json().get("password")

        if not isinstance(password_data, str) or len(password_data) == 0:
            raise ValidationError(status_code=400, error_code="USER002",
                                  error_msg="Invalid password!")

        obj.password = hashlib.sha256(password_data.encode('utf-8')).hexdigest()

        db.session.commit()
        return obj, 202

    def delete(self, email: str):
        obj = User.query.first()

        if not obj:
            raise NotFoundError()
        
        db.session.delete(obj)
        db.session.commit()
        return '', 200

    @marshal_with(output)
    def post(self):
        form = request.get_json()
        print(form)

        obj = User(name=form.get("name"), email=form.get("email"),
                   password=form.get("password"))

        if not isinstance(obj.name, str) or len(obj.name) == 0:
            raise ValidationError(
                status_code=400, error_code="USER001", error_msg="Invalid name!")

        if not isinstance(obj.email, str) or len(obj.email) == 0:
            raise ValidationError(
                status_code=400, error_code="USER002", error_msg="Invalid email!")

        if not isinstance(obj.password, str) or len(obj.password) == 0:
            raise ValidationError(
                status_code=400, error_code="USER003", error_msg="Invalid password!")

        if User.query.filter_by(email=obj.email).first():
            raise ValidationError(
                status_code=409, error_code='USER004', error_msg='User already exists!')

        db.session.add(obj)
        db.session.commit()
        return obj, 201

class ManagerQueueApi(Resource):
    output = {"sl_no": fields.Integer, "name": fields.String, "email": fields.String,
              "password": fields.String}

    
    @marshal_with(output)
    def get(self, sl_no:int=None):
        if not sl_no:
            obj = Queue.query.all()
        else:
            obj = Queue.query.filter_by(sl_no=sl_no).first()
        
        if not obj:
            raise NotFoundError(status_code=404)
        
        return obj, 200

    @marshal_with(output)
    def post(self):
        form = request.get_json()
        
        print(form)

        obj = Queue(name=form.get("name"), email=form.get("email"),
                    password=form.get("password"))

        if not isinstance(obj.name, str) or len(obj.name) == 0:
            raise ValidationError(
                status_code=400, error_code="QUEUE001", error_msg="Invalid name!")

        if not isinstance(obj.email, str) or len(obj.email) == 0:
            raise ValidationError(
                status_code=400, error_code="QUEUE002", error_msg="Invalid email!")

        if not obj.password:
            raise ValidationError(
                status_code=400, error_code="QUEUE003", error_msg="Invalid password!")

        if Queue.query.filter_by(email=obj.email).first():
            raise ValidationError(
                status_code=409, error_code='QUEUE004', error_msg='Please wait for approval!')

        db.session.add(obj)
        db.session.commit()
        return obj, 201

    @marshal_with(output)
    def delete(self):
        obj = Queue.query.first()

        if obj:
            db.session.delete(obj)
            send_email(obj.email, "Approval to join as a manager", "Congratulations! The site administrator has approved your request to join Kirana Store as a store manager!")
            db.session.commit()

        return '', 200
    
class CategoryApi(Resource):
    output = {"cat_id": fields.Integer, "cat_name": fields.String}
    
    @marshal_with(output)
    def get(self, cat_id:int=None):
        
        if not cat_id:
            obj = Category.query.all()
            
        obj = Category.query.filter_by(cat_id=cat_id).first()
        
        if not obj:
            raise NotFoundError(status_code=404)
        
        return obj, 200
    
    @marshal_with(output)
    def delete(self):
        obj = Category.query.first()
        
        if obj:
            db.session.delete(obj)
            db.session.commit()
        
        return '', 200
    
    @marshal_with(output)
    def post(self):
        form = request.get_json()
        obj = Category(cat_name=form.get("cat_name"))
        
        if Category.query.filter_by(cat_name=obj.cat_name).first():
            raise ValidationError(
                status_code=409, error_code='CAT001', error_msg='Category Already Exists!')
        
        return obj, 201
    
class ItemApi(Resource):
    
    output = {"item_id": fields.Integer, "cat_id": fields.Integer, "item_name": fields.String, "quantity": fields.Integer, "price": fields.Float, "mfg": fields.String}
    
    @marshal_with(output)
    def get(self):
        obj = Item.query.all()
        
        if not obj:
            raise NotFoundError(status_code=404)
        
        return obj, 200
    
    @marshal_with(output)
    def put(self, item_id, flag: int=0):
        
        obj = Item.query.filter_by(item_id=item_id).first()
        
        if not obj:
            raise NotFoundError(status_code=404)
        
        if flag == 0:
            form = request.get_json()
            obj.item_name = form.get('item_name')
            obj.quantity = form.get('quantity')
            obj.price = form.get('price')
            obj.mfg = form.get('mfg')  
        
        else:
            obj.quantity -= 1
            
        db.session.commit()
        return obj, 202

class TransactionApi(Resource):
          
          output = {"transaction_id": fields.Integer, "user_id": fields.Integer, "item_id": fields.Integer}
          
          @marshal_with(output)
          def get(self, user_id: int):
              
            obj = Transaction.query.filter_by(user_id=user_id).all()

            return obj, 200