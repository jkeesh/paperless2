<?php
	//This is a configuration file for running paperless locally

	//This is the only thing you should change	
	define('USERNAME', 'jdoe');
	
	define('BASE_DIR', dirname(__FILE__));
	
	define('POSITION_NOT_A_MEMBER', -1);
	define('POSITION_STUDENT', 1);
	define('POSITION_TEACHING_ASSISTANT', 2);
	
	define('SUBMISSION_BASE', 'submission_base');
//	define('SUBMISSION_BASE', '/afs/ir/class/archive/cs');	

	define('ROOT_URL', 'http://localhost:8888/paperless2');

?>