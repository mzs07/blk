var express = require('express');
var router = express.Router();

//Render the borrow page
router.get('/', function(req, res, next) {
	if(req.session.login == true) {
 		res.render('search');
	} else {
		res.redirect('/');
	}
});

router.get('/result', function(req, res, next) {

	if(req.session.login == true && req.session.query != undefined) {
		res.render('searchresult', { query: req.session.query });
	} else {
		res.redirect('/borrow/');
	}

});

router.get('/:id', function(req, res, next) {

	var db = req.db;
	var prodlist = db.get('prodlist');
	var userinfo = db.get('userinfo');

	if(req.session.login == true) {
		prodlist.find({ _id : req.params.id}, function(err, result) {
			if (result[0] == undefined) {
				res.render('productpage', { id: req.params.id });
			} else {
				userinfo.find({ user : result[0].user}, function(err, owner) {
					if (result[0].user==req.session.user) {		
						res.redirect('/product/'+req.params.id);
					} else {
						res.render('productpage', { id: req.params.id });
					}
				});
			}
		});
	} else {
	  res.redirect('/');
	}
});



/*router.get('/msgreq', function(req, res, next) {

	if(req.session.login == true) {
		res.render('msgreq');
	} else {
		res.redirect('/');
	}	
});
*/

router.post('/addreq/:id', function (req,res) {

	var db = req.db;
	var requests = db.get('requests');

	var data = req.body;

	requests.insert( { 'product' : req.params.id, 'owner' : data.user, title : data.title,
						'requester' : req.session.user, 'days' : data.days, 'cost' : data.cost, 'status' : 'pending' } );

	res.send({msg : 'scs'});
});

router.post('/getrequests', function (req,res) {

	var db = req.db;
	var requests = db.get('requests');

	requests.find({requester : req.session.user}, function (err, result) {
		res.send({data : result});
	});
});

router.post('/acceptrequest', function (req, res) {

	var db = req.db;
	var userinfo = db.get('userinfo');
	var requests = db.get('requests');

	var data = req.body;

	userinfo.find({user : req.session.user}, function (err, result) {
		if( result[0].karma < data.cost) {
			res.send({msg : 'fail'});
		} else {
			requests.update({ _id : data.product}, {$set: {status : data.status}});
			var newkarma = parseInt(result[0].karma) - parseInt(data.cost);
			newkarma = parseInt(newkarma);
			userinfo.update({ user : req.session.user}, {$set: {karma : newkarma}});
			userinfo.find({user : data.owner}, function (err, info) {
				var ownerkarma = parseInt(info[0].karma) + parseInt(data.cost);
				ownerkarma = parseInt(ownerkarma);
				userinfo.update({ user : data.owner}, {$set: {karma : ownerkarma}});
			});
		}
	});
	
	res.send({msg:'scs'});
});

router.delete('/deleterequest', function (req, res) {

	var db = req.db;
	var requests = db.get('requests');

	var data = req.body;

	requests.remove({_id : data.product});

	res.send({msg:'scs'});
});


//Search Based Routes

router.post('/redirect', function(req, res) {

	req.session.query = req.body.query;

	res.send({redirect : '/borrow/result'});
});

router.post('/search',function(req, res) {

	var db = req.db;
	var prodlist = db.get('prodlist');

	var data = req.body;

	prodlist.find({ tags : data.elem}, function (err, result) {
		res.send({data : result});
	})

});

module.exports = router;
