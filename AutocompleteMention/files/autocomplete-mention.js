var rest_endpoint = "api/rest/index.php/plugins/AutocompleteMention/get-users";


jQuery(document).ready(function() {

	// use Dollar-Syntax for jQuery in this function
	var $ = jQuery;

	// parameters used in autocomplete functions
	var listening = false;
	var textarea_dom = null;
	var input_element = "textarea";
	var input_identifier = "@";

	$("textarea, #bug_monitor_list_username").keypress(function(e) {

		textarea_dom = this;

		if (e.keyCode === $.ui.keyCode.TAB &&
			$(this).autocomplete("instance").menu.active) {
			e.preventDefault();
		}

		if($(this).attr("id") == "bug_monitor_list_username") {
			input_element = "bug_monitor_list_username";
			input_identifier = ",";
		}

		var character_entered = String.fromCharCode(e.which);

		if (e.which === 32 || e.which === 13 || character_entered == " ") {
			listening = false;
		} else if (character_entered == "@" || input_element == "bug_monitor_list_username") {

			// get xy-position of typed "@" (create an invisible div and copy the input's text there, add a span and get position of this span inside of the div)
			// Note: that is not 100% accurate in scrolling textareas!
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

			$(phantom).append($(this).val().replace(/\n/g, '<br/>').substring(0, carret_position));
			$(phantom).append("<span></span>");
			$(phantom).append($(this).val().replace(/\n/g, '<br/>').substring(carret_position));

			var dropdown_position = $(phantom).find("span").position();
			$(phantom).remove();

			var pos_top = dropdown_position.top + 25; // add some padding
			var pos_left = dropdown_position.left + 16;

			// when content of textarea is higher than the input area (aka scrollbars) just set the left position
			if(pos_top > $(this).height()) {
				pos_top = $(this).height();
			}

			// the autocomplete widget at calculated position
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

				// get entered text for search

				var textarea_content = $(textarea_dom).val();

				var carret_position = $(textarea_dom).prop("selectionStart");

				var project_id = $("input[name='project_id']").val();

				// TODO read bug id when no project_id is found (happens when editing bug)
				// todo read bug id when not in edit mode


				var input_string = textarea_content.substring(textarea_content.lastIndexOf(input_identifier, carret_position) + 1, carret_position);

				var rest_params = project_id + "/" + input_string;

				// get list pf users via REST-request
				$.getJSON(rest_endpoint + "/" + rest_params, {

				}, response);

				}
		},


		focus: function( event, ui ) {

			return false;
		},

		select: function( event, ui ) {

			// add selected option to input and replace the typed string.

			var textarea_content = $(textarea_dom).val();

			var carret_position = $(textarea_dom).prop("selectionStart");
			var identifier_position = textarea_content.lastIndexOf(input_identifier, carret_position);

			var display_value = textarea_content.substr(0, identifier_position + 1 ) + ui.item.value + textarea_content.substring(carret_position);

			// provide multiple user name mentions for the bug_monitor_list_username
			if(input_element == "bug_monitor_list_username") {
				display_value = display_value.split(" ")[0] + ",";
			}

			$(this).val(display_value);

			// place carret after the inserted text
			this.setSelectionRange(identifier_position + ui.item.value.length + 1, identifier_position + ui.item.value.length + 1);

			listening = false;

			return false;
		}

	});

});
