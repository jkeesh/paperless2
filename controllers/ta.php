<?php

	class TAHandler extends ToroHandler {
			
		public function get($qid, $class) {
			Permissions::TA_GATE($qid, $class, USERNAME);
			
			$class_dir = Utilities::get_class_base($qid, $class);
			$assns = Utilities::get_all_directories($class_dir . "/repos");
			
			$this->smarty->assign("assns", $assns);
			$this->smarty->display("ta.html");			
		}		
	}
?>