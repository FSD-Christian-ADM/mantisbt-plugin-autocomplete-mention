<?php


	class AutocompleteMention extends MantisPlugin {
		const VERSION = '0.1';

		public function register() {
			$this->name = "Autocomplete Mention";
			$this->description = "show selection of users when '@' is typed in a text input";
			$this->page = "config_page";

			$this->version = self::VERSION;

			$this->requires = array(
				"MantisCore" => "2.3.0",
				// TODO jquery
			);

			$this->author = "FSD-Christian";
			$this->contact = "13xisw13yl2@fsd-web.de";
			$this->url = "";
		}

		public function config() {
			return array(

			);
		}

		public function errors() {
			return array(

			);
		}

		public function hooks() {
			return array(

				"EVENT_LAYOUT_RESOURCES" => "resources",

				'EVENT_REST_API_ROUTES' => 'routes',
			);
		}

		public function init() {
			require_once("AutocompleteMention.API.php");
		}


		public function resources($event) {
			return '
			<script src="' . plugin_file("autocomplete-mention.js") . '"></script>
			<link rel="stylesheet" type="text/css" href="' . plugin_file("autocomplete-mention.css") . '"/>
			';
		}

		/**
		 * Add the RESTful routes handled by this plugin.
		 *
		 * @param string $p_event_name The event name
		 * @param array  $p_event_args The event arguments
		 * @return void
		 */
		public function routes( $p_event_name, $p_event_args ) {
			$t_app = $p_event_args['app'];
			$t_plugin = $this;
			$t_app->group(
				plugin_route_group(),
				function() use ( $t_app, $t_plugin ) {
					$t_app->get( '/get-users/{project_id}/{searchstring}', [$t_plugin, 'get_users'] );
				}
			);
		}



		/**
		 * RESTful route for Snippets Pattern Help (tooltip).
		 *
		 * Returned JSON structure
		 *   - {string} title
		 *   - {string} text
		 *
		 * @param Slim\Http\Request $request
		 * @param Slim\Http\Response $response
		 * @param array $args
		 * @return Slim\Http\Response
		 */
		public function get_users($request, $response, $args) {
			plugin_push_current( $this->basename );

			# Set the reference Bug Id for placeholders replacements
			if( isset( $args['project_id'] ) ) {
				$t_project_id = (int)$args['project_id'];
			} else {
				// TODO error
				$t_project_id = 0;
			}

			if( isset( $args['searchstring'] ) ) {
				$t_searchstring = $args['searchstring'];
			} else {
				// TODO error
				$t_searchstring = "";
			}


			$API = new AutocompleteMentionAPI();

			$users = $API->getUsersFromProject($t_project_id, $t_searchstring);


			plugin_pop_current();

			return $response
				->withStatus( HTTP_STATUS_SUCCESS )
				->withJson( $users );
		}


	}
