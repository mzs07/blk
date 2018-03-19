var check = 0;

$(document).ready(function () {

	// $('button').prop('disabled',true);
	var fieldsfilled =[0,0,0,0,0,0];

	When enter key is pressed
	$(document).on('keyup', function(e){
		var key = e.which;
		if (key == 13) {
			check();
			if(check!=6){e.preventDeafult()}
		}
	})

	$('button').click(function(e) {
		check();
		if(check!=6){e.preventDeafult()}
	})

	//FirstName Field
	$('.fname').blur(function(){
		if($(this).val() != ''){
			fieldsfilled[0] = 1;
		} else {
			fieldsfilled[0] = 0;
		}
		check();
	});

	//LastName Field
	$('.lname').blur(function(){
		if($(this).val() != ''){
			fieldsfilled[1] = 1;
		} else {
			fieldsfilled[1] = 0;
		}
		check();
	});

	//Username Field
	$('.uname').blur(function () {
		fieldsfilled[2] = 0;
		if($(this).val() != '') {
			if($(this).val().length>2) {
				var dat={ 'u' : $(this).val(),
					   'p' : 'e'
					}
				$.ajax({
					type : 'POST',
					data : dat,
					url : '/validate',
					dataType : 'JSON'
				}).done(function(response) {
					if (response.msg == 'uerr') {
						//success
						$('.uname').removeClass('errorbox');
						$('#un').text("The username is available").removeClass("text-danger").css('color','green');
						fieldsfilled[2] = 1;
					} else {
						$('.uname').addClass('errorbox');
						$('#un').text("Username Already Exists").addClass("text-danger");
					}
				})
			} else {
				$('.uname').addClass('errorbox');
				$('#un').text("Too Short").addClass("text-danger");
			}
		} else {
			$('#un').text(" ");
			$('.uname').removeClass('errorbox');
		}
		check();
	});

	//Password Field
	$('.pass').blur(function(){
		if($(this).val().length>8){
			$('#pa').text(" ");
			$('.pass').removeClass('errorbox');
			fieldsfilled[3] = 1;
		} else if ($(this).val() == ''){
			fieldsfilled[3] = 0;
		} else {
			$(this).addClass('errorbox');
			$('#pa').text("Password Too Short. Min 8 chars");
			fieldsfilled[3] = 0;
		}
		check();
	});

	//Phone Field
	$('.phone').blur(function(){
		if($(this).val().length==10){
			$('#ph').text(" ");
			$('.phone').removeClass('errorbox');
			fieldsfilled[5] = 1;
		} else if ($(this).val() == ''){
			fieldsfilled[5] = 0;
		} else {
			$(this).addClass('errorbox');
			$('#ph').text("Enter a valid phone Number");
			fieldsfilled[5] = 0;
		}
		check();
	});

	function check() {

		//Confirm Password Field
		$('.cpass').blur(function(){
			if ($('.cpass').val() === $('.pass').val()) {
				$('#cp').text(" ");
				$('.cpass').removeClass('errorbox');
				fieldsfilled[4] = 1;
			} else {
				$('.cpass').addClass('errorbox');
				$('#cp').text("Passwords do not match");
				fieldsfilled[4] = 0;
			}
		});

		var i;
		for (i =0; i<6 ; i++) {
			check += fieldsfilled[i];
		}
		/*$('#check').text(fieldsfilled + "==" + check);*/
	}
});