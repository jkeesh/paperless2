<?php
	class DefaultHandler extends ToroHandler {	
		public function get() {
			$links = array('CS107 Spring 2012' => ROOT_URL. '/1126/cs107/',
						   'CME213 Spring 2012' => ROOT_URL. '/1126/cme213/',
						   'CS149 Winter 2012' => ROOT_URL. '/1124/cs149/',
						   'CS107 Winter 2012' => ROOT_URL. '/1124/cs107/',
						   'CS107 Fall 2011' => ROOT_URL. '/1122/cs107/' );

			$this->smarty->assign("links", $links);
			$this->smarty->display("default.html");			
		}		
	}
?>