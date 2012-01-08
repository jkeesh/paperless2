function Comment(options){
    this.text = options.text;
    this.commenter = options.commenter;
    this.range = LineRange.string_to_range(options.range_string);
    this.file = options.file;
}

/*
 * This function should add a comment to the DOM
 */
Comment.prototype.add_to_dom = function() {
    var self = this;
    
    var data = this.get_display_data();
    var html = $('#commentTemplate').tmpl(data);
    
    var commentLocation = $('.number' + this.range.higher, '.code_container[data-name="' + this.file.name+'"]');
    commentLocation.after(html);
    html.bind('click', function() {
        self.edit();
    });
}

/*
 * This function is responsible for saving the comment when it changes.
 * The changes to be saved should be the current contents of 'text'
 */
Comment.prototype.save = function(){
    var commentText = $("textarea").val();
	this.text = this.filter(commentText);
	
    this.add_to_dom();
    if(Comment.is_editing()) {
        this.file.remove_dialog();
    }
    
    console.info("SAVE!");
}

/*
* Delete the comment from persistent storage.
*/
Comment.prototype.delete = function() {
    if(Comment.is_editing()) {
        this.file.remove_dialog();
    }
    
    console.info("DELETE!");
}

/*
* Open modal dialog for editing a comment.
*/
Comment.prototype.edit = function() {
    var self = this;
    
	if(Comment.is_editing()) return;

    var range_last_line = this.file.get_line(this.range.higher).first();
    var range_viewport_y = range_last_line.offset().top - window.pageYOffset;

    // setup the new dialog with the text of the current comement
    current_dialog = $('<div></div>')
    .html('<textarea>' + this.text +'</textarea><div class="modalMessage">Comments are formatted using ' +
         '<a target="_blank" href="http://daringfireball.net/projects/markdown/syntax">Markdown.</a><br/>' +
          'Ctrl+3 For simple markdown reference.</div>')
    .dialog({
    		autoOpen: true,
    		title: 'Enter Comment',
    		width: 350,
    		height: 250,
            position: ['center', range_viewport_y + 30],
    		focus: true,
    		open: function(event, ui) { $(".ui-dialog-titlebar-close").hide();},
    		closeOnEscape: false,
    		buttons: { 
    		   "Submit":  function() { self.save(); }, 
    		   "Delete":  function() { self.delete(); },
    		}
    });
    this.file.current_dialog = current_dialog;

    $("textarea").focus();		
}


/*****************************
* Begin private helper methods
******************************/

/*
 * Comment.prototype.filter
 * =====================
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

Comment.is_editing = function() {
    // assume that if there is a textarea on screen then
    // we are editing a comment
    if($("textarea").length > 0) return true;
    return false; 
}