var express = require('express');
var router = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');

var storage = multer.diskStorage({
  destination: 'public/images/productimg/',
  filename: function (req, file, callback) {
    
  	crypto.pseudoRandomBytes(16, function(err, raw) {
  		if (err) return callback(err);

  		callback(null, raw.toString('hex') + path.extname(file.originalname));
	});
  }
});

//initialusing multer
var upload = multer({ storage : storage});

//renderring product page
router.get('/', function(req, res, next) {
	if(req.session.login == true) {
		res.render('product', { title: 'Product Registration' });
	} else {
	  res.redirect('/');
	}
});

//renderring addproduct page
router.get('/add', function(req, res, next) {
	if(req.session.login == true) {
		res.render('addproduct', { title: 'Product Registration' });
	} else {
	  res.redirect('/');
	}
});

//renderring manageproduct page
router.get('/manage', function(req, res, next) {
	if(req.session.login == true) {
		res.render('editproduct', { title: 'Manage Products' });
	} else {
	  res.redirect('/');
	}
});

//rendering requests page
router.get('/requests', function(req, res, next) {
	if(req.session.login == true) {
		res.render('msgreq');
	} else {
	  res.redirect('/');
	}
});

router.get('/:id', function(req, res, next) {
	var db = req.db;
	var prodlist = db.get('prodlist');
	var userinfo = db.get('userinfo');

	if(req.session.login == true) {
		prodlist.find({ _id : req.params.id}, function(err, result) {
			if (result[0] == undefined) {
				res.render('editproductpage', { id: req.params.id });
			} else {
				userinfo.find({ user : result[0].user}, function(err, owner) {
					if (result[0].user==req.session.user) {		
						res.render('editproductpage', { id: req.params.id });
					} else {
						res.redirect('/borrow/'+req.params.id);
					}
				});
			}
		});
	} else {
	  res.redirect('/');
	}
});



//adding products
router.post('/addprod', upload.single('prodimage'), function(req, res) {

	var db = req.db;
	var prodlist = db.get('prodlist');
	//console.log(req.session.user);
	/*
	var split = req.file.path.split('\\');
	req.file.path = split.join('/');
	//console.log(req.file.path);

	var filepath = req.file.path;*/
	
	var tags = req.body.prodtitle.split(" ");

	tags.forEach( function(elem, index, arr) {
		arr[index] = elem.toLowerCase();
	});

	//console.log(req.file);

	prodlist.insert({'title' : req.body.prodtitle, 'user' : req.session.user, 'desc' : req.body.proddesc, 
					 'image' : req.file.filename, 'karma' : req.body.karma, 'tags' : tags}, function(err) {
			err==null ? console.log('added') : console.log(err);
		});

	res.render('success');
});

//checking for products of a user
router.post('/checkprod', function(req, res) {

	var db = req.db;
	var prodlist = db.get('prodlist');
	
	prodlist.find({ user : req.session.user}, function(err, result) {
		if (result[0] == undefined) {
			res.send({msg: 'noprod'});
		} else {
			 res.send({msg : 'scs', data : result});
		}
	});
});

router.post('/prodpage/:id', function(req, res) {

	var db = req.db;
	var prodlist = db.get('prodlist');
	var userinfo = db.get('userinfo');


	prodlist.find({ _id : req.params.id}, function(err, result) {
		//console.log(err);
		if (result[0] == undefined) {
			res.send({msg: 'fail'});
		} else {
			
			userinfo.find({ user : result[0].user}, function(err, owner) {
				if (result[0].user==req.session.user) {
					res.send({msg : 'edit', prod : result, user : owner});
				} else {
					res.send({msg : 'borrow', prod : result, user : owner});
				}
			});
		
		}
	});
/*
	console.log(prod);
	res.send({msg : 'scs', prod : prod, owner : user});*/
	
});

router.post('/updatedata', function (req, res) {

	var db = req.db;
	var prodlist = db.get('prodlist');

	var data = req.body;

	prodlist.update({ _id : data._id}, {$set: {desc : data.desc}});
	prodlist.update({ _id : data._id}, {$set: {karma : data.karma}});

	res.send({msg : 'scs'});
});

router.post('/getrequests', function (req, res) {

	var db = req.db;
	var requests = db.get('requests');

	requests.find({owner : req.session.user}, function (err, result) {
		
		if (result[0] == undefined) {
			res.send({msg: 'fail'});
		} else {
			res.send({msg : 'scs', data : result});
		}
	});
});

router.post('/updaterequest', function (req, res) {

	var db = req.db;
	var requests = db.get('requests');

	var data = req.body;

	requests.update({ _id : data.product}, {$set: {status : data.status}});
	
	res.send({msg:'scs'});
});


router.delete('/remprod', function(req, res) {

	var db = req.db;
	var prodlist = db.get('prodlist');

	var data = req.body;

	console.log(data._id);

	prodlist.remove({ _id : data._id}, function(err) {
		res.send({msg : 'scs'});
	});
});


module.exports = router;
