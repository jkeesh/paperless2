function Comment(options){
    this.text = options.text;
    this.commenter = options.commenter;
    this.range = LineRange.string_to_range(options.range_string);
    this.file = options.file;
    this.waiting_on_request = false;
}

/*
 * Comment.prototype.add_to_dom
 * ------------------------
 * Add a comment from the template to display on the dom.
 *
 * @author  Eric Conner  January 8, 2012
 */
Comment.prototype.add_to_dom = function() {
    var self = this;
    
    var data = this.get_display_data();
    var html = $('#commentTemplate').tmpl(data);
    
    var commentLocation = $('.number' + this.range.higher, '.code_container[data-name="' + this.file.name+'"]');
    commentLocation.after(html);
    
    if(Paperless.CONFIGURATION.interactive){
        html.bind('click', function() {
            self.edit();
        });
    }
}

/*
 * Comment.prototype.remove_from_dom
 * ------------------------
 * Remove this comment from display.
 *
 * @author  Eric Conner  January 8, 2012
 */
Comment.prototype.remove_from_dom = function() {    
    var comment_div = $('.inlineComment[data-range="' + this.range.to_string() + '"]',
                            '.code_container[data-name="' + this.file.name+'"]');
    if(comment_div.length > 0)
        comment_div.remove();
}

/*
 * Comment.prototype.add_to_dom
 * ------------------------
 * Save the current comment to persistent storage.
 *
 * @author  Eric Conner  January 8, 2012
 */
Comment.prototype.save = function(){
    var commentText = $("textarea").val();
	this.text = this.filter(commentText);
    
    this.ajax("save");
}

/*
 * Comment.prototype.delete
 * ------------------------
 * Delete the comment from persistent storage.
 *
 * @author  Eric Conner  January 8, 2012
 *
 * TODO bug on delete empty comment--- really should be cancel -- jeremy
 */
Comment.prototype.delete = function() {
    if(Comment.is_editing()) {
        this.file.remove_dialog();
    }
    this.file.unhighlight_range(this.range);
    
    this.ajax("delete");
}

/*
 * Comment.prototype.edit
 * ------------------------
 * Open modal dialog for editing this comment.
 *
 * @author  Eric Conner  January 8, 2012
 */
Comment.prototype.edit = function() {
    var self = this;
    
    Paperless.CommentManager.current_comment = this;
    
    this.remove_from_dom();
	if(Comment.is_editing()) return;

    var range_last_line = this.file.get_line(this.range.higher).first();
    var range_viewport_y = range_last_line.offset().top - window.pageYOffset;
    
    var presets = Paperless.CommentManager.get_preset_comment_html();
    
    // handle case where editing an existing comments vs. adding new one
    var btns = {"Submit": function() { self.save(); }};
    var aux_action; var aux_text;
    if(this.text) {
        btns["Delete"] = function() { self.delete(); }; 
    } else {
        btns["Cancel"] = function() { 
            self.file.remove_dialog();
            self.file.unhighlight_range(self.range); 
        }
    }

    // setup the new dialog with the text of the current comement
    current_dialog = $('<div></div>')
    .html('<textarea>' + this.text +'</textarea><div class="modalMessage">Comments are formatted using ' +
         '<a target="_blank" href="http://daringfireball.net/projects/markdown/syntax">Markdown.</a><br/>' +
          'Can click preset comment below.</div>' + presets)
    .dialog({
    		autoOpen: true,
    		title: 'Enter Comment',
    		width: 350,
    		height: 450,
            position: ['center', range_viewport_y + 30],
    		focus: true,
    		open: function(event, ui) { $(".ui-dialog-titlebar-close").hide();},
    		closeOnEscape: false,
    		buttons: btns
    });
    this.file.current_dialog = current_dialog;

    $("textarea").focus();	
    
}

Comment.prototype.ajax = function(action){
    var self = this;
    if(self.waiting_on_request) return;
    
    self.waiting_on_request = true;
	$.ajax({
		   type: 'POST',
		   url: window.location.pathname, // post to current location url
		   data: {
		       action: action,
		       text: this.text,
		       rangeLower: this.range.lower,
		       rangeHigher: this.range.higher,
		       filename: this.file.name,
		   },
		   success: function(response) {
		        self.waiting_on_request = false;
			    if(response && response.status == "ok"){ 
			        if(response.action == "save"){
			            self.add_to_dom();
                        if(Comment.is_editing()) {
                            self.file.remove_dialog();
                        }
			        }
			    } else {
			        if(response.why){
			            alert(response.why);
			        }else{
			            alert("There was an error with this comment. Try refreshing the page.");
			        }
                }        			
		   },
		   error: function(jqXHR, textStatus, errorThrown) {
		        alert("There was an error with this comment. Try refreshing the page.");
		   }
	});
}


/*****************************
* Begin private helper methods
******************************/

/*
 * Comment.prototype.filter
 * ------------------------
 * Replace all of the text with ampersands and angle brackets with their
 * HTML entity equivalents.
 *
 * @param   text    {string}    the text to filter
 *
 * @author  Jeremy Keeshin  December 26, 2011
 */
Comment.prototype.filter = function(text){
	text = text.replace(/&/g, '&amp;');		
	text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return text;
}

/*
 * Comment.prototype.get_display_data
 * ------------------------
 * Get the data necessary to display this comment.
 *
 * @return   data    {Objcet}    An object with the necessary properties to display
 *                               this comment.
 *
 * @author  Eric Conner  January 8, 2012
 */
Comment.prototype.get_display_data = function() {
    
    formatted_text = Paperless.CONFIGURATION.converter.makeHtml(this.text);	
	formatted_text = formatted_text.replace(/&amp;/g, '&');
	
    var data = {
        range_text: this.range.to_string(),
        text: this.text,
        commenter: this.commenter,
        file_name: this.file.name,
        formatted_text: formatted_text
    };
    return data;
}

/*
 * Comment.is_editing
 * ------------------------
 * Static method that determines whether a comment is currently being edited.
 *
 * @return {boolean}    True if a comment is currently being edited, false otherwise.
 *
 * @author  Eric Conner  January 8, 2012
 */
Comment.is_editing = function() {
    // assume that if there is a textarea on screen then
    // we are editing a comment
    if($("textarea").length > 0) return true;
    return false; 
}