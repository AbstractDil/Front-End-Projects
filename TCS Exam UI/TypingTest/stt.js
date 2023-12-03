 /*************************  Set timer  Starts *************************/

    // start timer when click on data-target="#StartTestModal button"

    var startTest = document.getElementById("StartTest");

    startTest.addEventListener("click", function () {

        // Set the date we're counting down to
        //var countDownDate = new Date().getTime() + 900000; // 15 minutes


        var countDownDate = new Date().getTime() + 660000; // 30 seconds

        // Update the count down every 1 second
        var x = setInterval(function () {

            // Get today's date and time
            var now = new Date().getTime();


            // Find the distance between now and the count down date

            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds

            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="timer"

            document.getElementById("timer").innerHTML = minutes + "m : " + seconds + "s ";



            // check if time is less than 1 minute

            if (minutes < 1) {
                document.getElementById("showTimer").classList.remove("btn-warning");
                document.getElementById("showTimer").classList.add("btn-red");
                document.getElementById("timer").innerHTML = "00" + "m : " + seconds + "s ";

            }

            // check if time is less than 10 seconds

            if (seconds < 10) {

                document.getElementById("timer").innerHTML = "0" + minutes + "m : " + "0" + seconds + "s ";

            }

            // check if minutes < 10 and seconds > 9

            if (minutes < 10 && seconds > 9) {

                document.getElementById("timer").innerHTML = "0" + minutes + "m : " + seconds + "s ";

            }

            // check if minutes > 9 and seconds < 10

            if (minutes > 9 && seconds < 10) {

                document.getElementById("timer").innerHTML = minutes + "m : " + "0" + seconds + "s ";

            }

            // If the count down is over, write some text

            if (distance < 0) {

                clearInterval(x);

                document.getElementById("timer").innerHTML = "EXPIRED";

                //alert("Time Up");

            }

        }, 1000);

    });






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

    document.onkeypress = function (event) {
        event = (event || window.event);
        if (event.keyCode == 123) {
            return false;
        }
    }

    document.onmousedown = function (event) {
        event = (event || window.event);
        if (event.keyCode == 123) {
            return false;
        }
    }

    document.onkeydown = function (event) {
        event = (event || window.event);
        if (event.keyCode == 123) {
            return false;
        }
    }

    // Disable F12 ends

    // Disable Ctrl+U

    document.onkeydown = function (e) {
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

    document.onkeydown = function (e) {
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

    document.onkeydown = function (e) {
        if (e.ctrlKey &&
            (e.keyCode === 83)) {
            return false;
        } else {
            return true;
        }
    };

    // Disable Ctrl+S ends

    // Disable Ctrl+Shift+J

    document.onkeydown = function (e) {
        if (e.ctrl &&
            e.shiftKey &&
            (e.keyCode === 74)) {
            return false;
        } else {
            return true;
        }
    };

    // Disable mouse scroll

    document.addEventListener('wheel', function (e) {
        e.preventDefault();
    }, {
        passive: false
    });


    // Disable tab key

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    });

    // disable ctrl+c 

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
        }
    });

    // disbale ctrl + v

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 86) {
            e.preventDefault();
        }
    });
   

    /* ******************  Right click & Scroll disable Starts ******************** */



    /* Count total words and characters in original text*/

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

    var totalKeyStokes = originalText.length;

    console.log("Total Key Storkes : " + totalKeyStokes);


    // count characters in words in original text



    var originalTextCharactersCount = 0;

    for (var i = 0; i < originalTextWordsCount; i++) {
        originalTextCharactersCount += originalTextWords[i].length;
    }




    // Display total words and characters in original text

    document.getElementById("totalWordsOT").innerHTML = " Words : " + originalTextWordsCount + ",";
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

        var typedTextCharactersCount = 0;

        for (var i = 0; i < typedTextWordsCount; i++) {
            typedTextCharactersCount += typedTextWords[i].length;
        }

        var totalKeyStokesTT = typedTextValue.length;

        document.getElementById("totalWordsTT").innerHTML = " Words : " + typedTextWordsCount + ",";
        document.getElementById("totalCharactersTT").innerHTML = " Characters : " + typedTextCharactersCount + ",";
        document.getElementById("totalKeyStokesTT").innerHTML = "Key Stokes : " + totalKeyStokesTT + ",";

        /*

        console.log("Total Key Storkes : " + totalKeyStokesTT);

        console.log("Total Words in typed text : " + typedTextWordsCount);
        console.log( "Total character in typed text : " + typedTextCharactersCount);
        */

    });





