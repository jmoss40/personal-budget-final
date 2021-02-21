const mongoose = require('mongoose');
const { array, number } = require('prop-types');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    budgets: []
}, { 
    minimize: false,
    collection: 'users'
});

module.exports = mongoose.model('user', userSchema)
