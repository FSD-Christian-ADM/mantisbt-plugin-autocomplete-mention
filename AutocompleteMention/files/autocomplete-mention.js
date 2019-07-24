var rest_endpoint = "api/rest/index.php/plugins/AutocompleteMention/get-users";


jQuery(document).ready(function() {

	// use Dollar-Syntax for jQuery in this function
	var $ = jQuery;

	function split( val ) {
		return val.split( /,\s*/ );
	}

	var listening = false;


	var textarea_dom = null;


	$("textarea").keypress(function(e) {


			textarea_dom = this;

			if (e.keyCode === $.ui.keyCode.TAB &&
				$(this).autocomplete("instance").menu.active) {
				e.preventDefault();
			}


			var character_entered = String.fromCharCode(e.which);

			if (e.which === 32 || e.which === 13 || character_entered == " ") {
				listening = false;
			}

			if (character_entered == "@" || listening) {

				listening = true;

			}


		}
	)
		.autocomplete({
			source: function( request, response ) {

				if(listening) {

					var textarea_content = $(textarea_dom).val(); // + character_entered; // pressed character has to be added because it is not visible when event triggers

					var project_id = $("input[name='project_id']").val();

					var input_string = textarea_content.substr(textarea_content.lastIndexOf("@") + 1);

					var rest_params = project_id + "/" + input_string;

					$.getJSON(rest_endpoint + "/" + rest_params, {
						// term: extractLast( request.term )
					}, response);

				}
		},
			search: function() {



				// custom minLength
				/*
				var term = extractLast( this.value );
				if ( term.length < 2 ) {
					return false;
				}
				*/
			},
			focus: function() {

				// prevent value inserted on focus
				return false;
			},
			select: function( event, ui ) {



				var terms = split( this.value );
				// remove the current input
				terms.pop();
				// add the selected item
				terms.push( ui.item.value );
				// add placeholder to get the comma-and-space at the end
				terms.push( "" );
				this.value = terms.join( ", " );

				return false;
			}
		});






/*
	$("textarea").keypress(function(e) {
		var character_entered = String.fromCharCode(e.which);

		if(e.which === 32 || e.which === 13 || character_entered == " ") {
			listening = false;
		}

		if(character_entered == "@" || listening) {

			listening = true;

			var textarea_content = $(this).val() + character_entered; // pressed character has to be added because it is not visible when event triggers

			var project_id = $("input[name='project_id']").val();

			var input_string = textarea_content.substr(textarea_content.lastIndexOf("@") + 1);

			var rest_params = project_id + "/" + input_string ;

			console.log(rest_endpoint + "/" + rest_params);

			$.get(rest_endpoint)
				.done(function (data) {
					console.log(data);
				})
				.fail(function () {
					console.error('Error occurred while retrieving user list');
				});


		}

	});


	*/


});
