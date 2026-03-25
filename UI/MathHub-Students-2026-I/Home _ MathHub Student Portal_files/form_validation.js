
$(document).ready(function() {

    $('#std_id_check').hide();
   
    $('#password_check').hide();
   
    

 var std_id_error = true;
 
 var password_error = true;
 



// std_id Validation

    $('#std_id').keyup(function() {
        check_std_id();
    });

    function check_std_id() {
        var std_id = $('#std_id').val();

        if (std_id.length == '') {
            $('#std_id_check').show();
            $('#std_id_check').html(" Please enter your Student ID.");
            $('#std_id_check').focus();
            $('#std_id_check').css("color", "red");
            std_id_error = false;
            return false;
        }
        // check regex

        // only alphabets and spaces expression 



        else if (!/^[A-Z0-9 ]+$/.test(std_id)) {
            $('#std_id_check').show();
            $('#std_id_check').html(" Only capital letters and numbers are allowed.");
            $('#std_id_check').focus();
            $('#std_id_check').css("color", "red");
            std_id_error = false;
            return false;
        }
        else if ((std_id.length < 10)) {
            $('#std_id_check').show();
            $('#std_id_check').html("Minimum 10 characters are required");
            $('#std_id_check').focus();
            $('#std_id_check').css("color", "red");
            std_id_error = false;
            return false;
        }
        else if((std_id.length > 10)) {
            $('#std_id_check').show();
            $('#std_id_check').html(" Length of Student ID is too long.");
            $('#std_id_check').focus();
            $('#std_id_check').css("color", "red");
            std_id_error = false;
            return false;

        }
        else {
            $('#std_id_check').hide();
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
            $('#password_check').html(" Please enter your password.");
            $('#password_check').focus();
            $('#password_check').css("color", "red");
            password_error = false;
            return false;
        } 
        // check regex
        else if (!/^[a-zA-Z0-9._-]+$/.test(password)) {
            $('#password_check').show();
            $('#password_check').html(" Only alphabets and numbers  are allowed.");
            $('#password_check').focus();
            $('#password_check').css("color", "red");
            password_error = false;
            return false;
        }
        else if ((password.length < 6)) {
            $('#password_check').show();
            $('#password_check').html("Minimum 6 characters are required.");
            $('#password_check').focus();
            $('#password_check').css("color", "red");
            password_error = false;
            return false;
        }
        else if((password.length > 20)) {
            $('#password_check').show();
            $('#password_check').html(" Length of password is too long.");
            $('#password_check').focus();
            $('#password_check').css("color", "red");
            password_error = false;
            return false;

        }
        else {
            $('#password_check').hide();
        }
    }





    // Login Button

    $('#LoginBtn').click(function() {
        std_id_error = true;
        password_error = true;

        check_std_id();
        check_password();

        if ((std_id_error == true) && (password_error == true)) {
            return true;
        } else {
            return false;
        }

    });


}); 