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