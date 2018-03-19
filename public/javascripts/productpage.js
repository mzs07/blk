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
		url : '/product/prodpage/'+id
	}).done(function(response) {
		if (response.msg == 'edit') {
			window.location = '/product/'+id;
		}
		if(response.msg == 'fail') {
			$('.display').html('<h3 style = "color : grey; font-size : 17px; text-align: center; top: 20px;">\
				You reaching here is a mistake. There is nothing here.</h3>');
		} else if (response.msg == 'borrow') {	

			var prod = response.prod;
			var owner = response.user;

			$('.display').append("\
				<h2>"+prod[0].title+"</h2>\
				<img src='/images/productimg/"+prod[0].image+"'>\
				<h5> Description : </h5>\
				<textarea style='width: 700px' disabled = 'disabled'>"+prod[0].desc+"</textarea>\
				<p>Karma : "+prod[0].karma+" per day.</p></div>\
				<button class='btn btn-success request'>Send Request</button>");


			$('.owner').append("\
				<h3>Owner Details</h3>\
				<p style = 'font-size:14px'>Name : "+owner[0].fname+" "+owner[0].lname+"</p>\
				<p style = 'font-size:14px'>Phone : "+owner[0].phone+"</p>");
				//<button class ='btn btn-primary'>Contact User</button>");


			$('.request').click(function() {
				$('.request').hide();
				$('.display').append("\
					<div class='reqarea'>\
					<p>No of days needed for : </p>\
					<input class='nodays' type='number' val = '0'>");
				
				var newkarma = 0;

				$('.nodays').blur(function(){
					newkarma = $('.nodays').val() * prod[0].karma;
					if(newkarma > owner[0].karma) {
						$('.newkarma').text('Not enough Karma in your account.');
						$('.nodays').val('');
					} else {
						$('.newkarma').text(' Karma : '+newkarma+'');
					}
				});
				
				$('.display').append("\
					<div class='reqarea'>\
					<p class='newkarma'> Karma : "+newkarma+"</p>\
					<button class = 'btn btn-success sendreq'>Confirm Request</button>\
					<button class = 'btn btn-danger cancel'>Cancel</button>");

				$('.sendreq').click(function(){
					
					if ($('.nodays').val() != '' && $('.nodays').val() > 0 ){ 
						var data;
					
						data = {days : $('.nodays').val(),
								cost : $('.nodays').val() * prod[0].karma,
								title : prod[0].title,
								user : prod[0].user}
					
						$.ajax({
							type : 'POST',
							url : '/borrow/addreq/'+id,
							data : data,
							datatype : 'JSON'
						}).done(function(response) {
							//after request configured
							$('.cancel').click();
							$('.request').text('Request Send');
							$('.request').prop('disabled','disabled');
						})
					}
				});

				$('.cancel').click(function(){
					//when cancelled
					$('.reqarea').remove();
					$('.request').show();
				})
			})			
		}
	})

});

