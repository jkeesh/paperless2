<?php
	class RouterHandler extends ToroHandler {	
		public function get() {
			$this->smarty->display("router.html");			
		}		
	}
?>