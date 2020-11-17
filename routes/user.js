const express = require('express');
const router = express.Router();

const {getUserById, getUser, sampleTest} = require('../controllers/user');
const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth');

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

router.get("/user/:userId/sample", isSignedIn, isAuthenticated, sampleTest)


module.exports = router;