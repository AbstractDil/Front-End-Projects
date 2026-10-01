// show current Date & Time 
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];
var today = new Date();

/* Method -1 */

var date =  monthNames[today.getMonth()]+' '+today.getDate()+','+today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;


/* Method-2 
Using toLocaleDateString() is an ECMAScript1 (ES1) feature */
/*
var date = today.toLocaleDateString();
var time = today.toLocaleTimeString();
var dateTime = date+' '+time;
*/
//var dateTime = today.toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
document.getElementById("currentDateTime").innerHTML = dateTime;
document.getElementById("Year").innerHTML = today.getFullYear();


/*Navigation*/

