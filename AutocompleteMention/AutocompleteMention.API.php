<?php



	class AutocompleteMentionAPI {



		public function __construct() {

		}


		public function getUsersFromProject($p_project_id, $searchstring) {

			$t_users = array();

			$t_current_user_id = auth_get_current_user_id();

			// only send informoation if user has access to project or is administrator
			if(!user_is_administrator( $t_current_user_id ) && !project_includes_user($p_project_id, auth_get_current_user_id())) {
				return $t_users;
			}

			$all_users = project_get_all_user_rows($p_project_id);

			foreach($all_users as $u) {

				if($searchstring == "+" ||
					strpos(strtolower($u["username"]), $searchstring) !== FALSE ||
					strpos(strtolower($u["realname"]), $searchstring) !== FALSE)
				{
					$t_users[$u["realname"]] = $u["username"]." (".$u["realname"].")";
				}

			}

			ksort($t_users);
			$t_users = array_values($t_users);



			return $t_users;

		}


	}