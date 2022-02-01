const User = require('../models/user');

module.exports.register = (req, res) => {
    res.render('users/register');
}

module.exports.registerPost = async( req, res, next) => {
    try{
        const { email, username, password } = req.body
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Successfully registered')
            res.redirect('/campground');
        })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.login = (req, res) => {
    res.render('users/login');
};

module.exports.loginPost = async(req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Logged out')
    res.redirect('/campground');
}