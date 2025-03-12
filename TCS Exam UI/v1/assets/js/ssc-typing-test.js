 /*************************  Set timer  Starts *************************/

 var timer = document.getElementById("timer");
 var min = 10;
 var sec = 60;
 var interval = setInterval(function() {
     sec--;

     document.getElementById("submitBtn").disabled = true;
     document.getElementById("FinishExam").disabled = true;
     


     
     if (sec == 0 && min > 0) {
         min--;
         sec = 60;
     }
     
     if (min == 0 && sec == 0) {

         // wait for 1 sec
         clearInterval(interval);

         setTimeout(function() {
            
             alert("Time is Over. \nPress OK to continue.");
           
                // submit form when time up 
                
                document.getElementById("FormTT").submit();


         }, 1000);

     }

     if(min < 1){
        
         timer.innerHTML = "0" + min + " : " + sec;

     }


     if (sec < 10) {


         timer.innerHTML = "0" + min +  " m : " + "0" + sec + " s";
     } 

     if (min < 10 && sec > 9) {

        document.getElementById("FinishExam").disabled = false;

         timer.innerHTML = "0" + min + " m : " + sec + " s";
     }

     if (min > 9 && sec > 9) {
         timer.innerHTML = min + " m : " + sec + " s";
     }

     if (min > 9 && sec < 10) {
         timer.innerHTML = min + " m : " + "0" + sec + " s";
     }

     if (min == 0 && sec < 10) {
         timer.innerHTML = "00" + " m : " + "0" + sec + " s" ;
     }

     if (min == 0 && sec > 9) {
         timer.innerHTML = "00" + " m : " + sec + " s";
     }

     if (min == 0 && sec == 0) {
         timer.innerHTML = "00" + " m : " + "00 s";
     }

 }, 1000);

 // Set timer ends



 // Set user name

 var userName = document.getElementById("userName");
 //userName.innerHTML = prompt("Enter Your Name");

 // Set user name ends

 /*************************  Set timer  Ends *************************/


 /* ******************  Right click & Scroll disable Starts ******************** */

 // Disable right click

 document.addEventListener('contextmenu', event => event.preventDefault());

 // Disable right click ends

 // Disable F12

 document.onkeypress = function(event) {
     event = (event || window.event);
     if (event.keyCode == 123) {
         return false;
     }
 }

 document.onmousedown = function(event) {
     event = (event || window.event);
     if (event.keyCode == 123) {
         return false;
     }
 }

 document.onkeydown = function(event) {
     event = (event || window.event);
     if (event.keyCode == 123) {
         return false;
     }
 }

 // Disable F12 ends

 // Disable Ctrl+U

 document.onkeydown = function(e) {
     if (e.ctrlKey &&
         (e.keyCode === 67 ||
             e.keyCode === 86 ||
             e.keyCode === 85 ||
             e.keyCode === 117)) {
         return false;
     } else {
         return true;
     }
 };

 // Disable Ctrl+U ends

 // Disable Ctrl+Shift+I

 document.onkeydown = function(e) {
     if (e.ctrlKey &&
         e.shiftKey &&
         (e.keyCode === 73)) {
         return false;
     } else {
         return true;
     }
 };

 // Disable Ctrl+Shift+I ends

 // Disable Ctrl+S

 document.onkeydown = function(e) {
     if (e.ctrlKey &&
         (e.keyCode === 83)) {
         return false;
     } else {
         return true;
     }
 };

 // Disable Ctrl+S ends

 // Disable Ctrl+Shift+J

 document.onkeydown = function(e) {
     if (e.ctrl &&
         e.shiftKey &&
         (e.keyCode === 74)) {
         return false;
     } else {
         return true;
     }
 };

 // Disable mouse scroll

 document.addEventListener('wheel', function(e) {
     e.preventDefault();
 }, {
     passive: false
 });


 /* ******************  Right click & Scroll disable Starts ******************** */


 var originalText = document.getElementById("OriginalText").value;


var texts = [

    {
        "text": `Azadi Ka Amrit Mahotsav is an initiative of the Government of India to celebrate and commemorate 75 years of independence and the glorious history of its people, culture and achievements. This Mahotsav is dedicated to the people of India who have been instrumental in bringing India thus far in its evolutionary journey and hold within them the power and potential to enable the vision of activating India 2.0, fuelled by the spirit of Aatmanirbhar Bharat.It has recently concluded its first year. In view of this, the Ministry of Culture, Government of India, has organised a two-day conference in New Delhi to reflect on the progress of AKAM so far, gather best practices and ideate the strategies to be adopted for the remaining period of the celebration, especially for upcoming crucial initiatives.The success of AKAM depends critically on the 'Whole of Government' approach that ensures the involvement of every Ministry, State and Union Territory in this campaign, along with its counterparts abroad. In view of this substantial scale and involvement of stakeholders, the conference shall be attended by Senior Government Officers from every State and UT. The topics of discussion shall include landmark initiatives that involve mass public participation such as 'Har Ghar Jhanda', 'International Yoga Day', 'Digital District Repository', 'Swatantra Swar' and 'Mera Gaon Meri Dharohar'. It shall also have a session by the Ministry of Tourism focusing on its significant contributions to the AKAM campaign. It shall also have an ideation session by States/UTs on the noteworthy progress made by them under AKAM, along with deliberations on best practices and lessons learned so far and how they can be incorporated going forward. This conference shall be inaugurated by the Hon'ble Minister of Home and Co-operation. The opening address shall be delivered by the Hon'ble Minister of Culture, Tourism, and Development of the North Eastern Region of India. Inaugural addresses of sessions shall be delivered by the Hon'ble Minister of State for Parliamentary Affairs and Culture.`
    }
];

var originalText = texts[0].text;

// show text in original text area

document.getElementById("OriginalText").innerHTML = originalText;

var originalTextWords = originalText.trim().split(" ");
var originalTextWordsCount = originalTextWords.length;

var totalSpaceCount = originalText.match(/ /g).length;;
console.log(totalSpaceCount);

var totalKeyStokes = originalText.length;

console.log("Total Key Storkes : " + totalKeyStokes);

// count characters in words in original text

var originalTextCharactersCount = 0;

for (var i = 0; i < originalTextWordsCount; i++) {
    originalTextCharactersCount += originalTextWords[i].length;
}

// Display total words and characters in original text

document.getElementById("totalWordsOT").innerHTML = " Words : " + originalTextWordsCount + ",";
document.getElementById("totalSpaceOT").innerHTML = " Spaces : " + totalSpaceCount + ",";

document.getElementById("totalCharactersOT").innerHTML = " Characters : " + originalTextCharactersCount + ",";
document.getElementById("totalKeyStokesOT").innerHTML = "Key Stokes : " + totalKeyStokes;


console.log("Total Words in origial text : " + originalTextWordsCount);
console.log("Total character in origial text : " + originalTextCharactersCount);


/* count typed words, character and keystokes */

var typedText = document.getElementById("TypedText");

typedText.addEventListener("keyup", function () {
    var typedTextValue = typedText.value;
    var typedTextWords = typedTextValue.trim().split(" ");
    var typedTextWordsCount = typedTextWords.length;

    var totalSpaceCount = typedTextValue.match(/ /g).length;

    var typedTextCharactersCount = 0;

    for (var i = 0; i < typedTextWordsCount; i++) {
        typedTextCharactersCount += typedTextWords[i].length;
    }

    var totalKeyStokesTT = typedTextValue.length;

    document.getElementById("totalWordsTT").innerHTML = " Total Words Count : <b>" + typedTextWordsCount + "</b>,";
    document.getElementById("totalSpaceTT").innerHTML = " Total  Spaces Count:  <b>" + totalSpaceCount + "</b>,";
    document.getElementById("totalCharactersTT").innerHTML = "  Total Characters Count:  <b>" + typedTextCharactersCount + "</b>,";
    document.getElementById("totalKeyStokesTT").innerHTML = " Total Keystokes Count: <b> " + totalKeyStokesTT + "</b>,";

}
);

// onclick Submit button 

function onClickSubmitTestBtn() {
    
    document.getElementById("FormTT").submit();

}