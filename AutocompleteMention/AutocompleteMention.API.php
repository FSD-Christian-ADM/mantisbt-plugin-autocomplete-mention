<?php



	class AutocompleteMentionAPI {



		public function __construct() {

		}


		public function getUsersFromProject($p_project_id, $searchstring) {

			$t_query = 'SELECT u.username, u.realname
						FROM {user} u
						LEFT JOIN {project_hierarchy} ph
						ON ph.child_id = p.id
						WHERE project_id = '.db_param().'
						AND (username ILIKE '.db_param().'
								OR
							realname ILIKE '.db_param().')
						ORDER BY p.name';

			$t_result = db_query( $t_query, array($p_project_id) );

			$t_users = array();

			while( $t_row = db_fetch_array( $t_result ) ) {
				$t_users[] = array(	"id" => (int)$t_row['id'],
					"username" => $t_row["username"],
					"realname" => $t_row['realname']
				);
			}


			return $t_users;

		}


	}