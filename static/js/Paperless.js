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

Paperless.CommentManager = {
    
    preset_comments: [],
    
    /*
     * Return html to be displayed in a modal dialog containing
     * all of the preset comments for this assignment.
     */
    get_preset_comment_html: function(){
        var result = "";
        for(var i = 0; i < this.preset_comments.length; i++){
            result += "<div class='preset_option'>";
            result += this.preset_comments[i];
            result += "</div>";
        }
        return result;
    },
    
    setup: function(){
        $('.preset_option').live('click', function(){
            var chosen_option = $(this).html();
            D.log(chosen_option);
            
            D.log($('textarea'));
            
            var textarea = $('textarea');
            
            var oldval = textarea.val();
            D.log(oldval);
            D.log(oldval.length);
            
            if(oldval.length == 0){
                textarea.val(chosen_option);
            }else{
                textarea.val(textarea.val() + '\n\n' + chosen_option);
            }
        });
    }
}


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
    
    create_preset_comments: function(){
        Paperless.CommentManager.preset_comments = [];
        $('.preset_comment').each(function(idx, elem){
            var comment = $.trim($(elem).html());
            D.log(comment);
            Paperless.CommentManager.preset_comments.push(comment);
        });
    },
    
    
    start: function(){
        $(document).bind("status.finishedSyntaxHighlighting", Paperless.Setup.create_comments);
        Paperless.Setup.create_preset_comments();
        Paperless.CommentManager.setup();
        D.log(Paperless);
    }
};