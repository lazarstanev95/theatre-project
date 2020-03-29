const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productsController = require('../controllers/products');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const Product = require('../models/product');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/', checkAuth, /* upload.single('productImage'), */ productsController.product_create_product);

router.get('/', productsController.product_get_all);

router.delete('/:productId', checkAuth, productsController.products_delete_product);

router.get('/:productId', productsController.products_get_product);

router.patch('/:productId', checkAuth, productsController.products_update_product);

module.exports = router;