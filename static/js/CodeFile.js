function CodeFile(options){
    this.name = options.name;
    this.comments = []; // hold comment objects
    this.highlights = new Array(); // stores counts of times a line has been highlighted
    
    this.current_dialog = null;
    
    // add mouse events
    this.add_handlers();
}

/*
 * CodeFile.prototype.add_comment
 * ------------------------
 * Add a comment object to the list of comments for this file. Also
 * highlight the range associated with this comment.
 *
 * @author  Jeremy Keeshin  January 8, 2012
 * @edited  Eric Conner     January 10, 2012
 */
CodeFile.prototype.add_comment = function(comment){
    this.comments.push(comment);
    comment.add_to_dom();
    this.highlight_range(comment.range);
}

/*
 * CodeFile.prototype.highlight_range
 * ------------------------
 * Highlight the set of lines defined by a range object.
 *
 * @param   range    {LineRange Object}    The range of lines to highlight.
 *
 * @author  Jeremy Keeshin  January 8, 2012
 * @edited  Eric Conner     January 10, 2012
 */
CodeFile.prototype.highlight_range = function(range){		
	for (var i = range.lower; i <= range.higher; i++) {
	    var line = this.get_line(i);
		this.hilite_line(line);
		
		// maintain a highlight count so that we know if this line
		// has multiple highlights
		this.highlights[i]++;
	}  
}


/*
 * CodeFile.prototype.unhighlight_range
 * ------------------------
 * Unhighlight the set of lines defined by a range object.
 *
 * @param   range    {LineRange Object}    The range of lines to unhighlight.
 *
 * @author  Jeremy Keeshin  January 8, 2012
 * @edited  Eric Conner     January 10, 2012
 */
CodeFile.prototype.unhighlight_range = function(range){		
	for (var i = range.lower; i <= range.higher; i++) {
		
		if(this.highlights[i] > 0){
			this.highlights[i]--;
		}

		//only unhighlight if the highlight count is zero. otherwise
		//there are possibly multiple comments on this line
		if(this.highlights[i] == 0) {
		    var line = this.get_line(i);
			this.unhilite_line(line);
		}			
	}
}

/*
 * CodeFile.prototype.get_line
 * ------------------------
 * Get the JQuery DOM object for a specific line number from the code file.
 *
 * @param   line_no    {int}    The line number of the element to return.
 *
 * @author  Jeremy Keeshin  January 8, 2012
 * @edited  Eric Conner     January 10, 2012
 */
CodeFile.prototype.get_line = function(line_no) {
    var file_selector = '.code_container[data-name="'+this.name+'"]';
	var theclass = '.number' + line_no;
	return $(theclass, file_selector);
}

/***************************
* Begin private helper methods
***************************/
CodeFile.prototype.hilite_line = function (line) {
	$(line).addClass("highlighted");
}

CodeFile.prototype.unhilite_line = function (line) {
	$(line).removeClass("highlighted");
}

CodeFile.prototype.add_handlers = function() {
	this.highlights.push(0); // just put a zero in index zero-- we want to start from line 1
	var line_no = 1;
	do {
		this.highlights.push(0);
		var line = this.get_line(line_no);
		line.bind("mousedown", {code_file : this}, CodeFile.mouse_pressed);
		line.bind("mouseenter", {code_file : this}, CodeFile.mouse_entered);
		line.bind("mouseup", {}, CodeFile.mouse_up);
		line_no++;
	} while(line.size() != 0);
}

CodeFile.prototype.get_line_number = function(line) {
	var newline = $(line).attr("class");
	var pattern = /line number(\d+) .*/;
	var result = pattern.exec(newline)[1];
	return parseInt(result);
}

    
/*
 * CodeFile.prototype.remove_dialog
 * --------------------
 * Remove a modal dialog from the view.  Note: this is
 * safe because it checks the existence of a textarea on the 
 * screen before removing
 */
CodeFile.prototype.remove_dialog = function() {
    if( $('textarea')) $('textarea').remove();
    if(this.current_dialog == null) return;
	this.current_dialog.dialog("close");
	this.current_dialog.dialog("destroy");
	this.current_dialog = null;
}


/*
 * CodeFile.prototype.mouse_pressed
 * --------------------
 * Handle when the mouse is pressed on any of the lines within
 * the code file div.
 */
CodeFile.mouse_pressed = function(event) {
	if(Comment.is_editing()) return;
	
	code_file = event.data.code_file;
	if (CodeManager.dragging_in_file != null && CodeManager.dragging_in_file != code_file) {
		return false;
	}
	
	var line_no = code_file.get_line_number(this);
	
	CodeManager.dragging_in_file = code_file;
	code_file.selected_range_start = code_file.selected_range_end = line_no;
	code_file.hilite_line(this);
	event.data.code_file.dragging = true;
	return false;
}

/*
 * CodeFile.prototype.mouse_entered
 * --------------------
 * Handle the event where the mouse is dragged across multiple lines. In
 * this case the mouse will "enter" multiple lines of text so this event
 * responds to the mouse entered event for each line.
 */
CodeFile.mouse_entered = function(event) {
	code_file = event.data.code_file;
	if (CodeManager.dragging_in_file != code_file) {
		return;
	}
	
	var line_no = code_file.get_line_number(this);
	old_range = new LineRange(code_file.selected_range_start, code_file.selected_range_end);
	range = new LineRange(code_file.selected_range_start, line_no);
	range.each(function(line_no) {
	    var line = code_file.get_line(line_no);
	    code_file.hilite_line(line);
	});
	
	for (var i = old_range.higher; i > range.higher; i--) {
		var line = code_file.get_line(i);
	    code_file.unhilite_line(line);
	}
	
	code_file.selected_range_end = line_no;
}

/*
 * CodeFile.prototype.mouse_up
 * --------------------
 * Handle the event where a person has finished dragging within the
 * file and lets the mouse up.
 */
CodeFile.mouse_up = function(event) {
	if (CodeManager.dragging_in_file == null) {
	    return;
	}
    
	var comment = new Comment({
	    text:      '',
	    range_string: CodeManager.dragging_in_file.selected_range_start + '-' + CodeManager.dragging_in_file.selected_range_end,
	    file:  CodeManager.dragging_in_file,
	    commenter: Paperless.CONFIGURATION.commenter
	});
	comment.edit();

	CodeManager.dragging_in_file.comments.push(comment);
	CodeManager.dragging_in_file = null;
}