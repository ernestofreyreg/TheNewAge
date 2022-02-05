"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, NFTs,Collections
from api.utils import generate_sitemap, APIException
import requests
import os

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

api = Blueprint('api', __name__)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route('/upload', methods=['POST'])
def upload_file():
    # check if the post request has the file part
    if 'image' not in request.files:
        return 'no-image', 400
        
    image = request.files['image']

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if image.filename == '':
        return 'no-filename', 400

    if image and allowed_file(image.filename):
        # filename = image.filename
        # image.save(os.path.join(UPLOAD_FOLDER, filename))

        data = image
        headers = {"Content-Type":"application/octet-stream","Authorization":"Bearer "+ os.getenv("NFT_STORAGE_API")}
        r = requests.post("https://api.nft.storage/upload",data=data,headers=headers)
        if r.status_code == 200:
            response = r.json()
            return jsonify(response), 200
        return "NFT Storage Failed",500

    return 'Something went wrong',400
      

        
    
@api.route('/collections/<account>', methods=['GET'])
def get_collections_by_account(account):
    collections = Collections.query.filter(Collections.account == account)
    collections_response = [x.serialize() for x in collections]

    return jsonify(collections_response),200 



@api.route('/nft',methods=['POST'])
def create_nft():
    data = request.get_json(force=True)
    id = data['id']
    name = data['name']
    description = data['description']
    quantity = data['quantity']
    attributes = data['attributes']
    collection_id = data['collection_id']
    contract_id = data['contract_id']
    image_url = data['image_url']
    position =  data['position']
    nft = Nfts(name=name,description=description,quantity=quantity,attributes=attributes,image_url=image_url,position=position,collection_id=collection_id,contract_id=contract_id)
    db.session.add(nft)
    db.session.commit()

    return '',204

@api.route('/nft/<int:nft_id>', methods=["PUT"])
def update_nft(nft_id):
    data = request.get_json(force=True)
    nft = Nfts.query.get(nft_id).first() 
    name = data['name']
    description = data['description']
    quantity = data['quantity']
    attributes = data['attributes']
    collection_id = data['collection_id']
    contract_id = data['contract_id']
    image_url = data['image_url']
    db.session.commit(nft)

    return '', 204

@api.route('/nft/<int:nft_id>',methods=['DELETE'])
def remove_nft(nft_id):
    delete_nft = Nfts.query.get(nft_id)
    db.session.delete(delete_nft)
    db.session.commit()

    return jsonify({'Deleted'})

@api.route('/collection',methods=['POST'])
def create_collection():
    data = request.get_json(force=True)
    name = data['name']
    description = data['description']
    attributes = data['attributes']
    url = data['url']
    owner_account = data['owner_account']
    contract_account = data['contract_account']
    fee = data['fee']
    transferred = data['transferred']
    collection = Collections(
        name=name,
        description=description,
        attributes=attributes,
        url=url,
        owner_account=owner_account,
        contract_account=contract_account,
        fee=fee,
        transferred=transferred,
        mainnet=False
    )  
    db.session.add(collection)
    db.session.commit()

    return jsonify(collection.serialize()),200

@api.route('/collection/<int:collection_id>', methods=["PUT"])
def update_collections(collection_id):
    data = request.get_json(force=True)
    collection = Collections.query.get(collection_id)
    collection.name = data['name']
    collection.description = data['description']
    collection.attributes = data['attributes']
    collection.url = data['url']
    collection.owner_account = data['owner_account']
    collection.contract_account = data['contract_account']
    collection.fee = data['fee']
    collection.transferred = data['transferred']
    collection.mainnet = data['mainnet']
    nfts = NFTs.query.filter(NFTs.collection_id == collection_id)
    nfts.delete()

    for x in data['nfts']:
        name = x['name']
        description = x['description']
        quantity = x['quantity']
        attributes = x['attributes']
        contract_id = x['contract_id']
        nft_id = x['nft_id']
        image_url = x['image_url']
        nft = NFTs(name=name,description=description,quantity=quantity,attributes=attributes,image_url=image_url,collection_id=collection_id,contract_id=contract_id,nft_id=nft_id)
        db.session.add(nft)
        
    
    db.session.commit()

    return '',204


@api.route('/collection/<int:collection_id>',methods=['GET'])
def get_collection_by_id(collection_id):
    collection = Collections.query.filter(Collections.id == collection_id).first() 

    return jsonify(collection.serialize()),200


@api.route('/opensea/<int:collection_id>/<nft_id>', methods=['GET'])
def get_opensea_metadata(collection_id,nft_id):
    nft = NFTs.query.filter(NFTs.nft_id == nft_id,NFTs.collection_id == collection_id).first()
    if nft is None:
        return "", 404

    return jsonify({
        'name': nft.name,
        'description': nft.description,
        'image': f"https://ipfs.io/ipfs/{nft.image_url}",
        # 'attributes': jonft.attributes
    }), 200

