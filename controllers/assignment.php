<?php

	class AssignmentHandler extends ToroHandler {
			
		public function get($qid, $class, $assn) {
			Permissions::TA_GATE($qid, $class, USERNAME);
			
			$assn_dir = Utilities::get_assn_base($qid, $class, $assn);
			$students = Utilities::get_all_directories($assn_dir);

			$this->smarty->assign("class", $class);
			$this->smarty->assign("assn", $assn);
			$this->smarty->assign("students", $students);
			$this->smarty->display("assignment.html");			
		}		
	}
?>