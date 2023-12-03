from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

roles_users = db.Table('roles_users', db.Column('user_id', db.Integer(), db.ForeignKey('user.user_id')), db.Column('role_id', db.Integer(), db.ForeignKey('role.role_id'))) 


class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False,default="")
    roles = db.relationship('Role', secondary=roles_users,backref=db.backref('users', lazy='dynamic'))

    
class Role(db.Model):
    __tablename__ = 'role'
    role_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    
    
class Queue(db.Model):
    __tablename__ = 'manager_queue'
    sl_no = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    
class Category(db.Model):
    __tablename__ = 'category'
    cat_id = db.Column(db.Integer, primary_key=True)
    cat_name = db.Column(db.String(100), nullable=False)

class Item(db.Model):
    __tablename__ = 'item'
    item_id = db.Column(db.Integer, primary_key=True)
    cat_id = db.Column(db.Integer, db.ForeignKey("category.cat_id"))
    item_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float(6, 2), default=0.00)
    mfg = db.Column(db.Date())
    inventory = db.relationship("Inventory", back_populates="item")

class Inventory(db.Model):
    __tablename__ = "inventory"
    item_id = db.Column(db.Integer, db.ForeignKey("item.item_id"), primary_key=True)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float(6, 2))
    item = db.relationship("Item", back_populates="inventory")
    
class Transaction(db.Model):
    __tablename__ = "transactions"
    transaction_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    item_id = db.Column(db.Integer, db.ForeignKey("item.item_id"))