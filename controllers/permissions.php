<?php

class Permissions {	
	public static function TA_GATE($qid, $class, $user){
		$is_ta = Permissions::is_ta_for_class($qid, $class, $user);
		if(!$is_ta){
			$redirect_url = ROOT_URL . "/" . $qid . "/" . $class;
			Header("Location: " . $redirect_url);	
		}
	}

	public static function is_ta_for_class($qid, $class, $user){
		$config = Utilities::get_configuration($qid, $class);
		$ta_list = $config->tas;
		return in_array(USERNAME, $ta_list);
	}
}



?>
