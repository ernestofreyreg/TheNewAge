from flask_sqlalchemy import SQLAlchemy
# https://nft.storage/
db = SQLAlchemy()


class NFTs(db.Model):
    __tablename__= "nfts"
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(200),unique=False, )
    description = db.Column(db.String(250),unique=False)
    quantity = db.Column(db.Integer)
    attributes = db.Column(db.Text)
    collection_id = db.Column(db.Integer, db.ForeignKey('collections.id'),)
    nft_id = db.Column(db.String(200), unique=True)
    collection = db.relationship("Collections")
    contract_id = db.Column(db.String(250),unique=False)
    image_url = db.Column(db.String(200),unique=False)

    def __repr__(self):
        return '<NFTs %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description":self.description,
            "quantity":self.quantity,
            "attributes":self.attributes,
            "nft_id":self.nft_id,
            "contract_id":self.contract_id,
            "image_url":self.image_url,
            # do not serialize the password, its a security breach
        }

class Collections(db.Model):
    __tablename__ = "collections"
    id = db.Column(db.Integer,primary_key= True)
    name = db.Column(db.String(200),unique=False,nullable=False)
    description = db.Column(db.String(200),unique=False,nullable=False)
    attributes = db.Column(db.String(200),unique=False,nullable=False)
    url = db.Column(db.String(200),unique=False,nullable=False)
    owner_account = db.Column(db.String(200),unique=False,nullable=False)
    contract_account = db.Column(db.String(200),unique=False,nullable=False)
    fee = db.Column(db.Integer)
    transferred = db.Column(db.Boolean)
    mainnet = db.Column(db.Boolean)

    def __repr__(self):
        return '<Collections %r>' % self.id

    def serialize(self):
        nfts = NFTs.query.filter(NFTs.collection_id == self.id)
        return {
            "id": self.id,
            "name": self.name,
            "description":self.description,
            "attributes":self.attributes,
            "url":self.url,
            "owner_account":self.owner_account,
            "contract_account":self.contract_account,
            "fee":self.fee,
            "transferred":self.transferred,
            "nfts":[x.serialize() for x in nfts],
            "mainnet":self.mainnet
            
            
            # do not serialize the password, its a security breach
        }