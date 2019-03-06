const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userschema = new mongoose.Schema({
    email: {
        type: 'string',
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require:true
        }
    }]
});

userschema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

userschema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

userschema.statics.findByToken = function (token) {
        var User = this;
        var decoded;

        try{
            decoded = jwt.verify(token, 'abc123');
        }catch(e){
            return Promise.reject();
        }

        return User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        });
};

userschema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, success) => {
                if(success){
                    return resolve(user);
                }else{
                    return reject();
                }
            });
        });        
    });
};

userschema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')){
        var newPassword = user.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPassword, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        }); 
    }
    else{
        next();
    }
});

var User = mongoose.model('User', userschema);

module.exports = {User};