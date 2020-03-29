const express = require("express");
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', userController.user_signup);

router.post('/login', userController.user_login);

router.post('/users', userController.get_users);

router.get('/users/:userId', userController.get_user);

router.patch('/users/:userId', checkAuth, userController.update_user);

router.post('/users/forgotPassword', userController.post_user_reset_password);

router.get('/users/getNewPassword/:token', userController.get_new_password);

router.post('/users/postNewPassword', userController.post_new_password)

//router.get('/me', passport.authenticate('jwt', { session: false }), userController.me);

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;