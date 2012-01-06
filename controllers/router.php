<?php
	class RouterHandler extends ToroHandler {	
		public function get($qid, $class) {
			if(Permissions::is_ta_for_class($qid, $class, USERNAME)){
				$ta_url = ROOT_URL . "/" . $qid . "/" . $class . "/ta";
				Header("Location: " . $ta_url);	
			}else{
				$student_url = ROOT_URL . "/" . $qid . "/" . $class . "/student/" . USERNAME;
				Header("Location: " . $student_url);	
			}
			
			$this->smarty->display("router.html");			
		}		
	}
?>