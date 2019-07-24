<?php



	class AutocompleteMentionAPI {



		public function __construct() {

		}


		public function getUsersFromProject($p_project_id, $searchstring) {

			$t_users = array();

			$all_users = project_get_all_user_rows($p_project_id);

			foreach($all_users as $u) {

				if(strpos(strtolower($u["username"]), $searchstring) !== FALSE ||
					strpos(strtolower($u["realname"]), $searchstring) !== FALSE)
				{
					/*$t_users[] = array(	"username" => $u["username"],
										"realname" => $u["realname"]);
					*/
					$t_users[] = $u["username"] . " " . $u["realname"];
				}

			}

			// TODO sort by realname



			return $t_users;

		}


	}