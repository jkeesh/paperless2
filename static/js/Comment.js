function Comment(options){
    this.text = options.text;
    this.commenter = options.commenter;
    this.range = LineRange.string_to_range(options.range_string);
    this.file = options.file;
}

// Create a save function.

// Create an add to dom function?