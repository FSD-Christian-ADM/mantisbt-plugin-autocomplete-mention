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

		if (character_entered == "@") {

			// get xy-position of typed "@" and position autocomplete
			var phantom = $("<div></div>");
			$(phantom)
				.css("position","absolute")
				.css("height","100%")
				.css("width","100%")
				.css("display","inline-block")
				.css("font-size", $(this).css("font-size"))
				.css("font-family", $(this).css("font-family"))
				.css("visibility","hidden");

			var carret_position = $(this).prop("selectionStart");

			$(phantom).append($(this).val().replace(/\n/g, '<br/>').substring(0,carret_position));
			$(phantom).append("<span></span>");
			$(phantom).append($(this).val().replace(/\n/g, '<br/>').substring(carret_position));

			$(phantom).appendTo($(this).parent());
			var dropdown_position = $(phantom).find("span").position();
			$(phantom).remove();

			var pos_top = dropdown_position.top + 25; // add some padding
			var pos_left = dropdown_position.left + 16;

			// when content of textarea is higher than the input area (aka scrollbars) just set the left position
			if(pos_top > $(this).height()) {
				pos_top = $(this).height();
			}

			$(this).autocomplete( "option", "position", {
				my: "left top",
				at: "left+" + pos_left + " top+" + pos_top
			});

			// keep listening to following key strokes
			listening = true;

		}


	})
	.autocomplete({
		source: function( request, response ) {

			if(listening) {

				var textarea_content = $(textarea_dom).val(); // pressed character has to be added because it is not visible when event triggers

				var carret_position = $(textarea_dom).prop("selectionStart");

				var project_id = $("input[name='project_id']").val();

				var input_string = textarea_content.substring(textarea_content.lastIndexOf("@", carret_position) + 1, carret_position);

				var rest_params = project_id + "/" + input_string;

				$.getJSON(rest_endpoint + "/" + rest_params, {

				}, response);

				}
		},


		focus: function( event, ui ) {

			return false;
		},

		select: function( event, ui ) {

			var textarea_content = $(textarea_dom).val();

			var carret_position = $(textarea_dom).prop("selectionStart");
			var identifier_position = textarea_content.lastIndexOf("@", carret_position);

			$(this).val( textarea_content.substr(0, identifier_position + 1 ) + ui.item.value + textarea_content.substring(carret_position));

			listening = false;

			return false;
		}

	});

});
