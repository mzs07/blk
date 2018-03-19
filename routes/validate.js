var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/ss', function(req, res, next) {
  
	var db = req.db;
	var collection = db.get('userdata');
	var user = req.body.u;
	var pass = req.body.p;
	var doc = collection.find({'user':user}, function(err,result) {
		//console.log(result.pwd);
		if(result[0]==undefined){
			res.send({msg:'uerr'});
		} else if(user==result[0].user){
			res.send(
				( pass==result[0].pwd) ? {msg:'scs'} : {msg:'perr'} 
			);
		}
	});

});

module.exports = router;
