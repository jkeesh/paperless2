function CodeFile(options){
    this.name = options.name;
    this.comments = []; // hold comment objects
}

// Add a comment object to the list of comments for this file
CodeFile.prototype.add_comment = function(comment){
    this.comments.push(comment);
    comment.add_to_dom();
}

// Add functions to highlight/unhighlight ranges