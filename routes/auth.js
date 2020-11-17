var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signup, signin, isSignedIn, activateAccount, forgotPassword, resetPassword, googleLogin, facebookLogin} = require('../controllers/auth');

router.post(
    '/signup', 
    [
        check('name','Name should be atleast 3 character long').isLength({min:3}),
        check('email','Not a valid email').isEmail(),
        check('password','Password should be atleast 8 character long, contain one uppercase, one lowercase, one special character, one number').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/, "i")
    ], 
    signup);

router.post(
    '/signin', 
    [
        check('email','Not a valid email').isEmail()
    ], 
    signin);

router.post('/activation', activateAccount);

router.put(
    '/forgotpassword',
    [
        check('email','Not a valid email').isEmail()
    ],
    forgotPassword);

router.put(
    '/resetpassword',
    [
        check('newPassword','Password should be atleast 8 character long, contain one uppercase, one lowercase, one special character, one number').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/, "i")
    ],
    resetPassword);

router.post('/googlelogin', googleLogin)
router.post('/facebooklogin', facebookLogin)
//router.get('/signout',signout);


module.exports = router;