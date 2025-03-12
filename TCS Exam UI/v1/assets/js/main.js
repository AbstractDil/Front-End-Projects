

// ====================  Process-1 =======================
//generates random id;
let token_key = () => {

  var date = new Date();

  var hour = date.getHours().toString(36);

  var minute = date.getMinutes().toString(36);

  var second = date.getSeconds().toString(36);

  var millisecond = date.getMilliseconds().toString(36);

  let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
 // return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
 return s4() + ""+ s4() + "" + hour + "" + minute + "" + second + "" + millisecond+""+s4();
}

console.log(token_key());
//"c2181edf-041b-0a61-3651-79d671fa3db7"

// count length of token key

var myToken = token_key();

console.log(myToken.length);

// count length of token key without hyphen

var myToken = token_key();

console.log(myToken.replace(/-/g, "").length);




// login 

function login() {

  // get roll number and password

  var rollNumber = $("#rollNo").val();


  //var password = $("#password").val();

  // start  session

  sessionStorage.setItem("session", "true");

  sessionStorage.setItem("rollNumber", rollNumber);

  // redirect to instructions page with a unique id in URL
  

  window.location.href = "Instructions.html?rno=" + rollNumber + "&token_key=" + token_key();
  
  //window.location.href = "Instructions.html?rno=" + rollNumber + "&token_key=" + token_key() + "&PoweredBy=MOES";






}



 



// check session before loading instructions page

function checkSession() {

  var session = sessionStorage.getItem("session");

  if (session == null) {

    window.location.href = "index.html";
    // show error message

$("#displayError").html("Your session has expired. Please login again.");

  }

  // if didnot get any token key in URL then redirect to index page

  var url = new URL(window.location.href);

  var token_key = url.searchParams.get("token_key");

  if (token_key == null) {

    window.location.href = "index.html";

  }


}

function goNext() {

  // window.history.forward();

  var rollNumber = sessionStorage.getItem("rollNumber");

  window.location.href ="Instructions.html?rno=" + rollNumber + "&token_key=" + token_key() + "&page=2";

  

    // window.location.href ="Instructions.html?rno=" + rollNumber + "&token_key=" + token_key() + "&PoweredBy=MOES&page=2";

}



// add url parameter automatically  in url


if(window.location.href.indexOf('?') == -1) {

  var url = window.location.href;
  //var newUrl = url + '?token_key=' + token_key() + '&PoweredBy=MOES';
  var newUrl = url + '?token_key=' + token_key();

  window.history.pushState('data', 'Title', newUrl);
  console.log(newUrl);
  }
 




// check device dimensions

if ($(window).width() < 768) {
  console.log("For best results, please use a desktop or laptop.");
}

// get version from package.json

$.getJSON("package.json", function (json) {
  var version = json.version;

  console.log("MOES Version: " + version);

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

   // Disable mouse scroll

   document.addEventListener('wheel', function (e) {
    e.preventDefault();

   });

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

// how to open all urls in full screen mode



// Onclick goBack button

function goBack() {

  window.history.back();

}

// onclick goNext button




// If page parameter is not found in URL then display none insPanelTwo

var url = new URL(window.location.href);

var page = url.searchParams.get("page");

console.log(page);

if (page == null) {

  $("#insPanelTwo").css("display", "none");
  $("#SelectLang").css("display", "none");
  // $("#btnPrevious").css("display", "none");

}

if(page == "2"){
  $("#insPanelOne").css("display", "none");
  $("#insPanelTwo").css("display", "block");

  // disable btnNext

  $("#btnNext").prop("disabled", false);

  // redirect to assessment page

  $("#btnNext").click(function () {
      
      window.location.href = "Assessment.html";
  
    }
  );

  
}





 

