<?php

class CodeHandler extends ToroHandler {

	private function display_error($error){
		$this->smarty->assign('errorMsg', $error);
		$this->smarty->display('error.html');
	}

	/*
	 * Displays the syntax highlighted code for a student, assignment pair
	 *
	 *
	 * Test URL: http://localhost:8888/paperless2/1122/cs107/code/assign1/econner
	 */
	public function get($qid, $class, $assignment, $student, $print=False) {
		if($student != USERNAME){
			Permissions::TA_GATE($qid, $class, USERNAME);
		}
		$dirname = Utilities::get_student_dir($qid, $class, $assignment, $student);
		
		// /cs107.1122/repos/assign2/jdoe/comments.json
		$comments = Utilities::get_comments($dirname);
		print_r($comments);
		
		$config = Utilities::get_configuration($qid, $class);
		
		// probably change this decomp
		$all_files = Utilities::get_all_files($dirname);
		$code_files = Utilities::get_code_files($dirname, $all_files, $config);
		$this->smarty->assign("comments", $comments);
		$this->smarty->assign("code_files", $code_files);
		$this->smarty->display("code.html");
	}


	/*
	 * Handles adding and deleting comments.
	 */
	public function post_xhr($qid, $class, $assignment, $student) {
		
	}
}


?>