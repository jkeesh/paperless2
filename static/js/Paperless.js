// Paperless should be the only globally exposed object
Paperless = {};
window.D = console;

/*
 * Manage all of the files on the page
 */
Paperless.FileManager = {
    files: [],
    
    // Hide all files from display
    hide_all_files: function(){
        $('.code_container').hide();
        
        $('.filelink a.selected').removeClass('selected');
    },
    
    // Show all of the files 
    show_all_files: function(){
        $('.code_container').show();
    },
    
    
    show_file: function(filename){
        Paperless.FileManager.hide_all_files();
        $('.code_container[data-name="'+ filename +'"]').show();
        
        $('.filelink a[data-name="'+filename+'"]').addClass('selected');
    },
    
    hide_file: function(filename){
        $('.code_container[data-name="'+ filename +'"]').hide();
    },
    
    
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
    },
    
    setup: function(){
        var first_file_name = Paperless.FileManager.files[0].name;
        Paperless.FileManager.show_file(first_file_name);
    }
};

/*
 * Controls the functions relating to the setup of the comments, and dealing 
 * with the preset comments.
 * 
 * Handle shortcuts on comments, such as tab for submit
 */
Paperless.CommentManager = {
    
    // The current comment object
    current_comment: null,
    
    // A list of all of the preset comments for the current submission
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
    
    tab_submit: function(){
        $(document).keyup(function(e) {
            if(e.keyCode == 9){ // tab key
                D.log("SUBMIT COMMENT");
                
                if(Paperless.CommentManager.current_comment){
                    Paperless.CommentManager.current_comment.save();
                }
            }
        });
    },
    
    setup: function(){
        Paperless.CommentManager.tab_submit();
        
        $('.preset_option').live('click', function(){
            var chosen_option = $(this).html();            
            var textarea = $('textarea');            
            var oldval = textarea.val();

            if(oldval.length == 0){
                textarea.val(chosen_option);
            }else{
                textarea.val(oldval + '\n\n' + chosen_option);
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
            
            var name = $("a", elem).attr('data-name');
            
            // Create a new CodeFile object
            var new_file = new CodeFile({
                name: name
            });
            
            // When you click a link, show this file
            $("a", elem).click(function(e){
                e.preventDefault();
                Paperless.FileManager.show_file(name)
            })
            
            // Add this file to the list of files
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
        
        Paperless.FileManager.setup();
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