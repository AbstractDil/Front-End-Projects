// Sticky Navigation Menu JS Code
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");
console.log(scrollBtn);
let val;
window.onscroll = function() {
  if(document.documentElement.scrollTop > 20){
    nav.classList.add("sticky");
    scrollBtn.style.display = "block";
  }else{
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }

}

// Side NavIgation Menu JS Code
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");
menuBtn.onclick = function(){
  navBar.classList.add("active");
  menuBtn.style.opacity = "0";
  menuBtn.style.pointerEvents = "none";
  body.style.overflow = "hidden";
  scrollBtn.style.pointerEvents = "none";
}
cancelBtn.onclick = function(){
  navBar.classList.remove("active");
  menuBtn.style.opacity = "1";
  menuBtn.style.pointerEvents = "auto";
  body.style.overflow = "auto";
  scrollBtn.style.pointerEvents = "auto";
}

// Side Navigation Bar Close While We Click On Navigation Links
let navLinks = document.querySelectorAll(".menu li a");
for (var i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click" , function() {
    navBar.classList.remove("active");
    menuBtn.style.opacity = "1";
    menuBtn.style.pointerEvents = "auto";
  });
}

// typing text animation script

var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
  this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
  this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
  delta = this.period;
  this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
  this.isDeleting = false;
  this.loopNum++;
  delta = 500;
  }

  setTimeout(function() {
  that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('typewrite');
  for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #0c5f80}";
  document.body.appendChild(css);
};


// cv link 

function myCV(){
  
  var myAsk =  confirm("Do you want to download my CV?");


  if(myAsk == true){

  window.open("cv/priya.html");
  }
  else{
    alert("Thank you");
  }



}

// show year

var d = new Date();
var n = d.getFullYear();
document.getElementById("showYear").innerHTML = n;



// home page url 

function homePageUrl(){
  // get current url
  var currentUrl = window.location.href;

  // redirect to current url

  window.location.href = currentUrl;

}



// Add ClientName and PoweredBy in the url automatically

if(window.location.href.indexOf('?') == -1) {

  var url = window.location.href;
  var newUrl = url + '?ClientName=PriyaBidyanta&PoweredBy=nandysagar.in';
  window.history.pushState('data', 'Title', newUrl);
  console.log(newUrl);
  }
  
  
  // if url is not get any parameter then it will redirect to home page
  
  
  
  if(window.location.href.indexOf('?') == -1) {
      window.location.href = 'index.html';
  }
  
  //get the parameter from url
  
  var url = new URL(window.location.href);
  var isOrg = url.searchParams.get("ClientName");
  
  // get parameter from url after & symbol
  
  var isPoweredBy = url.searchParams.get("PoweredBy");
  
  
  
  //if parameter is not equal to the value then it will redirect to home page
  
  if(isOrg != 'PriyaBidyanta' || isPoweredBy != 'nandysagar.in') {
      
      alert('You have entered wrong url.');
      window.location.href = 'error_url.html';
     
  
  }
  

