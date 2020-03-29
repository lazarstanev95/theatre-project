const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false },
    resetToken: { type: String, required: false } ,
    resetTokenExpiration: { type: Date, required: false }
});
userSchema.index({name: 'text', lastName: 'text', email: 'text'});
module.exports = mongoose.model('User', userSchema);