const options = {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};




setInterval(myTimer);

function myTimer() {
const d = new Date();
//   document.getElementById("date_time").innerHTML = d.toLocaleDateString() + d.toLocaleTimeString();

document.getElementById("currentDateTime").innerHTML =  d.toLocaleString('en-US', options);
}





