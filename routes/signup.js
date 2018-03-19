var express = require('express');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});

router.post('/addaccount', function(req, res, next){
	var db = req.db;
	var userlist = db.get('userlist');
	var userinfo = db.get('userinfo');

	//hashing the password for storage
	req.body.pass = hashpassword(req.body.pass);
	
	userlist.insert({'user' : req.body.uname, 'pwd' : req.body.pass}, function(err) {
		err==null ? console.log('added') : console.log(err);
	});
	userinfo.insert({'user' : req.body.uname, 'fname' : req.body.fname, 'lname' : req.body.lname, 'phone' : req.body.phone, 'karma' : 500}, function(err) {
		err==null ? console.log('added') : console.log(err);
	});
	req.session.user=req.body.uname;
	req.session.login=true;
	res.redirect("/home/"+req.body.uname);
});

function hashpassword(pass) {
	var salt = crypto.randomBytes(128).toString('base64');
	var iterations = 10000;
	var hashpass = { 
		'salt' : salt,
		'iterations' : iterations,
		'hash' : 0
		};
	//Sunchronous hashing
	hashpass.hash = crypto.pbkdf2Sync(pass, salt, iterations, 512, 'sha512');
	return hashpass;
}

module.exports = router;