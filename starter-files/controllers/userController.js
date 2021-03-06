const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify')

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' })
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'you must supply a name').notEmpty();
    req.checkBody('email', 'that email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    })
    req.checkBody('password', 'password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'confirmed password cannot be blank').notEmpty();
    req.checkBody('password-confirm', 'your passwords do not match').equals(req.body.password)

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg))
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() })
        return; //stop the fn from running
    }
    next() //no errors
}