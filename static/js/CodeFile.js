function CodeFile(options){
    this.name = options.name;
    this.comments = []; // hold comment objects
    this.highlights = new Array(); // stores counts of times a line has been highlighted
}

// Add a comment object to the list of comments for this file
CodeFile.prototype.add_comment = function(comment){
    this.comments.push(comment);
    var comment_html = comment.add_to_dom();
    comment_html.bind('click', function() {
        comment.edit();
    });
    this.highlight_range(comment.range);
}

CodeFile.prototype.highlight_range = function(range){		
	for (var i = range.lower; i <= range.higher; i++) {
	    
	    var line = this.get_line(i);
		this.hilite_line(line);
		this.highlights[i]++;
	}  
}

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