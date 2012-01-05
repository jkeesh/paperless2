/* File: reassemble.c
 * ------------------
 * Eric Conner
 * econner@stanford.edu
 *
 * Program reads a file whose name is given by argv[1] that 
 * contains some number of fragments of original text.  This
 * program attempts to recreate that original text by using a
 * greedy algorithm to determine the maximal overlap between
 * any two remaining fragments.  It then merges these fragments
 * and continues working until only one fragment remains.
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
* Method: read_file
* -------------------
* Parses file "filename", reading all fragments into the
* frags array.  Produces an array with frag_len elements
* each of which holds one fragment from the file.
*/
void read_file(char *filename, char **frags, int *frag_len)
{
    FILE *file;
    file = fopen(filename, "r");
    
    if(!file) {
        printf("File not found!");
        exit(1);
    }

    char temp_str[1000];
    char temp_w[1000];
    int i = 0;
    
    /*while(fscanf(file, "#%[^#]#", temp_str) != EOF) {
        frags[i] = malloc(2*strlen(temp_str)+5 * sizeof(char));
        strcpy(frags[i], temp_str);
        i++;
    }*/
    while(fscanf(file, "%[a-zA-Z]%[^a-zA-Z]", temp_str, temp_w) != EOF) {
      printf("STR: %s\n", temp_str);
    }

    
    
    *frag_len = i;
    
    fclose(file);
}

/*
* Method: overlap
* --------------------
* Finds the overlap between str1 and str2 by repeatedly peeling
* off the first char of str1 and comparing either it's length bytes
* or the length of str2 bytes to str2.  Produces the array overlaps.
* overlaps[0] holds the offset at which to begin merging and
* overlaps[1] contains the size of the overlap.
*/
void overlap(char *str1, char *str2, int *overlaps)
{
    int i, size;
    int str1_len = strlen(str1);
    
    for(i = 0; i < str1_len; i++) {
        // compare str2 from its beginning to str1 from its i'th character
        int checklen1 = (str1_len-i)*sizeof(char);
        int checklen2 = strlen(str2)*sizeof(char);
        size = (checklen1 > checklen2) ? checklen2 : checklen1;
        
        if(strncmp(str1, str2, size) == 0) {
            overlaps[0] = checklen1;  // start merging here (if needed)
            overlaps[1] = size;       // size of overlap
            return;
        }
        
        str1++;
    }
    
    overlaps[0] = overlaps[1] = -1;
}

/* 
* Method: find_best_overlap
* ------------------------
* Finds the maximum overlap remaining between frags[cur_str]
* and any other fragment.  Produces the array best_ov.
* best_ov[0] -- offset at which to start merging
* best_ov[1] -- amount of overlap
* best_ov[2] -- index of fragment of overlap in frags array
*/
void find_best_overlap(char **frags, int frag_len, int cur_str, int *best_ov)
{  
    int i;
    for(i = 0; i < frag_len; i++)
    {
        if(i == cur_str) continue;
        int len = strlen(frags[i]);
        if(len < best_ov[1]) continue;
            
        int ovs[2];
        overlap(frags[cur_str], frags[i], ovs);
        
        if(ovs[1] > best_ov[1]) {
            best_ov[0] = ovs[0]; // start merging here
            best_ov[1] = ovs[1]; // amount of overlap
            best_ov[2] = i;      // index of fragment in frags array
        }
    }
}

/*
* Method: shift_frags
* ---------------------
* Removes element frags[cur] and shifts the rest in the array up by
* one.
*/
void shift_frags(char **frags, int frag_len, int cur)
{
    free(frags[cur]);
    memmove(frags+cur, frags+cur+1, (frag_len-cur) * sizeof(char*));
}

/*
* Method: merge_frags
* ---------------------
* Merges fragment frags[cur_str] and frags[best[2]] at the offset
* best[1] in frags[best[2]].  It simply appends everything after 
* position best[1] in frags[best[2]] to the end of frags[cur_str]
* and removes the second fragment.
*/
void merge_frags(char **frags, int frag_len, int cur_str, int *best)
{
    int bind = best[2];
    int start = best[1];
    
    int str1_len = strlen(frags[cur_str]);
    int str2_len = strlen(frags[bind]);
    
    if(start < str2_len) {
        int newsize = (str1_len+(str2_len-start)+5);
        frags[cur_str] = realloc(frags[cur_str], newsize*sizeof(char));
        
        strcat(frags[cur_str], frags[bind]+start);
    }
    
    shift_frags(frags, frag_len, bind);
}

/*
* Method: find_max_overlap
* ---------------------
* Finds the two remaining elements with the most overlap.  Their indices
* are given by the return value and max[2].
*/
int find_max_overlap(char** frags, int frag_len, int *max)
{
    int i;
    int curelem = -1;
    for(i = 0; i < frag_len; i++)
    {
        int best_ov[3] = {-1, -1, -1};
        
        int len = strlen(frags[i]);
        if(len < max[1]) continue;
        
        find_best_overlap(frags, frag_len, i, best_ov);
        if(best_ov[1] > max[1]) {
            max[0] = best_ov[0]; 
            max[1] = best_ov[1];
            max[2] = best_ov[2];
            curelem = i;
        }
    }
    
    return curelem;
}

/*
* Method: look_for_overlaps
* ---------------------
* Finds and merges fragments until only one remains.  Outputs
* final fragment.
*/
void look_for_overlaps(char **frags, int frag_len)
{
    while(frag_len > 1)
    {
        int max[3] = {-1, -1, -1};
        
        int curelem = find_max_overlap(frags, frag_len, max);
        merge_frags(frags, frag_len, curelem, max);
        
        frag_len--;
    }
    
    printf("\n%s\n", frags[0]);
}

/*
* main
* ---------------------
* Reads the file, finds and processes the overlaps, then
* cleans up memory.
*/
int main(int argc, const char *argv[])
{
    char *frags[10000];
    char *filename;
    int frag_len;
    
    // Read in the file
    if (argc != 2) {
      printf("No filename entered!\n");
      return 1;   
    }
    
    filename = malloc(strlen(argv[1])+1 * sizeof(char));
    strcpy(filename, argv[1]);
    read_file(filename, frags, &frag_len);
    
    // Find and process all the matches
    look_for_overlaps(frags, frag_len);
    
    // Clean up
    free(frags[0]);
    free(filename);
    
    return 0;
}
