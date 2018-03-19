var err1 = "The Fields must be filled";
var err2 = "Invalid User Name";
var err3 = "The User Name and Password does not match";
var p = "Success";

//Maintaining the Login
$(document).ready(function(){
	$('#logbtn').click(function() {
		$('.login').css("visibility","visible");
		$('#uid').focus();
		//Disable Login button
		$(this).prop("disabled",true);
	});

	$('.login').on('keyup', function(e) {
		var key = (event.keyCode ? event.keyCode : event.which);
		if(key == '13'){
			enter();
		}

	});

	function check () {
		
		var udata = {
			'u' : $("#uid").val(),
			'p' : $("#pwd").val()
		}

		$.ajax( {
			type : 'POST',
			data : udata,
			url : '/validate',
			dataType : 'JSON'
		}).done(function (response){

			//If succesfully validated
			if(response.msg ==='uerr') {
				$('.errm').text(err2);
			} else if (response.msg==='perr') {
				$('.errm').text(err3);
			} else if (response.msg==='scs') {
				// $('.errm').text(p);
				window.location = response.redirect;
			} else {
				console.log(response.msg);
			}
		})
	}

	function enter () {

		if(($('#uid').val()=='') || ($('#pwd').val()=='')){
				$('.errm').text(err1);
			} else {
					check();
			}
	}
});