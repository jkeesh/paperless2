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
    // figure out which line to add comment to
    var data = this.get_display_data();
    var html = $('#commentTemplate').tmpl(data);
    
    var commentLocation = $('.number' + this.range.higher, '.code_container[data-name="' + this.file.name+'"]');
    commentLocation.after(html);
    
    
}

/*
 * This function is responsible for saving the comment when it changes.
 * The changes to be saved should be the current contents of 'text'
 */
Comment.prototype.save = function(){
    
}

/*
* Delete the comment from persistent storage.
*/
Comment.prototype.delete = function() {
    
}


/*****************************
* Begin private helper methods
******************************/
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