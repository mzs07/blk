$(document).ready(function () {
	

	//button properties to be added 
	$('.logo').click( function () {
		$.ajax( {
			type: 'POST',
			url: '/logout'
		}).done(function(response) {
			window.location=response.redirect;
		})
	})

	$.ajax({
		type : 'POST',
		url : '/product/checkprod'
	}).done(function(response) {
		if(response.msg == 'noprod') {
			$('.display').html('<h3 style = "color : grey; font-size : 17px; text-align: center; top: 20px;">\
				No items to display. Go <a href="/product/add">here</a> to add items.</h3>');
		} else if (response.msg == 'scs') {	
			var prodlist = response.data;

			for(var i=0; i < prodlist.length; i++) {

				$('.display').append("<div class = 'prods div"+i+"'>\
					<ul style='list-style-type:none'> \
					<li> <h3><a style='color: black;' href='/product/"+prodlist[i]._id+"'>"+prodlist[i].title+"</a></h3></li> \
					<li> <a href='/product/"+prodlist[i]._id+"'><img src='/images/productimg/"+prodlist[i].image+"'></a>\
						<button id='prodid"+i+"' class='btn btn-success itembtn'>Delete</button></li> \
					<li> <p>Karma : "+prodlist[i].karma+"</p></li> \
					<p id='prodid"+i+"' hidden='true'>"+prodlist[i]._id+"</p>\
					</ul> \
					</div>");
			}

			$('.itembtn').click( function () {
				var identity = $(this).attr('id');
				var listnumber = 0;

				//get the position of the clicked button
				for (var k = 6; k < identity.length; k++) {
					listnumber *= 10;
					listnumber += identity[k];
				}
				
				listnumber = parseInt(listnumber);

				$.ajax({
					type : 'DELETE',
					data : prodlist[listnumber],
					url : '/product/remprod',
					datatype : 'JSON'
				}).done( function() {
					$('.div'+listnumber).empty().html('<h3 style = "color : red; font-size : 17px; text-align: center; top: 20px;">\
						Product Removed</h3>');
				})

			})

		}
	})

	$('.add').click(function () {
		window.location='/product/add';
	})

	$('.manage').click(function() {
		window.location='/product/manage';
	})

	$('.msgreq').click(function() {
		window.location='/product/requests';
	})
});