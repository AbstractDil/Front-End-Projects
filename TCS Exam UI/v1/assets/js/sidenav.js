 // New Side Navigation Panel
   
 var sidenav = document.getElementById("mySidenav");
   
 var saveNextBtn = document.getElementById("saveNext");

 function toggleNav() {
           /*
     if (sidenav.style.width === "320px" || sidenav.style.width === "") {
       sidenav.style.width = "0";
     } else {
       sidenav.style.width = "320px";
     }*/

   sidenav.classList.toggle("sidenav-active");
   saveNextBtn.classList.toggle("save-next-btn-show-right");
 }



      /* Old Right Sidenav */
      /*
      $(document).ready(function () {
        $(".sidebar-toggle").on("click", function () {
          $(".collapse-sidebar").toggleClass("collapsed");
        });
      });

      $("#secReasoningQuestions a").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
      });
      */