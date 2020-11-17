const User = require('../models/user');
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandling');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

exports.signup = (req,res)=>{
    const { name, lastname, email, password } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    else{
        User.findOne({email})
            .exec((err,user)=>{
                if(user){
                    return res.status(400).json({
                        error: "Email is already taken"
                    })
                }
            })
    }

    const token = jwt.sign(
        {
          name,
          email,
          password
        },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
          expiresIn: '5m'
        }
      );

      //console.log(token)

      
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
    };
    sgMail
    .send(emailData)
    .then(sent => {
      return res.json({
        message: `Email has been sent to ${email}`
      });
    })
    .catch(err => {
      return res.status(400).json({
        error: err
      });
    });

};

exports.activateAccount = (req, res) => {
    const { token } = req.body;
  
    if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
          //console.log('Activation error');
          return res.status(401).json({
            error: 'Expired link. Signup again'
          });
        } else {
          const { name, email, password } = jwt.decode(token);
  
          console.log(email);
          const user = new User({
            name,
            email,
            password
          });
  
          user.save((err, user) => {
            if (err) {
              console.log('Save error', errorHandler(err));
              return res.status(401).json({
                errors: errorHandler(err)
              });
            } else {
              return res.json({
                message: user,
                message: 'Signup success'
              });
            }
          });
        }
      });
    } else {
      return res.json({
        error: 'Error. Please try again!'
      });
    }
  };

exports.signin = (req,res)=>{

    const errors = validationResult(req);
    const {email, password} = req.body; 

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({email}, (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "Email does not exist"
            })
        }

        if(!user.autheticate(password)){
            return res.status(401).json({
                error: "Email and Password does not match"
            })
        }

        //create token
        const token = jwt.sign({_id: user._id}, 
            process.env.SECRET,{
            expiresIn: '24h'
        });

        const {email, name, _id, role} = user;

        const cookieData = {
            token,
            user:{
                _id, name, email, role
            }
        }

        //put token in cookie
        //res.cookie("authToken", cookieData, {expire: new Date()+3600, httpOnly: true});

        //send response to frontend

        return res.json({
            token,
            user:{
                _id, name, email, role
            }
        });
    });
};



exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) =>{
    if(req.profile.role === 0){
        return res.json({
            error: "Access Denied ! Only admins allowed"
        })
    }
    next();
};

exports.forgotPassword = (req,res) => {
    const {email } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    else{
        User.findOne({email},
            (err,user)=>{
                if(err || !user){
                    return res.status(400).json({
                        error: "Email does not exist"
                    })
                }
            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_RESET_PASSWORD,
                {
                    expiresIn: '5m'
                }
            )
            
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Password Reset Link",
                html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/newpassword/${token}</p>
                    <hr />
                    <p>This link expires in 5 minutes</p>
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
            }
            return user.updateOne({
                resetPasswordLink: token
            },(err, success)=>{
                if(err){
                    return res.status(400).json({
                        error: "Database connection error on password reset"
                    })
                }
                else{
                    sgMail
                        .send(emailData)
                        .then(sent => {
                            return res.json({
                                message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                            })
                        })
                        .catch(err=>{
                            return res.json({
                                error: err.message
                            })
                        })
                }
            })
        }
        )
    }
}

exports.resetPassword = (req,res) => {
    const {resetToken, newPassword} = req.body

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    else{
        if(resetToken){
            jwt.verify(resetToken, process.env.JWT_RESET_PASSWORD, (err,decoded)=>{
                if(err){
                    return res.status(400).json({
                        error: "Link expired. Please try again!"
                    })
                }
                else{
                    User.findOne(
                        {
                            resetPasswordLink: resetToken
                        },
                        (err, user)=>{
                            if(err || !user){
                                return res.status(400).json({
                                    error: "Something went wrong. Try again!"
                                })
                            }

                            const updatedData = {
                                password: newPassword,
                                resetPasswordLink: ''
                            }

                            user = _.extend(user,updatedData)

                            user.save((err, updatedUser)=>{
                                if(err){
                                    return res.status(400).json({
                                        error: 'Error resetting user password'
                                    })
                                }
                                res.json({
                                    message: `Password updated! Now you can login with your new password`
                                })
                            })
                        }
                    )
                }
            })
        }
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleLogin = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then(response => {
        console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
              expiresIn: '24h'
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role }
            });
          } else {
            let password = email + process.env.SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                return res.status(400).json({
                  error: 'User signup failed with google'
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.SECRET,
                { expiresIn: '24h' }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role }
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again'
        });
      }
    });
};


exports.facebookLogin = (req, res) => {
    console.log('FACEBOOK LOGIN REQ BODY', req.body);
    const { userID, accessToken } = req.body;
  
    const url = `https://graph.facebook.com/v5.0/${userID}/?fields=id,name,email&access_token=${accessToken}`;
    //console.log(url)
    return (
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.json())
        // .then(response => console.log(response))
        .then(response => {
          //console.log("FACEBOOK SERVER RESPONSE",response);
            const { email, name } = response;
            User.findOne({ email }).exec((err, user) => {
              if (user) {
                const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
                  expiresIn: '24h'
                });
                const { _id, email, name, role } = user;
                return res.json({
                  token,
                  user: { _id, email, name, role }
                });
              } else {
                let password = email + process.env.SECRET;
                user = new User({ name, email, password });
                user.save((err, data) => {
                  if (err) {
                    console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                    return res.status(400).json({
                      error: 'User signup failed with facebook'
                    });
                  }
                  const token = jwt.sign(
                    { _id: data._id },
                    process.env.SECRET,
                    { expiresIn: '24h' }
                  );
                  const { _id, email, name, role } = data;
                  return res.json({
                    token,
                    user: { _id, email, name, role }
                  });
                });
              }
            });
          

        })
        .catch(error => {
          res.json({
            error: 'Facebook login failed. Try later'
          });
        })
    );
  };