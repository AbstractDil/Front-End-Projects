<?php include 'partials/header.php'; ?>

<!-- Main section -->

<main>

  <div class="container-fluid">
    <div class="row">


      <!-- Left Side Bar Starts Here -->

      <div class=" col-md-9">


        <div id="leftSideBar">


          <?php

          $page = $_GET['page'];

          if($page == 2){
            

            ?>

          <div class="panel panel-info panel-instruction">
            <div class="panel-heading bg-info" style="padding:15px">
              <h3 class="panel-title">
                <span class="glyphicon glyphicon-info-sign text-info"></span>
                <strong class="text-info text-uppercase">
                  Other Important Instructions
                </strong>
              </h3>
            </div>

            <div class="panel-body table-responsive ">

              <table class="table">



                <tbody>
                  <tr>
                    <td>


                      <div style="border:1px solid grey; padding:8px;"><span style="color:#e74c3c;"><b>Write the
                            statement given below (either Hindi or English) in the backside of </b><b>Commission Copy in
                            your own running handwriting and put your signature.</b></span>

                        <br>
                        <span style="color:#e74c3c;"><b>नीचे </b><b>लिखे </b><b>वाक्य </b><b>को (</b><b>हिंदी </b><b>या
                          </b><b>अंग्रेजी </b><b>में) </b><b>आयोग </b><b>प्रति </b><b>के </b><b>पीछे </b><b>अपनी
                          </b><b>हस्तलिपि </b><b>में </b><b>लिखें </b><b>और </b><b>अपने </b><b>हस्ताक्षर
                          </b><b>करें</b></span>

                        <hr style="border-bottom:1px solid grey;">



                        <center>

                          <span
                            style="color:#000;font-size:20px;background-color:yellow;text-align:center;"><strong>Tough
                              times don't last, but tough people do.<br> <br> कठिन समय टिकता नहीं है, लेकिन कठिन लोग
                              टिकते हैं।</strong></span>
                        </center>

                      </div>



                    </td>
                  </tr>


                  <tr>
                    <td>
                      <ol style="text-align: left; list-style-type:decimal; padding-left:  4%; padding-top: 3px">
                        <li>
                          The Question Paper is divided into 2 Groups consisting of 2 Sections each. All are objective
                          type (MCQ) questions.
                        </li>

                        <li>
                          The section and other details are given below:
                        </li>
                      </ol>
                    </td>
                  </tr>



                  <tr>

                    <td>

                      <table class="sub-table table-bordered table-striped">

                        <thead>

                          <tr>

                            <th>Group</th>

                            <th>Section</th>

                            <th>Number of Questions</th>

                            <th>Marks per Question</th>

                            <th>Total Marks</th>

                            <th>Duration</th>

                          </tr>

                        </thead>

                        <tbody>

                          <tr>

                            <td rowspan="2">Group 1</td>

                            <td>General Intelligence and Reasoning</td>

                            <td>25</td>

                            <td>1</td>

                            <td>25</td>

                            <td rowspan="2">90 Minutes</td>

                          </tr>

                          <tr>

                            <td>General Awareness</td>

                            <td>25</td>

                            <td>1</td>

                            <td>25</td>

                          </tr>

                          <tr>

                            <td rowspan="2">Group 2</td>

                            <td>Arithmetic</td>

                            <td>25</td>

                            <td>1</td>

                            <td>25</td>

                            <td rowspan="2">90 Minutes</td>

                          </tr>

                          <tr>

                            <td>English Language</td>

                            <td>25</td>

                            <td>1</td>

                            <td>25</td>

                          </tr>

                          <tr>

                            <td colspan="2">Total</td>

                            <td>100</td>

                            <td></td>

                            <td>100</td>

                            <td>180 Minutes</td>

                          </tr>

                        </tbody>

                      </table>


                    </td>

                  </tr>


                  <tr>
                    <td>
                      <ol style="text-align: left; list-style-type:decimal; padding-left:  4%; padding-top: 3px"
                        start="3">
                        <li>

                          <span new="" roman="" style="font-family:" times="">You will be given <b>90 minutes</b>
                            (<b>120 minutes for VH, CP and eligible PwD Candidates)</b>) to attempt <b>90
                              questions.</b></span>
                        </li>


                        <li>

                          <span lang="EN-US" style="font-size:12.0pt"><span new="" roman="" style="font-family:"
                              times="">Both the
                              groups are <b>time bound</b>, duration for each group is <b>45 minutes</b> (<b>60
                                minutes for VH, <span style="background:yellow">CP</span> and eligible PwD
                                Candidates</b>).</span></span>

                        </li>

                        <li>
                          Candidates will have to wait for the complete duration of
                          the group before they move to the next group.
                        </li>

                        <li>
                          There will <b> NOT </b> be any penalty for wrong answers in
                          <b> MTS Group I</b>.
                        </li>

                        <li>
                          There will be a penalty of <b>1 Mark</b> on each wrong answer in <b>
                            MTS Group II
                          </b>.
                        </li>

                        <li>
                          All the Questions have been translated in Hindi, English, Assamese, Bengali, Gujarati,
                          Kannada, Konkani, Malayalam, Manipuri, Marathi, Odia (Oriya), Punjabi, Tamil, Telugu, Urdu for
                          all sections except English Language and Comprehension section.
                        </li>

                        <li>

                          Candidate will only be able to see their Questions in English, Hindi (default languages) and
                          the Third Language (if chosen during application).

                        </li>

                        <li>
                          To see a given question in another language, a candidate can click on the View in drop-down
                          and select the desired language
                        </li>

                        <li>
                          11. One question will be displayed at a time on the screen. Do not spend too much time on any
                          question.
                        </li>

                        <li>
                          Each question will have four options, out of which only one will be the correct answer. Choose
                          the most appropriate answer from the given four options.
                        </li>


                      </ol>
                    </td>
                  </tr>




                </tbody>


              </table>





            </div>





            <?php






          }


          if($page == 1 || $page == ''){
          ?>


            <div class="panel panel-info panel-instruction">
              <div class="panel-heading bg-info" style="padding:15px">
                <h3 class="panel-title">
                  <span class="glyphicon glyphicon-info-sign text-info"></span>
                  <strong class="text-info text-uppercase">
                    Instructions
                  </strong>
                </h3>
              </div>

              <div class="panel-body table-responsive ">

                <table class="table">



                  <tbody>




                    <tr>

                      <td>
                        <center>
                          <font size="5" style="text-transform: capitalize;">Please Read The instructions carefully
                          </font>
                        </center>
                        <h4><strong><u>General Instructions:</u></strong></h4>
                        <ol style="text-align: left; list-style-type:decimal; padding-left:  4%; padding-top: 3px">
                          <li>Total duration of examination is <span class="completeDuration">90</span> minutes.</li>
                          <li>The clock will be set at the server. The countdown timer in the top right corner of screen
                            will display the remaining time available for you to complete the examination. When the
                            timer reaches zero, the examination will end by itself. You will not be required to end or
                            submit your examination.</li>
                          <li>The Question Palette displayed on the right side of screen will show the status of each
                            question using one of the following symbols:


                            <ol style="padding-left:4%;">
                              <li>
                                You have not visited the question yet.
                              </li>
                              <li>
                                You have not answered the question.
                              </li>
                              <li>
                                You have answered the question.
                              </li>
                              <li>
                                You have NOT answered the question, but have marked the question for review.
                              </li>
                              <li>
                                The question(s) "Answered and Marked for Review" will be considered for evaluation.
                              </li>
                              <li>
                                The question(s) "Marked for Review" will be not be considered for evaluation. Hence, no
                                marks will be allocated for the same.
                              </li>

                            </ol>
                          </li>
                          <p style="font-size: 17px;">
                            The Marked for Review status for a question simply indicates that you would like to look at
                            that question again.
                          </p>

                          <li>
                            You can click on the "&gt;" arrow which appears to the left of question palette to collapse
                            the
                            question palette thereby maximizing the question window. To view the question palette again,
                            you
                            can click on "&lt; " which appears on the right side of question window.
                          </li>

                          <li>You can click on your "Profile" image on top right corner of your screen to change the
                            language during the exam for entire question paper. On clicking of Profile image you will
                            get a
                            drop-down to change the question content to the desired language.</li>

                          <li>You can click on <img class="scrollBottom" id="scrollBottom" title="Scroll Down"
                              src="https://g27.digialm.com/OnlineAssessment/images/Down.png"> to navigate to the bottom
                            and <img class="scrollTop" id="scrollTop" title="Scroll Up"
                              src="https://g27.digialm.com/OnlineAssessment/images/Up.png">to navigate to the top of the
                            question area, without
                            scrolling.</li>

                        </ol> <br>

                      </td>

                    </tr>

                    <tr>
                      <td>
                        <h4>
                          <strong><u>Navigating to a Question:</u></strong>

                        </h4>
                        <ol start="7"
                          style="TEXT-ALIGN: left; LIST-STYLE-TYPE: decimal; PADDING-LEFT: 4%; PADDING-TOP: 3px ">
                          <li>To answer a question, do the following: <ol
                              style="TEXT-ALIGN: left; PADDING-LEFT: 4%; PADDING-TOP: 3px " type="a">
                              <li>Click on the question number in the Question Palette at the right of your screen to go
                                to that numbered question directly. Note that using this option does NOT save your
                                answer
                                to the current question.</li>
                              <li>Click on <b>Save &amp; Next</b> to save your answer for the current question and then
                                go
                                to the next question.</li>
                              <li>Click on <b>Mark for Review &amp; Next</b> to save your answer for the current
                                question,
                                mark it for review, and then go to the next question.</li>
                            </ol>
                          </li>
                        </ol>

                      </td>
                    </tr>

                    <tr>
                      <td>

                        <h4> <b><u>Answering a Question : </u></b></h4>
                        <ol start="8"
                          style="TEXT-ALIGN: left; LIST-STYLE-TYPE: decimal; PADDING-LEFT: 4%; PADDING-TOP: 3px ">
                          <li>Procedure for answering a multiple choice type question: <ol
                              style="TEXT-ALIGN: left; PADDING-LEFT: 4%; PADDING-TOP: 3px " type="a">
                              <li>To select your answer, click on the button of one of the options</li>
                              <li>To deselect your chosen answer, click on the button of the chosen option again or
                                click
                                on the <b>Clear Response</b> button</li>
                              <li>To change your chosen answer, click on the button of another option</li>
                              <li>To save your answer, you MUST click on the<b> Save &amp; Next</b> button</li>
                              <li>To mark the question for review, click on the<b> Mark for Review &amp; Next</b>
                                button.
                              </li>
                            </ol>
                          </li>
                        </ol>

                      </td>

                    </tr>

                    <tr>
                      <td>


                        <ol start="9"
                          style="TEXT-ALIGN: left; LIST-STYLE-TYPE: decimal; PADDING-LEFT: 4%; PADDING-TOP: 3px ">
                          <li>To change your answer to a question that has already been answered, first select that
                            question for answering and then follow the procedure for answering that type of question.
                          </li>
                        </ol>
                      </td>

                    </tr>


                    <tr>
                      <td>

                        <h4> <b><u>Navigating through sections:</u></b></h4>
                        <ol start="10"
                          style="TEXT-ALIGN: left; LIST-STYLE-TYPE: decimal; PADDING-LEFT: 4%; PADDING-TOP: 3px ">
                          <li>Sections in this question paper are displayed on the top bar of the screen. Questions in a
                            section can be viewed by clicking on the section name. The section you are currently viewing
                            is highlighted.</li>
                          <li>After clicking the Save &amp; Next button on the last question for a section, you will
                            automatically be taken to the first question of the next section.</li>
                          <li>You can shuffle between sections and questions anytime during the examination as per your
                            convenience only during the time stipulated.</li>
                          <li>Candidate can view the corresponding section summary as part of the legend that appears in
                            every section above the question palette.</li>
                        </ol>

                      </td>
                    </tr>

                    <tr>
                      <td>

                        <h4 class="imageZoom" style="display: none;"><br> <b><u>Instruction for images:</u></b></h4>
                        <ol class="imageZoom" start="14"
                          style="text-align: left; list-style-type: decimal; padding-left: 4%; padding-top: 3px; display: none;">
                          <li>To zoom the image provided in the question roll over it.</li>
                        </ol>
                      </td>
                    </tr>

                  </tbody>



                </table>

                <!-- Show Instructions   Starts-->




                <!-- Show Instructions  Ends-->


              </div>


              <?php



          }



            ?>









            </div>



          </div>





        </div>

        <!-- Left Side Bar Ends Here -->


        <!-- Right Side Bar Starts Here -->


        <div class=" col-md-3">

          <div id="rightSideBar">
            <div class="panel panel-warning panel-details">
              <div class="panel-heading alert-warning" style="padding:15px">
                <h3 class="panel-title">
                  <span class="glyphicon glyphicon-user text-warning"></span>
                  <strong class="text-warning text-uppercase">
                    Candidate Details
                  </strong>
                </h3>
              </div>


              <div class="panel-body">

                <div class="row">
                  <div class="col-sm-12 col-md-12">
                    <div class="text-center" style="margin-top:17px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" class="img-thumbnail" width="95"
                        height="95" alt="Candidate Photo" title="Candidate Photo">
                      <div id="CandidateInfo">
                        <div class="userName" title="Your Name : John Due">
                          Candidate Name :
                          <div class="CandidateName" id="displayCandidateName" title="Your Name : John Due">
                            John Doe
                          </div>
                        </div>
                        <div class="userRollNumber" title="Your Roll No.: 1234567890">
                          Roll No.:

                          <div id="displayRollNumber" class="RollNo" title="Your Roll No.: 1234567890">
                            1234567890
                          </div>

                        </div>
                        <div class="subject">
                          Subject :

                          <div id="displaySubject" class="subjectName"
                            title="Subject : General Intelligence and Reasoning">
                            General Intelligence and Reasoning
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



                </div>


              </div>
              </aside>

            </div>

            <!-- Right Side Bar Starts Here -->


          </div>


          


        </div>

        
      </div>


            <!-- Language Selection -->
<?php

if($page == 2){
  ?>
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">
      
      <strong class="text-info text-uppercase">
        Language Selection
        &amp;
        Declaration 
      </strong>
    </h3>
  </div>
  <div class="panel-body">
  <div  style="padding-left: 15px; overflow: auto; max-height: 120px;font-size:14px;">
				<div id="defaultDisclaimerDiv" style="direction: ltr;">
					<div id="defaultLangOptions" style="margin-top: 10px;">
						<span id="defLang">Choose your default language :</span>
						<select id="defaultLanguage"><option value="0">-- Select --</option><option value="1">English</option><option value="2">Hindi</option><option value="8">Telugu</option></select>
						<br><span class="highlightText" id="multiLangInstru">Please note all questions will appear in your default language. This language can be changed for a particular question later on.</span>
					</div>
					<div class="refdocDivinstru" id="refdocDivinstru" style="display:none;line-height: 16px; margin-bottom: 3px;margin-top:5px; padding-right: 10px; float: right;">
							<span class="instruction_icon"> </span><a class="test-instruct" onclick="showReferenceDocContent(event);"><span id="refdocdownl">Reference Documents</span></a>
						</div>
					<br>
					<div class="" id="highlightDisclaimer" style="line-height:16px;margin-bottom: 0;padding-left: 0;">
					<span class="tb" style="vertical-align: top; float: left;"><input type="checkbox" id="disclaimer" onclick="linkDisp();" style="margin-top:1px;float:left">   </span>
							<span style="width:98%;display:none;margin-left: 1.5em;" id="agreementMessageDef"></span><span style="width: 98%; display: block; margin-left: 1.5em;" id="agreementMessageCustom"><span style="" class="cusInstText1">I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations</span></span>
							<span id="checkBoxEnableMessage" style="display:none;"><br><b>Note : </b>Check box will be enabled in <span id="checkBoxEnableTime"></span></span>
					</div>
					
					<br>
					</div>
				
				</div>
  </div>
</div>

  <?php
}

?>
            <!-- Language Selection  Ends-->


    </div>



</main>
<!-- Main Section Ends -->


</div>


<!-- Next Section  -->

<section class="GoToNext ">

<div style="float:left;">
  <button class="btn btn-default btn-lg  " id="btnPrevious" type="button" 
    onclick="<?php 
    if($page == 1 || $page == ''){
      echo "window.location.href='index.php'";
    } 
    if($page == 2){
      echo "window.location.href='Instruction.php?page=1'";
    }
    ?>">
    <span class="glyphicon glyphicon-chevron-left"></span>
    <b>
      Previous
    </b>
  </button>
</div>

<div class="text-right">

  <button class="btn btn-info btn-lg  " id="btnNext" type="button"

    onclick="<?php 
    if($page == 1 || $page == ''){
      echo "window.location.href='Instruction.php?page=2'";
    } 
    if($page == 2){
      echo "window.location.href='error_msg.php'";
    }
    ?>"

  >
    <b>
      Next
    </b>
    <span class="glyphicon glyphicon-chevron-right"></span>
  </button>
</div>


</section>




<?php include 'partials/footer.php'; ?>