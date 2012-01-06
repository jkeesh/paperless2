<?php

	class AssignmentHandler extends ToroHandler {
			
		public function get($qid, $class, $assn) {
			$assn_dir = Utilities::get_assn_base($qid, $class, $assn);
			$students = Utilities::get_all_directories($assn_dir);
			echo $assn_dir;
			echo "<BR>";
			print_r($students);
			
			$this->smarty->assign("students", $students);
			$this->smarty->display("assignment.html");			
		}		
	}
?>