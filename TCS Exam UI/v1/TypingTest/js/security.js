  /* ******************  Right click & Scroll disable Starts ******************** */

    // Disable right click

    document.addEventListener('contextmenu', event => event.preventDefault());

    // Disable right click ends

    // Disable F12

    document.onkeypress = function (event) {
        event = (event || window.event);
        if (event.keyCode == 123) {
            return false;
        }
    }

    document.onmousedown = function (event) {
        event = (event || window.event);
        if (event.keyCode == 123) {
            return false;
        }
    }

    document.onkeydown = function (event) {
        event = (event || window.event);
        if (event.keyCode == 123) {
            return false;
        }
    }

    // Disable F12 ends

    // Disable Ctrl+U

    document.onkeydown = function (e) {
        if (e.ctrlKey &&
            (e.keyCode === 67 ||
                e.keyCode === 86 ||
                e.keyCode === 85 ||
                e.keyCode === 117)) {
            return false;
        } else {
            return true;
        }
    };

    // Disable Ctrl+U ends

    // Disable Ctrl+Shift+I

    document.onkeydown = function (e) {
        if (e.ctrlKey &&
            e.shiftKey &&
            (e.keyCode === 73)) {
            return false;
        } else {
            return true;
        }
    };

    // Disable Ctrl+Shift+I ends

    // Disable Ctrl+S

    document.onkeydown = function (e) {
        if (e.ctrlKey &&
            (e.keyCode === 83)) {
            return false;
        } else {
            return true;
        }
    };

    // Disable Ctrl+S ends

    // Disable Ctrl+Shift+J

    document.onkeydown = function (e) {
        if (e.ctrl &&
            e.shiftKey &&
            (e.keyCode === 74)) {
            return false;
        } else {
            return true;
        }
    };

    // Disable mouse scroll

    document.addEventListener('wheel', function (e) {
        e.preventDefault();

        // show alert message
        
       // alert("Mouse Scroll is disabled");

    var alertMessage = document.getElementById("alertMessage");

        alertMessage.innerHTML = `<div class="alert bg-danger text-white alert-dismissible fade show" role="alert"><strong> <i class=""></i> Warning!</strong> Mouse Scroll is disabled.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">×</span></button></div>`;

    }, {
        passive: false
    });


    // Disable tab key

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    });

    /*
    // disable ctrl+c 

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
        }
    });

    // disbale ctrl + v

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 86) {
            e.preventDefault();
        }
    });
   */

    /* ******************  Right click & Scroll disable Starts ******************** */

   console.log('fuc');