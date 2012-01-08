function Comment(options){
    this.text = options.text;
    this.commenter = options.commenter;
    this.range = LineRange.string_to_range(options.range_string);
    this.file = options.file;
}

/*
 * This function should add a comment to the DOM
 */
Comment.prototype.add_to_dom = function(){
    // figure out which line to add comment to
    console.info(this.file.name);
    console.info(this.range.higher);
    console.info('.code_container[data-name="' + this.file.name+'"]');
    console.info($('.code', '.code_container[data-name="' + this.file.name+'"]'));
    console.info($('.number1'));
    var commentLocation = $('.number' + this.range.higher, '.code_container[data-name="' + this.file.name+'"]');
    console.info(commentLocation);
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