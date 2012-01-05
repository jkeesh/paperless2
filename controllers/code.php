<?php
require_once("utils.php");

class CodeHandler extends ToroHandler {

	private function display_error($error){
		$this->smarty->assign('errorMsg', $error);
		$this->smarty->display('error.html');
	}

	/*
	 * Displays the syntax highlighted code for a student, assignment pair
	 */
	public function get($qid, $class, $assignment, $student, $print=False) {
		
		$this->basic_setup(func_get_args());
		
		// TODO fix dirname here to be universal
		$dirname = "repos/" . $assignment . "/" . $student . "/"; 
		$all_files = Utilities::get_all_files($dirname);
		if(is_null($all_files)){
			return $this->display_error("This was not a valid directory.");
		}
		$code_files = Utilities::get_code_files($dirname, $all_files);
		
		//$this->smarty->assign("assignment", htmlentities($assignment));
		//$this->smarty->assign("showComments", $showComments);
		$this->smarty->assign("code_files", $code_files);
		$this->smarty->display("code.html");
	}


	private function json_failure($error){
		echo json_encode(array("status" => "fail", "why" => $error));
	}

	private function json_success(){
		echo json_encode(array("status" => "ok"));
	}

	private function handle_release($release_action, $dirname){
		if($release_action == "create"){
			Utilities::create_release($dirname);
		}else{
			Utilities::delete_release($dirname);
		}
		$this->json_success();
		return;
	}

	/*
	 * Handles adding and deleting comments.  Note: when a comment is edited it is
	 * first deleted and then re-added to the database.
	 */
	public function post_xhr($qid, $class, $assignment, $student) {
		$this->basic_setup(func_get_args());

		// Only section leaders should be able to add comments
		Permissions::gate(POSITION_SECTION_LEADER, $this->role);		

		// We only modifications for the current quarter.
		$quarter = $this->current_quarter;
		if($this->current_quarter->id != $qid){
			return $this->json_failure("You cannot leave comments for earlier quarters.");
		}		


		$parts = explode("_", $student); // if it was student_1 just take student
		$suid = $parts[0];
		$submission_number = $parts[1];

		$the_student = new Student;
		$the_student->from_sunetid_and_course($suid, $this->course);
		$the_sl = $the_student->get_section_leader();

		$sl = Model::getSectionLeaderForStudent($suid, $class);

		$dirname = $the_sl->get_base_directory() . '/' . $assignment . '/' . $student .'/';

		// Return a failure message if variables are not properly set.
		if(!isset($_POST['action'])) {
			return $this->json_failure("The message to the server was not properly formed.");
		}
		// Handle the release of an assignment if that is what the action calls for.
		if($_POST['action'] == "release"){
			return $this->handle_release($_POST['release'], $dirname);
		}

		$paperless_assignment = PaperlessAssignment::from_course_and_assignment($this->course, $assignment);	
		$curFile = AssignmentFile::load_file($the_student, $paperless_assignment, $_POST['filename'], $submission_number);


		$id = $curFile->getID();
		if(!isset($id)){ 
			return $this->json_failure("We could not load the assignment.");
		}

		$db_id = null;
		if($_POST['action'] == "create") {
			$newComment = AssignmentComment::create($curFile->getID(), $_POST['rangeLower'], 
				$_POST['rangeHigher'], $_POST['text'], $this->user->id, $the_student->id);
			$newComment->save();
			$db_id = $newComment->getID();

		} else if($_POST['action'] == "delete") {
			$comment = AssignmentComment::load($_POST['db_id']);
			$comment->delete();			
		} 

		echo json_encode(array("status" => "ok", "action" => $_POST['action'], 'db_id' => $db_id));
	}
}


?>