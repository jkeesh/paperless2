<?php
class Utilities {	
	
	/*
	 * Get the class base dir, which is: 
	 * SUBMISSION_BASE/cs107/cs107.1122
	 */
	public static function get_class_base($qid, $class){
		$class_base = SUBMISSION_BASE . "/". $class. "/". $class . "." . $qid;
		return $class_base;
	}
	
	public static function get_configuration($qid, $class){
		$class_base = Utilities::get_class_base($qid, $class);
		$config_file = $class_base . "/paperless_config.json";
		$contents = file_get_contents($config_file);
		$arr = json_decode($contents);
		return $arr;
	}
	
	
	public static function get_assn_base($qid, $class, $assn){
		$class_base = Utilities::get_class_base($qid, $class);
		return $class_base . "/repos/" . $assn;
	}
	
	public static function get_student_dir($qid, $class, $assignment, $student){
		$assn_base = Utilities::get_assn_base($qid, $class, $assignment);
		return $assn_base . "/" . $student . "/";
	}

	/*
	 * Better get directories. Ignore . and ..
	 * Return names of subdirectories.
	 */
	public static function get_all_directories($dirname){
		$entries = array();
		if(!is_dir($dirname)) return $entries;
		$dir = opendir($dirname);
		while($entry = readdir($dir)) {
			if($entry == '.' || $entry == ".."){
				continue;
			}
			if(is_dir($dirname.'/'.$entry)){
				$entries[] = $entry;
			}
		}
		return $entries;
	}
	
	public static function get_comments($dirname){
		$file = $dirname . 'comments.json';
		if(is_file($file)){
			$contents = file_get_contents($file);
			return json_decode($contents);
		}
		return array();
	}


	/*
	 * This method returns all of the files in this submission folder for a student.
	 * We are given the path to the submission folder. We only return files
	 * that are not directories, not hidden, and not the paperless release file
	 *
	 * @param	$dirname	{string}	the name of the assignment directory
	 *
	 * @return 	an array of the files in this directory
	 * @author	Jeremy Keeshin	December 25, 2011
	 */
	public static function get_all_files($dirname){
		if(!is_dir($dirname)){
			return null;
		}
		$files = array();
		$dir = opendir($dirname);
		while($file = readdir($dir)) {
			if(!is_dir($dirname.$file) && $file[0] != '.' && $file != 'release'){
				$files []= $file;
			}
		}
		return $files;
	}
	
	/*
	 * Get all of the code files and related information for a given (student, assignment, submission).
	 *
	 * @param	$dirname	{string}	the full path to the submission
	 * @param	$files		{array}		the list of all the acceptable files in the directory
	 *
	 * @return 	{array}, an associative array mapping from the filename to an array of all of the file contents 
	 *			and AssignmentFile objects for each valid code file.
	 * @author	Jeremy Keeshin	December 25, 2011
	 * @edited  Eric Conner  January 5, 2012
	 */
	public static function get_code_files($dirname, $files){
		
		$file_info = array();
		
		foreach($files as $file){
			//if($course->code_file_is_valid($file)){
				
				$file_info[$file] = array('contents' => htmlentities(file_get_contents($dirname . $file)));				
			//}
		}
		return $file_info;
	}
}

?>