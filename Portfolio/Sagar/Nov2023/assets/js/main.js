
// Change About men and Contact Me Button text

function ChngTxt(x) {
  if (x.matches) { // If media query matches
      document.getElementById("aboutMeBtn").innerHTML = '<i class="bi bi-person"></i> About';
      document.getElementById("contactMeBtn").innerHTML = '<i class="bi bi-person-lines-fill"></i> Hire Me';
  } else {
      document.getElementById("aboutMeBtn").innerHTML = '<i class="bi bi-person"></i> About Me';
      document.getElementById("contactMeBtn").innerHTML = '<i class="bi bi-person-lines-fill"></i> Hire Me';
  }
}

var x = window.matchMedia("(max-width: 390px)");

ChngTxt(x); // Call listener function at run time

x.addListener(ChngTxt); // Attach listener function on state changes
