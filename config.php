<?php

	//This is a configuration file for running paperless locally and on web	
	if(array_key_exists('SERVER_NAME', $_ENV) && strpos($_ENV['SERVER_NAME'], "stanford.edu") !== false ){
		define('LOCAL', false);
	}else{
		define('LOCAL', true);
	}

	define('BASE_DIR', dirname(__FILE__));
	define('POSITION_NOT_A_MEMBER', -1);
	define('POSITION_STUDENT', 1);
	define('POSITION_TEACHING_ASSISTANT', 2);

	if(LOCAL){
		//This is the only thing you should change	
		define('USERNAME', 'jkeeshin');
		
		define('SUBMISSION_BASE', 'submission_base');
		define('ROOT_URL', 'http://localhost:8888/paperless2');		
	}else{
		//This is the only thing you should change
		$sunetid = $_ENV['WEBAUTH_USER'];
        $username = strtolower($sunetid);
		define('USERNAME', $username);
		
		define('SUBMISSION_BASE', '/afs/ir/class/archive/cs');	
//		define('ROOT_URL', 'https://www.stanford.edu/class/cs198/cgi-bin/paperless2');
		define('ROOT_URL', 'https://www.stanford.edu/group/paperless2/cgi-bin');
	}

?>