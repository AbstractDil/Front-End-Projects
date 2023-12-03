<?php include('partials/header.php'); ?>

      <!-- Header section -->

      <section class="jumbotron bg-dark">
        <div class="container-fluid">
          <div class="d-flex justify-content-between" id="examInfo">
            <!-- Info starts here -->

            <!-- system info  -->
            <div class="systemInfo">
              <div id="sysName">System Name :</div>
              <div id="sysNumber">C001</div>
              <div class="msg">
                <a
                  href="javascript:void();"
                  class="fc-white"
                  title="Please contact to the invigilator if the Name and Photograph displayed on the screen is not yours."
                >
                  Please contact to the invigilator if the Name and <br />
                  Photograph displayed on the screen is not yours.
                </a>
              </div>
            </div>

            <!-- userInfo &  -->

            <div class="userInfo">
              <div class="userName" title="Your Name : John Due">
                Candidate Name :
                <div class="CandidateName" id="displayCandidateName" title="Your Name : John Due">
                  John Doe
                </div>
              </div>
              <div class="userRollNumber" title="Your Roll No.: 1234567890">
                Roll No.:

                <div
                  id="displayRollNumber"
                  class="RollNo"
                  title="Your Roll No.: 1234567890"
                >
                  1234567890
                </div>
              </div>
              <div class="subject">
                Subject :

                <div
                  id="displaySubject"
                  class="subjectName"
                  title="Subject : General Intelligence and Reasoning"
                >
                  General Intelligence and Reasoning
                </div>
              </div>
            </div>

            <!-- UserPhoto -->

            <div class="CandidatePhoto">
              Candidate Photo :

              <div class="Candidate_Photo bg-white w-100">
                <!-- <img src="https://students.nandysagar.in/assets/upload/images/IMAGE.jpg" class="img-thumbnail mt-5px" width="95" height="95"  title="Candidate Photo"> -->

                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Candidate Photo"
                  class="img-thumbnail mt-5px"
                  width="95"
                  height="95"
                  title="Candidate Photo"
                />
              </div>

              <!-- Actions -->
            </div>

            <!-- Info ends here -->
          </div>
        </div>
      </section>
      <!-- Header Section Ends -->

      <!-- Login Section -->

      <div class="container login-container">
        <div class="d-flex-center">
          <div class="panel panel-default">
            <div class="panel-heading">
              <strong>Candidate Login</strong>
            </div>
            <div class="panel-body">
              <!-- Login Error Display Starts -->

              <div
                class="alert alert-danger bg-dangeralert-dismissible"
                id="displayError"
                role="alert"
              >
                <button
                  type="button"
                  class="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <strong>**Error:</strong>
                Invalid Roll No. or Password.
              </div>

              <!-- Login Error Display Ends -->

              <form>
                <div class="form-group">
                  <div class="input-group">
                    <span class="input-group-addon"
                      ><i class="glyphicon glyphicon-user"></i
                    ></span>
                    <input
                      id="rollNo"
                      type="number"
                      class="form-control input-lg"
                      name="rollno"
                      placeholder="Enter Roll No."
                      title="Enter Roll No."
                    />
                    <span class="input-group-addon">
                      <img
                        src="assets/images/keyboard.png"
                        alt="KeyboardIcon"
                      />
                    </span>
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <span class="input-group-addon"
                      ><i class="glyphicon glyphicon-lock"></i
                    ></span>
                    <input
                      id="password"
                      type="password"
                      class="form-control input-lg"
                      name="password"
                      title="Enter Password"
                      placeholder="Enter Password"
                    />
                    <span class="input-group-addon">
                      <img
                        src="assets/images/keyboard.png"
                        alt="KeyboardIcon"
                      />
                    </span>
                  </div>
                </div>

                <!-- Starting timer displayed  here -->

                <div class="timer-section">
                  Exam Starting in : <span id="timer">00:00:00</span>
                </div>

                <button
                  type="button"
                  class="btn btn-block btn-lg btn-info mt-5"
                  title="Sign In"
                  onclick="login();"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!--  Cautions Msg -->

      <div class="container" style="margin-top: 20px">
        <div class="d-flex-center">
          <div class="alert alert-warning fs-lead" role="alert" id="cautionMsg">
            <strong>Caution:</strong>
            Your activity is being monitored by Multiple Servillance Systems.
          </div>
        </div>
      </div>

      <!-- Login Section Ends -->
    </div>



<?php include('partials/footer.php'); ?>
