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
    }
};


/*
 * Handle the setup of the page.
 */
Paperless.Setup = {
    
    /// TODO ... maybe not the best way to set this up... files arent
    /// created if there werent comments yet... maybe do this in two spearte setesp
    create_comments: function(){
        // For every file create a new CodeFile object
        $('.file_comments').each(function(idx, elem){
            
           var new_file = new CodeFile({
               name: $(elem).attr('data-file')
           });
           Paperless.FileManager.add_file(new_file);
           
           // For every comment on this file, create a new comment object
           // and add it to the code file
           $(this).children().each(function(idx, comment){
               var new_comment = new Comment({
                   text: $(comment).attr('data-comment'),
                   commenter: $(comment).attr('data-commenter'),
                   range_string: $(comment).attr('data-range'),
                   file: new_file
               });
               
               new_file.add_comment(new_comment);
           }) ;
        });
    },
    
    
    start: function(){
        Paperless.Setup.create_comments();
        D.log(Paperless);
    }
};