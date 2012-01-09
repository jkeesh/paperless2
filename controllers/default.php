<?php
	class DefaultHandler extends ToroHandler {	
		public function get() {
			$links = array('CS107 Winter 2012' => ROOT_URL. '/1122/cs107/');

			$this->smarty->assign("links", $links);
			$this->smarty->display("default.html");			
		}		
	}
?>