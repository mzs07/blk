var express = require('express');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.login == true) {
		var user = req.session.user;
		res.redirect('/home/'+user);
	} else {
	  res.render('index', { title: 'Welcome To BLK' });
	}
});

router.get('/imgu', function(req, res, next) {
	
	res.render('imgu', { title: 'upload' });			
	
  
});

router.post('/validate', function(req, res, next) {
  
	var db = req.db;
	var collection = db.get('userlist');
	var user = req.body.u;
	var pass = req.body.p;

	collection.find({'user':user}, function(err,result) {
		if(result[0]==undefined){
			res.send({msg:'uerr'});
		} else if(user==result[0].user){
			/*res.send(
				( pass==result[0].pwd) ? {msg:'scs', redirect : '/home/'+user} : {msg:'perr'} 
			);*/
			
			if(checkpassword(pass, result[0].pwd) == true) {
				req.session.user=user;
				req.session.login=true;
				res.send({msg : 'scs', redirect :'/home/'+user});
			} else {
				res.send({msg : 'perr'});
			}
		}
	});

});

router.post('/logout', function (req,res,next) {
	req.session.login=false;
	res.send({redirect : '/'});
});

function checkpassword(pass, orgpass) {

	//Synchronous hashing
	var hashpass = crypto.pbkdf2Sync(pass, orgpass.salt, orgpass.iterations, 512, 'sha512');

	//console.log(hashpass + "##\n##" + orgpass.hash);

	if(hashpass.toString() === orgpass.hash.toString()) {
		return true;
	} else {
		console.log("false");
		return false;
	}
}

/*function checkuser (user) {
	var db = req.db;
	var collection = db.get('userlist');
	var user = req.body.u;
	//console.log("in");
	collection.find({'user':user}, function(err,result) {
		if(result[0]==undefined){
			return false;
		} else if(user==result[0].user){
			if(result[0].logged==true) {
				return true;
			} else {
				return false;
			}
		}
	});
}*/

module.exports = router;
