
jQuery(document).ready(function() {

	// use Dollar-Syntax for jQuery in this function
	var $ = jQuery;


	$("textarea").keypress(function(e) {
		console.log(String.fromCharCode(e.which));
	});


});
