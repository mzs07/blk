$(document).ready(function () {
	
	
	var query = $('h2').text();
	$('.sbar').val(query);

	query = query.split(' ');
	var display = [], k;

	var data, prodlist = [], i=0;

	for (var index = 0; index < query.length; index++){
		
		data = {elem : query[index]}

		$.ajax({
			type : 'POST',
			url : '/borrow/search',
			data : data,
			datatype : 'JSON'
		}).done(function(response) {
			if(response.data[0] == undefined) {

				if($('.result').html() == '') {
					$('.result').html('<h3 style = "color : grey; font-size : 17px; text-align: center; top: 70px;">\
					No results to show</h3>');
				}
				
			} else {

				prodlist[i] = response.data;

				for(var yindex = 0; yindex < prodlist[i].length; yindex++){	

					var flag = true;

					k=0;
					while (k < display.length) {

						if(prodlist[i][yindex]._id == display[k]) {
							flag = false;
						}
						k++;
					}	

					if (flag == true ) {
						display[k] = prodlist[i][yindex]._id;

						$.ajax({
							type : 'POST',
							url : '/product/prodpage/'+display[k]
						}).done(function(response) {
							var prod = response.prod[0];

							$('.result').append("<div class = 'prods'>\
								<ul style='list-style-type:none'> \
								<li> <h3><a style='color: black;' href='/borrow/"+prod._id+"'>"+prod.title+"</a></h3></li> \
								<li> <a href='/borrow/"+prod._id+"'><img src='/images/productimg/"+prod.image+"'></a></li> \
								<li> <p>Karma : "+prod.karma+"</p></li> \
								</ul> \
								</div>");
						})
					}
				}

				i++;
			}
		})
	}
});