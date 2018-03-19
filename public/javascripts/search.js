$(document).ready(function () {

	//when search button is initialised
	$('.submit').click(function () {
		
		if ($('.sbar').val()!='') {

			var data = {query : $('.sbar').val()}

			$.ajax({
				type : 'POST',
				url : '/borrow/redirect',
				data : data,
				datatype : 'JSON'
			}).done(function(response){
				window.location = response.redirect;
			})
		}
	})

	$('.sbar').on('keyup', function(e) {
		var key = (event.keyCode ? event.keyCode : event.which);
		if(key == '13'){
			$('.submit').click();
		}

	});

	//Borrow request administration
	$('.mq').click(function () {


		$('.mq').hide();

		$.ajax({
			type : 'POST',
			url : '/borrow/getrequests'
		}).done(function(result) {
			
			var data = result.data;

			if (data[0] == undefined ) {
				alert(data[0]);
				$('.msgrequest').append("<h2> Nothing To See Here</h2>");
			} else {
				
				for (var i = data.length - 1; i >= 0; i--) {

					if (data[i].status == 'confirm') {
						$('.msgrequest').append("\
						<div class = 'req req"+i+"'>\
						<a href='/borrow/"+data[i].product+"'>"+data[i].title+"</a>\
						<p>Days : "+data[i].days+"</p>\
						<p>Cost : "+data[i].cost+"</p>\
						<button id = 's"+i+"' class = 'btn btn-success btn-sm accept"+i+"'>Accept</button>\
						<button id = 's"+i+"' class = 'btn btn-danger btn-sm reject"+i+"'>Reject</button>\
						</div> ");

						$('.accept'+i).click(function () {
						
							var str = $(this).attr('id');
							var id = 0;

							for(var j = 1; j < str.length; j++) {
								id *= 10;
								id += str[j];
							}

							id = parseInt(id);

							//when accepted
							var info;

							info = {product : data[id]._id,
									cost : data[id].cost,
									owner : data[id].owner,
									status : 'agreed'};

							$.ajax({
								type : 'POST',
								url : '/borrow/acceptrequest',
								data : info,
								datatype : 'JSON'
							}).done(function (response) {

								if (response.msg == 'fail') {
									$('.accept'+id+',.reject'+id).remove();
									$('.req'+id).append("<p>Not Enough Karma Points</p>");
								} else {
									$('.accept'+id+',.reject'+id).remove();
									$('.req'+id).append("<p>Accepted</p>");
								}
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

					} else if (data[i].status == 'rejected') {
						
						var reqdata;
						reqdata = {product : data[i]._id}

						$('.msgrequest').append("\
								<div class = 'req req"+i+"'>\
								<a href='/borrow/"+data[i].product+"'>"+data[i].title+"</a>\
								<p>Days : "+data[i].days+"</p>\
								<p>Cost : "+data[i].cost+"</p>\
								<p style = 'color : red'>"+data[i].status+"</p>\
								</div> ");

						$.ajax({
							type : 'DELETE',
							url : '/borrow/deleterequest',
							data : reqdata,
							datatype : 'JSON'
						}).done(function(response) {
							
						})
					} else {
						$('.msgrequest').append("\
							<div class = 'req req"+i+"'>\
							<a href='/borrow/"+data[i].product+"'>"+data[i].title+"</a>\
							<p>Days : "+data[i].days+"</p>\
							<p>Cost : "+data[i].cost+"</p>\
							<p style = 'color : red'>"+data[i].status+"</p>\
							</div> ");
					}
				}
			}
		})
	})

});