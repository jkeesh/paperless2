<?php

	class StudentHandler extends ToroHandler {
			
		public function get($qid, $class, $student) {
			if($student != USERNAME){
				Permissions::TA_GATE($qid, $class, USERNAME);
			}
			
			$class_dir = Utilities::get_class_base($qid, $class);
			$assns = Utilities::get_all_directories($class_dir . "/repos");
			
			$student_submissions = array();
			foreach($assns as $assn){
				$test = $class_dir . "/repos/" . $assn . "/" . $student;
				if(is_dir($test)){
					$student_submissions []= $assn;
				}
			}
			

			$this->smarty->assign("student", $student);
			$this->smarty->assign("submissions", $student_submissions);
			$this->smarty->display("student.html");			
		}		
	}
?>