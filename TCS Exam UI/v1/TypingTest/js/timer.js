 /*************************  Set timer  Starts *************************/

    // start timer when click on data-target="#StartTestModal button"

    var startTest = document.getElementById("StartTest");
    

    startTest.addEventListener("click", function () {

        // Set the date we're counting down to
        //var countDownDate = new Date().getTime() + 900000; // 15 minutes

        // show countdown from 59 seconds 

        var countDownDate = new Date().getTime() + 900000; // 59 seconds

        // Update the count down every 1 second
        var x = setInterval(function () {

            // Get today's date and time
            var now = new Date().getTime();


            //console.log(now);

            // Find the distance between now and the count down date

            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds

            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            //console.log(minutes + "m : " + seconds + "s ");

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

                document.getElementById("timer").innerHTML = "TIME UP";

                //alert("Time Up");

                // submit form when time up 
                
                document.getElementById("FormTT").submit();


            }

        });



    });



    // Set timer ends

    