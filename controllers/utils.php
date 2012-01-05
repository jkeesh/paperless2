<?php
class Utilities {	

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
	 * @param	$course		{Object}	The Course object
	 * @param	$student	{Object}	the Student object
	 * @param	$assignment	{string}	the name of the assignment
	 * @param	$dirname	{string}	the full path to the submission
	 * @param	$files		{array}		the list of all the acceptable files in the directory
	 * @param	$submission_number {string}	the number of this submission
	 *
	 * @return 	{array}, an associative array mapping from the filename to an array of all of the file contents 
	 *			and AssignmentFile objects for each valid code file.
	 * @author	Jeremy Keeshin	December 25, 2011
	 */
	public static function get_code_files($course, $student, $assignment, $dirname, $files, $submission_number){
		
		$file_info = array();
		
		foreach($files as $file){
			if($course->code_file_is_valid($file)){
				
				$file_info[$file] = array('contents' => htmlentities(file_get_contents($dirname . $file)),
										  'assn' => $assn);				
			}
		}
		return $file_info;
	}
}

?>