// check device dimensions

if ($(window).width() < 768) {
  console.log("For best results, please use a desktop or laptop.");
}

// get version from package.json

$.getJSON("package.json", function (json) {
  var version = json.version;

  console.log("Version: " + version);

  $("#systemVersion").html("V" + version);
});

// disable cut copy paste

$(document).ready(function () {
  $("body").bind("cut copy paste", function (event) {
    event.preventDefault();
  });
});

// disable right click

$(document).ready(function () {
  $(document).bind("contextmenu", function (e) {
    console.log("Right click disabled.");
    return false;
  });
});

$(document).keydown(function (e) {
  // disable F12

  if (e.which === 123) {
    console.log("F12 disabled.");
    return false;
  }
  // disable ctrl+shift+i

  if (e.ctrlKey && e.shiftKey && e.which === 73) {
    console.log("Ctrl+Shift+I disabled.");
    return false;
  }

  // disable ctrl+shift+c

  if (e.ctrlKey && e.shiftKey && e.which === 67) {
    console.log("Ctrl+Shift+C disabled.");

    return false;
  }

  // disable ctrl+shift+j

  if (e.ctrlKey && e.shiftKey && e.which === 74) {
    console.log("Ctrl+Shift+J disabled.");

    return false;
  }

  // disable ctrl+u

  if (e.ctrlKey && e.which === 85) {
    console.log("Ctrl+U disabled.");

    return false;
  }

  // disable ctrl+shift+u

  if (e.ctrlKey && e.shiftKey && e.which === 85) {
    console.log("Ctrl+Shift+U disabled.");

    return false;
  }

  // disable ctrl+p screen

  if (e.ctrlKey && e.which === 80) {
    console.log("Ctrl+P disabled.");

    return false;
  }

  //
});

// site onload full screen mode

var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    // Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    //IE11
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    // Safari
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    //IE11
    document.msExitFullscreen();
  }
}




// login 

function login() {

  window.location.href = "Instruction.php?page=1";
}

function goNextp2(){
  window.location.href = "Instruction.php?page=2";
}





