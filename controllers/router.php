<?php
	class RouterHandler extends ToroHandler {	
		public function get($qid, $class) {
			Utilities::get_configuration($qid, $class);
			
			
			$this->smarty->display("router.html");			
		}		
	}
?>