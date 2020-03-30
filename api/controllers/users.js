const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.API_KEY
    }
}));

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exist'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            isAdmin: false
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    result,
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                })
            }
        })
};

exports.user_login = (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            isAdmin: user.isAdmin
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        return res.status(400).json({
                            message: 'Incorrect Password'
                        });
                    }
                });
        });
};

exports.get_users = (req, res, next) => {
    let searchString = req.body.searchString;
    if(searchString) {
        User.find({$text: {$search: searchString}})
        .select('_id name lastName email isAdmin')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        lastName: doc.lastName,
                        email: doc.email,
                        isAdmin: doc.isAdmin,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/user/users'
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
    } else {
        User.find()
        .select('_id name lastName email isAdmin')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        lastName: doc.lastName,
                        email: doc.email,
                        isAdmin: doc.isAdmin,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/user/users'
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
    }
};

exports.get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id name lastName email isAdmin')
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/user/users/' + id
                    }
                })
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

exports.update_user = (req, res, next) => {
    const id = req.params.userId
    const updatedName = req.body.name;
    const updatedLastName = req.body.lastName;
    const updatedEmail = req.body.email;
    const updatedIsAdmin = req.body.isAdmin;
    User.findById(id)
        .then(user => {
            user.name = updatedName;
            user.lastName = updatedLastName;
            user.email = updatedEmail;
            user.isAdmin = updatedIsAdmin;
            return user.save().then(result => {
                res.status(200).json({
                    message: 'User updated',
                    url: 'http://localhost:4000/user/users/' + id
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.post_user_reset_password = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return;
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if(!user){
                    return res.status(404).json({
                        message: 'User not found'
                    });
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save().then(result => {
                    res.status(200).json({
                        message: 'Reset password link is send to email!'
                    })
                });
            })
            .then(() => {
                transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@node-complete.com',
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="https://theatre-project.herokuapp.com/new-password/${token}">link</a> to set a new password.</p>
                    `
                });
            })
            .catch(err => {
                console.log(err)
            });
    })
};

exports.get_new_password = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then((user) => {
            res.status(200).json({
                userId: user._id/* .toString() */,
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.post_new_password = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: {$gt: Date.now()},
        _id: userId
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'Password is updated'
        })
    })
    .catch(err => {
        console.log(err);
    })
};

/* exports.me = (req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
}; */