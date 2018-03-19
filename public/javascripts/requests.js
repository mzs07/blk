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
		url : '/product/getrequests'
	}).done(function(response) {
		if(response.msg == 'fail') {
			$('.display').html('<h3 style = "color : grey; font-size : 17px; text-align: center; top: 20px;">\
				Nothing to see here.</h3>');
		} else if (response.msg == 'scs') {	
			
			var data = response.data;

			for(var i=data.length-1; i >= 0; i--) {

				if (data[i].status == 'pending') {
					$('.display').append("\
					<div class = 'req req"+i+"'>\
					<a href='/product/"+data[i].product+"'>"+data[i].title+"</a>\
					<p>Requested by "+data[i].requester+"\
					<p>Days : "+data[i].days+"</p>\
					<p>Cost : "+data[i].cost+"</p>\
					<button id = 's"+i+"' class = 'btn btn-success btn-sm accept"+i+"'>Accept</button>\
					<button id = 's"+i+"' class = 'btn btn-danger btn-sm reject"+i+"'>Reject</button>\
					</div> ");

					$('.accept'+i).click(function () {

						var string = $(this).attr('id');
						var id = 0;

						for(var j = 1; j < string.length; j++) {
							id *= 10;
							id += string[j];
						}

						id = parseInt(id);

						//when accepted
						var info;

						info = {product : data[id]._id,
								status : 'confirm'};

						$.ajax({
							type : 'POST',
							url : '/product/updaterequest',
							data : info,
							datatype : 'JSON'
						}).done(function (response) {
							$('.accept'+id+',.reject'+id).remove();
							$('.req'+id).append("<p>Accepted</p>")
						})
					});

					$('.reject'+i).click(function () {
						
						var string = $(this).attr('id');
						var id = 0;

						for(var j = 1; j < string.length; j++) {
							id *= 10;
							id += string[j];
						}

						id = parseInt(id);
						
						//when rejected
						var info;

						info = {product : data[id]._id,
								status : 'rejected'};

						$.ajax({
							type : 'POST',
							url : '/product/updaterequest',
							data : info,
							datatype : 'JSON'
						}).done(function (response) {
							$('.accept'+id+',.reject'+id).remove();
							$('.req'+id).append("<p>Rejected</p>")
						})
					});
				} else {
					$('.display').append("\
					<div class = 'req req"+i+"'>\
					<a href='/product/"+data[i].product+"'>"+data[i].title+"</a>\
					<p>Requested by "+data[i].requester+"\
					<p>Days : "+data[i].days+"</p>\
					<p>Cost : "+data[i].cost+"</p>\
					<p style = 'color : red'>Status : "+data[i].status+"</p>\
					</div> ");			
				}	
			}
			
		}
	})
});