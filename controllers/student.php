<?php

	class StudentHandler extends ToroHandler {
			
		public function get($qid, $class, $student) {
			if($student != USERNAME){
				Permissions::TA_GATE($qid, $class, USERNAME);
			}
			$config = Utilities::get_configuration($qid, $class);			
			
			$class_dir = Utilities::get_class_base($qid, $class);
			$assns = Utilities::get_all_directories($class_dir . "/" . $config->submissions_dir);
			
			$student_submissions = array();
			foreach($assns as $assn){
				$a_dir = $class_dir . "/". $config->submissions_dir ."/" . $assn;				
				$all_subs = Utilities::get_all_directories($a_dir);

				foreach($all_subs as $sub){
					$sunetid = Utilities::get_sunetid($sub);					
					if($sunetid == $student){
						$test = $a_dir . "/" . $sub;
						if(is_dir($test)){
							$student_submissions []= array("assn" => $assn, "dir" => $sub);
						}
					}
				}
				
			}
			//print_r($student_submissions);
			

			$this->smarty->assign("student", $student);
			$this->smarty->assign("submissions", $student_submissions);
			$this->smarty->display("student.html");			
		}		
	}
?>