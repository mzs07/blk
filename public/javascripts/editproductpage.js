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

		if (response.msg == 'borrow') {
			window.location = '/borrow/'+id;
		} else if (response.msg == 'fail') {
			$('.display').html('<h3 style = "color : grey; font-size : 17px; text-align: center; top: 20px;">\
				You reaching here is a mistake. There is nothing here.</h3>');
		} else if (response.msg == 'edit') {	

			//unhide edit button when loaded
			$('.edit').prop('hidden',false);

			var prodlist = response.prod;

			$('.display').append("\
				<h2>"+prodlist[0].title+"</h3>\
				<img src='/images/productimg/"+prodlist[0].image+"'>\
				<h5> Description : </h4>\
				<textarea style='width: 700px' disabled = 'disabled'>"+prodlist[0].desc+"</textarea>\
				<p>Karma : "+prodlist[0].karma+"</p></div>");
		}

		$('.edit').click( function() {
		if($('.edit').text() == 'Done') {

			//update inserted data
			var description = $('textarea').val();
			var karma = $('input').val();
			prodlist[0] = updatedata (prodlist[0], description, karma);

			//fill the fields
			$('.display').html("\
				<h2>"+prodlist[0].title+"</h3>\
				<img src='/images/productimg/"+prodlist[0].image+"'>\
				<h5> Description : </h4>\
				<textarea style='width: 700px' disabled = 'disabled'>"+prodlist[0].desc+"</textarea>\
				<p>Karma : "+prodlist[0].karma+"</p></div>");

			$('.edit').text("Edit");
		}else { 
			$('.display').html("\
				<h2>"+prodlist[0].title+"</h2>\
				<img src='/images/productimg/"+prodlist[0].image+"'>\
				<h5> Description : </h5>\
				<textarea style='width: 700px'>"+prodlist[0].desc+"</textarea>\
				<p>Karma : </p>\
				<input type='number' value='"+prodlist[0].karma+"'></div>");	
			$('.edit').text("Done");
		}
		})
	})

});

function updatedata (data, desc, karma) {

	if(data.desc != desc || data.karma != karma) {

		data.desc = desc;
		data.karma = karma;

		$.ajax({
			type : 'POST',
			data : data,
			url : '/product/updatedata',
			datatype : 'JSON'
		}).done(function(response) {
			return data;
		});
	}

	return data;
}