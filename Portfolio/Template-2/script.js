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

  window.open("cv-priya/priya.html");
  }
  else{
    alert("Thank you");
  }



}




// generate skills using javascript

 var skills = ['C','HTML','CSS', 'Javascript', 'Bootstrap', 'Tailwind CSS', 'PHP', 'CodeIgniter','MySQL','Node Js', 'React Js','MongoDB'];

 var skillPercent = [45, 90, 70, 60, 70, 60, 65, 68, 55, 50, 45, 40];

  var skillList = document.getElementById('skillList');

  var skillPercentList = document.getElementById('skillPercentList');

 
  for(var i=0; i<skills.length; i++){
      
      skillList.innerHTML += `

      
      <div class="box">
            <div class="topic">
            `+skills[i]+`
            </div>
            <div class="per">
            `+skillPercent[i]+`%
            </div>
          </div>
  
     
  
      `;
  
    }


    // disbable button 

    document.addEventListener("contextmenu", function(event){
      event.preventDefault()   
      }, false);
      document.onkeydown = function (e) {
    
          // disable F12 key
          if(e.keyCode == 123) 
          {
              return false;
          }
   
          // disable I key
          if(e.ctrlKey && e.shiftKey && e.keyCode == 73){
               
              return false;
          }
   
          // disable J key
          if(e.ctrlKey && e.shiftKey && e.keyCode == 74) {
               
              return false;
          }
   
          // disable U key
          if(e.ctrlKey && e.keyCode == 85) {
    
              return false;
          }
          // disable F3 key
          if(e.ctrlKey  && e.shiftKey && e.keyCode == 114) {
              return false;
          } 
          // disable R key
          if(e.ctrlKey  && e.shiftKey && e.keyCode == 82) {
              
              return false;
          }
          if(e.ctrlKey && e.keyCode == 82) {
              
              return false;
          }
          //f5 disable
          if(e.keyCode == 116) {
      
              return false;
          }
          //A disable 
          if(e.ctrlKey && e.keyCode == 65) {
              
              return false;
          }
          // Copy disable 
          if(e.ctrlKey && e.keyCode == 67) {
              
              return false;
          }

          // ctrl and p disable
          if(e.ctrlKey && e.keyCode == 80) {
                
                return false;
            }
          };
           




