$(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $(".side-nav .collapse").on("hide.bs.collapse", function() {                   
        $(this).prev().find(".fa").eq(1).removeClass("fa-angle-right").addClass("fa-angle-down");
    });
    $('.side-nav .collapse').on("show.bs.collapse", function() {                        
        $(this).prev().find(".fa").eq(1).removeClass("fa-angle-down").addClass("fa-angle-right");        
    });
}) 


// Open Navigation JS

function openNav() {
    document.getElementById("mobSideNav").style.width = "250px";
    document.getElementById("hambargar").style.display = "none";
    document.getElementById("closeBtn").style.display = "block";
  }
  
  function closeNav() {
    document.getElementById("mobSideNav").style.width = "0";
    document.getElementById("hambargar").style.display = "block";
    document.getElementById("closeBtn").style.display = "none";


  }

  


