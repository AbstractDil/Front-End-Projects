<!DOCTYPE html>
<html lang="en">

<head>
  <title>
    Instructions
  </title>
  <meta http-equiv="X-UA-Compatible" content="IE=8" />
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
  <!-- Custom Style Css -->
  <link rel="stylesheet" href="assets/css/loginUI.css" />
  <link rel="stylesheet" href="assets/css/Instruction.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <script src="assets/js/main.js?v=<?=time();?>"></script>
</head>

<body>
  <div id="ExamWindow">
    <!-- Navbar Start -->
    <div class="container-fluid">
      <div class="row"  style="padding-top:8px;background-color: aliceblue;padding-bottom: 2px;">
        <div class="col-md-6">

          <div style="font-size: 17px;" >
            <div class="panel-heading show-exam-name">
              <a
              class="text-uppercase"
              href="javascript:void();"
              title="Name of the Examination : Multi Tasking Non Technical Staff and Havaldar CBIC and CBN Examination, 2022"
            >
              <span id="examName">Multi Tasking Non Technical Staff and Havaldar CBIC and CBN Examination, 2022</span>
            </a>
            </div>
          </div>

        </div>


        <div class="col-md-6  " >

          <!-- Show Setting Dropdown button -->
          
          <div class="dropdown pull-right" style="margin-bottom:8px;margin-top:3px">
            <button
              class="btn btn-default btn-lg dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              title="Settings"
            >
              <span class="glyphicon glyphicon-cog"></span>
              Settings
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
              <li>
                <a type="button" onclick="openFullscreen();"
                title="Open Fullscreen"
                >
                  Open Fullscreen
                </a>
              </li>
              <li>
                <a type="button" onclick="closeFullscreen();"
                title="Close Fullscreen"
                >
                  Close Fullscreen
                </a>
              </li>

             
              </ul>
              </div>

        </div>

      </div>
    </div>
    <!-- Navbar ends -->