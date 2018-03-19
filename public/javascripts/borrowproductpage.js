$(document).ready(function () {

	$('.logo').click( function () {
		$.ajax( {
			type: 'POST',
			url: '/logout'
		}).done(function(response) {
			window.location=response.redirect;
		})
	})

	var id = $('.idval').text();

	$.ajax({
		type : 'POST',
		url : '/borrow/prodpage/'+id
	}).done(function(response) {
		if(response.msg == 'fail') {
			$('.display').html('<h3 style = "color : grey; font-size : 17px; text-align: center; top: 20px;">\
				You reaching here is a mistake. There is nothing here.</h3>');
		} else if (response.msg == 'scs') {	

			//unhide edit button when loaded
			$('.edit').prop('hidden',false);

			var prod = response.prod;
			var owner = response.user;

			$('.display').append("\
				<h2>"+prod[0].title+"</h2>\
				<img src='/images/productimg/"+prod[0].image+"'>\
				<h5> Description : </h4>\
				<div id='desc'> <pre>"+prod[0].desc+"</pre>\
				<p>Karma : "+prod[0].karma+"</p></div>\
				<button class='btn btn-success'>Send Request</button>");


			$('.owner').append("\
				<h3>Owner Details</h3>\
				<p style = 'font-size:14px'>Name : "+prodlist.owner[0].fname+" "+prodlist.owner[0].lname+"</p>\
				<p style = 'font-size:14px'>Phone : "+prodlist.owner[0].phone+"</h4>\
				<button class ='btn btn-primary'>Contact User</button>");			
		}
/*
		$('.edit').click( function() {
		
		})*/
	})

});

