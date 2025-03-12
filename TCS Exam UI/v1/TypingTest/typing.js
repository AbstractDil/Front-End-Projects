/*
* Keystroke Counter
*/

let keyCount = 0;

// Event handler function
function countKeystrokes(event) {
  // Ignore special keys like Shift, Alt, Ctrl, etc.
  if (!event.ctrlKey && !event.altKey && !event.metaKey) {
    keyCount++;


    // count keystrokes without spaces

    document.getElementById('keystrokeCount').textContent = keyCount;


    

    /* ***************************************************
    * count characters with spaces
    ******************************************************
    document.getElementById('keystrokeCount').textContent = keyCount;
    */


    
}
// Access the key count when needed
// console.log('Total keystrokes:', keyCount);
}

// Attach event listener to the document
document.addEventListener('keydown', countKeystrokes);

/*
* Word Counter
*/

// Event handler function
function countWords() {
    const textareaValue = document.getElementById('myTextarea').value;
    const words = textareaValue.trim().split(/\s+/);
    const wordCount = words.length;
  
    document.getElementById('wordCount').textContent = wordCount;
  }
  
  // Attach event listener to the textarea
  document.getElementById('myTextarea').addEventListener('input', countWords);
  

  /*
  * Spelling error counter
  */

 // Function to calculate the Levenshtein distance
function calculateLevenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
  
    const matrix = [];
  
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
  
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
  
    return matrix[b.length][a.length];
  }
  
  // Event handler function
  function countSpellingErrors() {
    const givenWord = document.getElementById('givenWord').textContent.toLowerCase();
    const typedWord = document.getElementById('typedWord').value.toLowerCase();
  
    const errorCount = calculateLevenshteinDistance(givenWord, typedWord);
    document.getElementById('errorCount').textContent = errorCount;
  }
  
  // Attach event listener to the input field
  document.getElementById('typedWord').addEventListener('input', countSpellingErrors);
  

  /*
  * Spacing Error Counter using Levenshtein distance
  */
   
    // Event handler function

function countSpacingErrors() {

    const givenParagraph = document.getElementById('givenParagraph').textContent.toLowerCase();
    const paragraphInput = document.getElementById('paragraphInput').value.toLowerCase();
  
    const  spacingErrorCount = calculateLevenshteinDistance(givenParagraph, paragraphInput);
    document.getElementById('spacingErrorCount').textContent = spacingErrorCount;
  }

    // Attach event listener to the input field

    document.getElementById('paragraphInput').addEventListener('input', countSpacingErrors);
  
    /*
    * Check Wrong Capitalization using Levenshtein distance
    */

    // Event handler function

    function checkCapitalization() {
      var sentence = document.getElementById("sentence").value;

      // Split the sentence into an array of words
      var words = sentence.split(' ');

      // Iterate over each word
      for (var i = 0; i < words.length; i++) {
        var word = words[i];

        // Check if the first letter is not capitalized
        if (word.charAt(0) !== word.charAt(0).toUpperCase()) {
          document.getElementById("result").innerHTML = "Incorrect capitalization found.";
          return;
        }
      }

      document.getElementById("result").innerHTML = "No incorrect capitalization found.";
    }