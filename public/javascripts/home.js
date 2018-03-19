$(document).ready(function () {
	$('button').click( function () {
		$.ajax( {
			type: 'POST',
			url: '/logout'
		}).done(function(response) {
			window.location=response.redirect;
		})
	})

	$('.lend').click( function () {
		window.location='/product';
	})

	$('.borrow').click(function () {
		window.location='/borrow';
	})
});