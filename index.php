<?php
	/*
	 * Constants
	 */
	require_once('config.php');
	
	/*
	 * Third-party libraries
	 */
	require_once('lib/smarty/Smarty.class.php');
	require_once('lib/toro.php');
	
	
	/*
	 * Each controller extends the following class.
	 */
	class ToroHandler {
		protected $smarty;
		
		/*
		 * This method handles all the basic setup that we want in all of the pages.
		 * This includes, setting up the course, the role, and role string.
		 */
		public function basic_setup(){
			$args = func_get_args();
			$args = $args[0];
		
			// TODO fix this hardcoding
			$this->smarty->assign("role", 2);	
			$this->smarty->assign("role_string", "TA");		
		}
		
		public function __construct() {
			$this->smarty = new Smarty();
			
			$this->smarty->template_dir = BASE_DIR . '/views/templates/';
			$this->smarty->compile_dir  = BASE_DIR . '/views/templates_c/';
			$this->smarty->config_dir   = BASE_DIR . '/views/configs/';
			$this->smarty->cache_dir    = BASE_DIR . '/views/cache/';
			
			$this->smarty->assign("POSITION_TEACHING_ASSISTANT", POSITION_TEACHING_ASSISTANT);
			$this->smarty->assign("POSITION_STUDENT", POSITION_STUDENT);
		}
		
		function isValidDirectory($entry){
			///Note: this matches for assignment directories which start with lowercase
			///and also for student submission directories of the form sunetid_# .... however
			///it seems like a sunetid can have a '-' or '.' but I have never seen one. And I think dashes
			///mess up the url.... 
			return (preg_match("/^([a-z])([a-zA-z\d_]+)(_\d+)?$/", $entry) > 0) ? true : false;
		}
		
		/*
		 * Gets information from the directories found in a path.
		 */
		protected function getDirEntries($dirname) {
			$entries = array();
			if(!is_dir($dirname)) return false;
			$dir = opendir($dirname);
			while($entry = readdir($dir)) {
				if($this->isValidDirectory($entry))
					$entries[] = $entry;
			}
			return $entries;
		}
		
	}
	
	/*
	 * Controllers
	 */
	require_once('controllers/student.php');    // lists the students for a given assignment
	require_once('controllers/code.php');       // shows the code view
	require_once('controllers/assignment.php'); // lists the assignments for a given student
	require_once('controllers/ta.php'); 		// lists the assignments for a ta
	require_once('controllers/router.php'); 	// determine which url to go to


	// This regex represents the url for a course. It contains first
	// the quarter id as an integer, and then the class name
	$course_regex = '^\/([0-9]+)\/([a-zA-Z0-9_ \-]+)\/';
	$sunet_regex = '([a-zA-Z0-9_ -]+)';
	$assn_regex = '([a-zA-Z0-9_ -]+)';
		
	/*
	 * URL routes
	*/
	$site = new ToroApplication(Array(
									  Array($course_regex. 'student\/'.$sunet_regex.'\/?$', 'regex', 'StudentHandler'),
									  Array($course_regex. 'code\/'.$assn_regex.'\/'.$sunet_regex.'(\/print)?$', 'regex', 'CodeHandler'),
									  Array($course_regex. 'assignment\/'.$assn_regex.'\/?$', 'regex', 'AssignmentHandler'),
									  Array($course_regex. 'ta\/'.$sunet_regex.'\/?$', 'regex', 'TAHandler'),
									  Array('(.*)', 'regex', 'RouterHandler')
									  ));
	
	if(isset($_REQUEST['path']))
	$_SERVER['PATH_INFO'] = $_REQUEST['path'];
	
	
	$site->serve();
