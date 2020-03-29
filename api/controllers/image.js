const Image = require('../models/image');

exports.uploadImage = (req, res, next) => {
    console.log(req.body);
    const newImage = new Image({
        imageName: req.body.imageName,
        imageData: req.file.path.replace(/\\/g, "/")
    });
    newImage.save()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                success: true,
                document: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};