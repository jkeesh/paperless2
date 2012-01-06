<?php
	class RouterHandler extends ToroHandler {	
		public function get($qid, $class) {
			$config = Utilities::get_configuration($qid, $class);
			
			$ta_list = $config->tas;
			//print_r($ta_list);
			
			if(in_array(USERNAME, $ta_list)){
				$ta_url = ROOT_URL . "/" . $qid . "/" . $class . "/ta";
			//	echo $ta_url;
				Header("Location: " . $ta_url);	
			}
			
//			print_r($config);
			$this->smarty->display("router.html");			
		}		
	}
?>