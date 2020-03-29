const mongoose = require('mongoose');

const Product = require('../models/product');

exports.product_create_product = (req, res, next) => {
    console.log('req file..', req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        productImage: req.body.productImage
    });
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    description: result.description,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.product_get_all = (req, res, next) => {
    Product.find()
        .select('name price description _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        description: doc.description,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                url: 'http://localhost:4000/products/'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name description price _id productImage')
        .exec()
        .then(doc => {
            console.log('From database', doc);
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/'
                    }
                });
            }
            else {
                res.status(404).json({ message: "Not valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updatedName = req.body.name;
    const updatedDescription = req.body.description;
    const udpatedPrice = req.body.price;
    const updatedProductImage = req.body.productImage;
    Product.findById(id)
        .then(product => {
            product.name = updatedName;
            product.description = updatedDescription;
            product.price = udpatedPrice;
            product.productImage = updatedProductImage;
            return product.save().then(result => {
                res.status(200).json({
                    message: "Product updated",
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/' + id
                    }
                });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};