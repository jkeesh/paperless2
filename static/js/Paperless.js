// Paperless should be the only globally exposed object
Paperless = {};
window.D = console;

/*
 * Manage all of the files on the page
 */
Paperless.FileManager = {
    files: [],
    
    // Add a file to the file manager
    add_file: function(file){
        this.files.push(file);
    },
    
    get_file: function(name) {
        console.info(this.files);
        for(var idx in this.files) {
            var file = this.files[idx];
            console.info(file);
            if(file.name == name) {
                return file;
            }
        }
        return null;
    }
};


/*
 * Handle the setup of the page.
 */
Paperless.Setup = {
    
    create_comments: function(){
        
        $('.filelink').each(function(idx, elem) {
            var new_file = new CodeFile({
                name: $("a", elem).attr('data-name')
            });
            Paperless.FileManager.add_file(new_file);
        });
           
        // For every file create a new CodeFile object
        $('.file_comments').each(function(idx, elem){
           // For every comment on this file, create a new comment object
           // and add it to the code file
           cur_file = Paperless.FileManager.get_file($(this).attr('data-file'));
           $(this).children().each(function(idx, comment) {
               var new_comment = new Comment({
                   text: $(comment).attr('data-comment'),
                   commenter: $(comment).attr('data-commenter'),
                   range_string: $(comment).attr('data-range'),
                   file: cur_file
               });
               
               cur_file.add_comment(new_comment);
           }) ;
        });
    },
    
    
    start: function(){
        $(document).bind("status.finishedSyntaxHighlighting", Paperless.Setup.create_comments);
        D.log(Paperless);
    }
};