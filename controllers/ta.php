<?php

	class TAHandler extends ToroHandler {
			
		public function get($qid, $class) {
			Permissions::TA_GATE($qid, $class, USERNAME);
			
			$config = Utilities::get_configuration($qid, $class);
			
			$class_dir = Utilities::get_class_base($qid, $class);
			$assns = Utilities::get_all_directories($class_dir . "/" . $config->submissions_dir);

			$this->smarty->assign("class", $class);			
			$this->smarty->assign("assns", $assns);
			$this->smarty->display("ta.html");			
		}		
	}
?>