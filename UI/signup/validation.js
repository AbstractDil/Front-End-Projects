$(document).ready(function() {

    $('#fname_check').hide();
    $('#lname_check').hide();
    $('#email_check').hide();
    $('#password_check').hide();
    $('#confirm_password_check').hide();
    $('#disclaimer_check').hide();

    

 var fname_error = true;
 var lname_error = true;
 var email_error = true;
 var password_error = true;
 var confirm_password_error = true;
 var disclaimer_error = true;



// fname Validation

    $('#fname').keyup(function() {
        check_fname();
    });

    function check_fname() {
        var fname = $('#fname').val();

        if (fname.length == '') {
            $('#fname_check').show();
            $('#fname_check').html("Error: Please enter your firstname.");
            $('#fname_check').focus();
            $('#fname_check').css("color", "red");
            fname_error = false;
            return false;
        }
        // check regex

        // only alphabets and spaces expression 



        else if (!/^[a-zA-Z ]+$/.test(fname)) {
            $('#fname_check').show();
            $('#fname_check').html("Error: Only alphabets are allowed.");
            $('#fname_check').focus();
            $('#fname_check').css("color", "red");
            fname_error = false;
            return false;
        }
        else if ((fname.length < 5)) {
            $('#fname_check').show();
            $('#fname_check').html("Error: Minimum 5 characters are required.");
            $('#fname_check').focus();
            $('#fname_check').css("color", "red");
            fname_error = false;
            return false;
        }
        else if((fname.length > 30)) {
            $('#fname_check').show();
            $('#fname_check').html("Error: Maximum 20 characters are allowed.");
            $('#fname_check').focus();
            $('#fname_check').css("color", "red");
            fname_error = false;
            return false;

        }
        else {
            $('#fname_check').hide();
        }
    }


    // lname Validation

    $('#lname').keyup(function() {
        check_lname();
    });

    function check_lname(){
        var lname = $('#lname').val();

        if (lname.length == '') {
            $('#lname_check').show();
            $('#lname_check').html("Error: Please enter your lastname.");
            $('#lname_check').focus();
            $('#lname_check').css("color", "red");
            lname_error = false;
            return false;
        }
        // check regex

        // only alphabets and spaces expression 



        else if (!/^[a-zA-Z ]+$/.test(lname)) {
            $('#lname_check').show();
            $('#lname_check').html("Error: Only alphabets are allowed.");
            $('#lname_check').focus();
            $('#lname_check').css("color", "red");
            lname_error = false;
            return false;
        }
        else if ((lname.length < 3)) {
            $('#lname_check').show();
            $('#lname_check').html("Error: Minimum 3 characters are required.");
            $('#lname_check').focus();
            $('#lname_check').css("color", "red");
            lname_error = false;
            return false;
        }
        else if((lname.length > 30)) {
            $('#lname_check').show();
            $('#lname_check').html("Error: Maximum 20 characters are allowed.");
            $('#lname_check').focus();
            $('#lname_check').css("color", "red");
            lname_error = false;
            return false;

        }
        else {
            $('#lname_check').hide();
        }
    }



// Email Validation

    $('#email').keyup(function() {
        check_email();
    });

    function check_email() {
        var email = $('#email').val();
        
        if (email.length == '') {
            $('#email_check').show();
            $('#email_check').html("Error: Please enter your email.");
            $('#email_check').focus();
            $('#email_check').css("color", "red");
            email_error = false;
            return false;
        } 
        // check regex
        else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
            $('#email_check').show();
            $('#email_check').html("Error: Invalid email.");
            $('#email_check').focus();
            $('#email_check').css("color", "red");
            email_error = false;
            return false;
        }
        else if ((email.length < 12)) {
            $('#email_check').show();
            $('#email_check').html("Error: Length of email is too short.");
            $('#email_check').focus();
            $('#email_check').css("color", "red");
            email_error = false;
            return false;
        }
        else if((email.length > 40)) {
            $('#email_check').show();
            $('#email_check').html("Error: Length of email is too long.");
            $('#email_check').focus();
            $('#email_check').css("color", "red");
            email_error = false;
            return false;

        }
        else {
             
            
            $('#email_check').hide();
           
        }
    }

// Password Validation


    $('#password').keyup(function() {
        check_password();
    });

    function check_password() {


        var password = $('#password').val();
        
        if (password.length == '') {
            $('#password_check').show();
            $('#password_check').html("Error: Please enter your password.");
            $('#password_check').focus();
            $('#password_check').css("color", "red");
            password_error = false;
            return false;
        } 
        // check regex
        else if (!/^[a-zA-Z0-9@#$%&]*$/.test(password)) {
            $('#password_check').show();
            $('#password_check').html("Error: Only alphanumeric characters and @,#,$,%,& characters are allowed!");
            $('#password_check').focus();
            $('#password_check').css("color", "red");
            password_error = false;
            return false;
        }
        else if ((password.length < 6)) {
            $('#password_check').show();
            $('#password_check').html("Error: Minimum 6 characters are required.");
            $('#password_check').focus();
            $('#password_check').css("color", "red");
            password_error = false;
            return false;
        }
        else if((password.length > 20)) {
            $('#password_check').show();
            $('#password_check').html("Error: Length of password is too long.");
            $('#password_check').focus();
            $('#password_check').css("color", "red");
            password_error = false;
            return false;

        }
        else {
            $('#password_check').hide();
        }
    }

// Confirm Password Validation

    $('#confirm_password').keyup(function() {
        check_confirm_password();
    }
    );

    function check_confirm_password() {
        var password = $('#password').val();
        var confirm_password = $('#confirm_password').val();
        
        if (confirm_password.length == '') {
            $('#confirm_password_check').show();
            $('#confirm_password_check').html("Error: Please enter your confirm password.");
            $('#confirm_password_check').focus();
            $('#confirm_password_check').css("color", "red");
            confirm_password_error = false;
            return false;
        } 
        // check regex
        else if (!/^[a-zA-Z0-9@#$%&]*$/.test(confirm_password)) {
            $('#confirm_password_check').show();
            $('#confirm_password_check').html("Error: Only alphanumeric characters and @,#,$,%,& characters are allowed!");
            $('#confirm_password_check').focus();
            $('#confirm_password_check').css("color", "red");
            confirm_password_error = false;
            return false;
        }
        else if ((confirm_password.length < 6)) {
            $('#confirm_password_check').show();
            
            $('#confirm_password_check').html("Error: Minimum 6 characters are required.");
            $('#confirm_password_check').focus();
            $('#confirm_password_check').css("color", "red");
            confirm_password_error = false;
            return false;
        }
        else if((confirm_password.length > 20)) {
            $('#confirm_password_check').show();
            $('#confirm_password_check').html("Error: Length of password is too long.");
            $('#confirm_password_check').focus();
            $('#confirm_password_check').css("color", "red");
            confirm_password_error = false;
            return false;

        }
        else if(password != confirm_password) {
            $('#confirm_password_check').show();
            $('#confirm_password_check').html("Error: Password and Confirm Password do not match.");
            $('#confirm_password_check').focus();
            $('#confirm_password_check').css("color", "red");
            confirm_password_error = false;
            return false;
        }
        else {
            $('#confirm_password_check').hide();
        }
    }



    // disclaimer validation

    $('#disclaimer').keyup(function() {
        check_disclaimer();
    }
    );

    function check_disclaimer() {
        
        if (!$('#disclaimer').prop('checked')) {
            $('#disclaimer_check').show();
            $('#disclaimer_check').html("Error: Please check the disclaimer.");
            $('#disclaimer_check').focus();
            $('#disclaimer_check').css("color", "red");
            disclaimer_error = false;
            return false;
        } 
      
     
        else {
            $('#disclaimer_check').hide();
        }
    }


// Register Button

    $('#RegisterBtn').click(function() {
        fname_error = true;
        lname_error = true;
        email_error = true;
        password_error = true;
        confirm_password_error = true;
        disclaimer_error = true;


        check_fname();
        check_lname();
        check_email();
        check_password();
        check_confirm_password();
        check_disclaimer();

        var fname = $('#fname').val();
        var lname = $('#lname').val();
        
        // Concatenate fname and lname to create the username
        var username = fname + lname;

        // Set the username value in the hidden input field
        $('#username').val(username);

        if ((fname_error == true )&&(lname_error == true )&&(email_error == true) && (password_error == true) && (confirm_password_error == true)&&(disclaimer_error == true)) {
            return true;

        } else {
            return false;
        }

    });

    // Login Button

    $('#LoginBtn').click(function() {
        email_error = true;
        password_error = true;

        check_email();
        check_password();

        if ((email_error == true) && (password_error == true)) {
            return true;
        } else {
            return false;
        }

    });


}); 
