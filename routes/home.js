var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:user', function(req, res, next) {
	if (req.session.login==true) {
		if (req.session.user==req.params.user) {
			res.render('home', { user: req.params.user });			
		} else {
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}
  
});

module.exports = router;
