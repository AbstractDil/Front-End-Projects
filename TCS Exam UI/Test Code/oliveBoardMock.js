
	window.onbeforeunload = function (e) {
          pauseTest(0);
	  var e = e || window.event;
	  if (e) {
	    e.returnValue = '';
	  }
	  return "";
	};
        function decryptData(rdata)
        {
          return rdata;
        }
        function encryptData(datatoec)
        {
          return datatoec;
        }
        function doCrypt(etype,rid,panearg)
        {
	  var frun = etype?'decryptData':'encryptData';
          if(panearg)
          {
	    var lpn=$('#leftpane'+rid+' #pane-direction-box').html();
	    $('#leftpane'+rid+' #pane-direction-box').html(window[frun](lpn));
	    var rpn=$('#rightpane'+rid+' #pane-question-box').html();
	    $('#rightpane'+rid+' #pane-question-box').html(window[frun](rpn));      
          }
          else
          {
	    var qn=$('#myquestion'+rid+' #question-box').html();
	    $('#myquestion'+rid+' #question-box').html(window[frun](qn));
          }
	  $('.opn'+rid).each(function(index,element)
	  {
	    var opn=$(element).html();
	    $(element).html(window[frun](opn));
	  });
        }
        function cryptQlist(arg)
        {
          var frun = arg?'decryptData':'encryptData';
          $('.qlistl').each(function(index,element)
          {
            var ql=$(element).html();
            $(element).html(window[frun](ql));
          });
        }
        window.onload=function()
        {
          $('#loader-start-test').css('display','none');
          $('#start-test').css('visibility','visible');
                   };
         
         /*
          0-not visited
          1-visted but not answered
          2-answered the question
          3-not answered but marked
          4-answered and marked
         */
         resp={};
         for(var i=firstQid;i<=lastQid;i++)
         {
           resp[i]={};
           resp[i]['q']=""+i;
           resp[i]['t']=[];
         }
         minst=parseInt((totalTime/60)%60);
         hourt=parseInt(totalTime/3600);
         secst=parseInt(totalTime%60);
         if(minst<10)
         {
           minst="0"+minst;
         }
         if(secst<10)
         {
           secst="0"+secst;
         }
         if(hourt<10)
         {
           hourt="0"+hourt;
         }
         quesStatus = new Array(nq);
         quesAnswer=new Array(nq);
         for(var t=1;t<=nq;t++)
         {
           quesAnswer[t]=0;
         }
         for(var p=1;p<=nq;p++)
         {
           quesStatus[p]=0;
         }
         clr=new Array(nq);
         for(var t=1;t<=nq;t++)
         clr[t]=new Array(noOption);
         for(var i=1;i<=nq;i++)
         for(var j=1;j<=noOption;j++)
         clr[i][j]=0;  
        
         function getSection(qno)
         {
           var secCounter=0;
           for(var i=0;i<secTracker.length;i++)
           {
             secCounter=parseInt(secCounter)+parseInt(secTracker[i]); 
             if(qno<=secCounter)
             {
               return i;
             }     
           }
         }
         function getStartQuestion(sid)
         {
           var sCount=1;
           for(var i=0;i<sid;i++)
           {
             sCount+=parseInt(secTracker[i]);
           }
           return sCount;
         }
         function startTest () 
         {
           var autoSubmitInt = setInterval(function(){pauseTest(0)}, submitInterval);
           $("#start-test").css('display','none');  
           $("#starttestlang").css('display','none');  
           $("#candidate-img-con").css('display','none');
           $("#right-container").css('display','none');
           $("#left-container").css('display','none');
           $("#left-container-post").css('display','block');
           $("#right-container-post").css('display','block');
           if(parseInt(pauseSet))
           {
             timerActivate(ltime);
             questionIdent=parseInt(lqn);
           }
           else
           {
             timerActivate(totalTime);
             questionIdent=firstQid;
             questionIdentPrev=firstQid;
           }
           myDate = hourt+":"+minst+":"+secst;
           myDatep=myDate;
           displayQuestions(questionIdent);
           questStatusCount();
         }

         function timerActivate(totalTime)
         {
           intId=setInterval(function changeTime()
           {
             if(totalTime==0)
             {
               clearInterval(intId);
               sendData();
             }
             minst=parseInt((totalTime/60)%60);
             hourt=parseInt(totalTime/3600);
             secst=parseInt(totalTime%60);
             var newmin = minst+60*hourt;
             if(newmin<10)
             {
               newmin="0"+newmin;
             }
             if(minst<10)
             {
               minst="0"+minst;
             }
             if(secst<10)
             {
               secst="0"+secst;
             }
             if(hourt<10)
             {
               hourt="0"+hourt;
             }
             $("#mins").html(newmin);
             $("#secs").html(secst);
             totalTime-=1;
           }
               ,1000);
         }

         function displayQuestions(ident)
         {
           $("#b1").css('background-color','#C7DCF0');
           $("#b1").css('color','#000');
           $("#b2").css('background-color','#C7DCF0');
           $("#b2").css('color','#000');
           $("#b3").css('background-color','#C7DCF0');
           $("#b3").css('color','#000');
           $("#instructions-onbutton").css('display','none');
           if($('#question-list-onbutton').css('display')!='none')
             cryptQlist(0);
           $("#question-list-onbutton").css('display','none');
           $("#candidate-details-onbutton").css('display','none');
           $("#question-inner-pane").css('display','block');
           $("#button-holder").css('display','block');
           $("#question-no-bar").css('display','block');
           $("#main-back-button").css('display','none');
           $( "span[id^='sec-e']" ).removeClass("currclass");
           $("span[id='sec-e"+getSection(ident-firstQid+1)+"']").addClass("currclass");
           $("#sec-other").html(secShortList[getSection(ident-firstQid+1)]);
           if(questionIdentPrev>0)
           {
             prevElem=$("#myquestion"+questionIdentPrev);
             if(!prevElem.length)
             { 
               if($('#leftpane'+questionIdentPrev).css('display')!='none')
               { 
                doCrypt(0,questionIdentPrev,1);
               }
               $("#leftpane"+questionIdentPrev).css('display','none');
               $("#rightpane"+questionIdentPrev).css('display','none');
             }
             else
             { if($('#myquestion'+questionIdentPrev).css('display')!='none')
               {
               doCrypt(0,questionIdentPrev,0);
               }
               $("#myquestion"+questionIdentPrev).css('display','none');
               $("#myanswer"+questionIdentPrev).css('display','none');
             }
             myDate = hourt+":"+minst+":"+secst;
             if(!pauseSetter)
             {
               if(myDate!=myDatep)
               {
                 var curtime={};
                 curtime['st'] = myDatep;
                 curtime['end'] = myDate;
                 resp[questionIdentPrev]['t'].push(curtime);
               }
               myDatep=myDate;
             }
           }
           var tempo=ident-firstQid+1;
           var scrolltemp=tempo+3;
           var tp=$("#sprite-butts"+scrolltemp);
           if(tp.length)
           {
             tp.get(0).scrollIntoView(false);
           }
           if(quesStatus[tempo]==0)
           {
             $("#sprite-butts"+tempo).css('background-position','0px -136px');
             $("#sprite-butts"+tempo).css('color','#FFF');
             quesStatus[tempo]=1;
           }
           $("#qno-disp").html(tempo);
           var myElem = $("#myquestion"+ident);
           if (!myElem.length)
           {
             doCrypt(1,ident,1);
             $("#leftpane"+ident).css('display','block');
             $("#rightpane"+ident).css('display','block');
           }
           else
           {
             doCrypt(1,ident,0);
             $("#myquestion"+ident).css('display','block');
             $("#myanswer"+ident).css('display','block');
           }
           questionIdent=ident;
           questionIdentPrev=ident;
           questStatusCount();
         }
         function displayQuestionsMark(qIdent)
         {
           if(qIdent==lastQid)
           {
             var anoSec=0;
           }
           else
           {
             var anoSec=qIdent-firstQid+1;
           }
           $( "span[id^='sec-e']" ).removeClass("currclass");
           $("span[id='sec-e"+getSection(anoSec+1)+"']").addClass("currclass");
           $("#sec-other").html(secShortList[getSection(anoSec+1)]);
           var scrolltemp=anoSec+4;
           var tp=$("#sprite-butts"+scrolltemp);
           if(tp.length)
           {
             tp.get(0).scrollIntoView(false);
           }
           var qq=questionIdentPrev-firstQid+1;
           var qanspm=saveSelection();
           quesAnswer[qq]=qanspm; 
           if(quesAnswer[qq]!=0)
           {
             $("#sprite-butts"+qq).css('background-position','0px -350px');
             $("#sprite-butts"+qq).css('color','#FFF');   
             quesStatus[qq]=4;
           }
           else
           {
             $("#sprite-butts"+qq).css('background-position','0px -180px');
             $("#sprite-butts"+qq).css('color','#FFF');
             quesStatus[qq]=3;
           }
           prevElem=$("#myquestion"+questionIdentPrev);
           if(!prevElem.length)
           {
             doCrypt(0,questionIdentPrev,1);
             $("#leftpane"+questionIdentPrev).css('display','none');
             $("#rightpane"+questionIdentPrev).css('display','none');
           }
           else
           {
             doCrypt(0,questionIdentPrev,0);
             $("#myquestion"+questionIdentPrev).css('display','none');
             $("#myanswer"+questionIdentPrev).css('display','none');
           }
           var tempo=questionIdent-firstQid+2;
           if(qIdent==lastQid)
           {
             qqplus=1;
           }
           else
           {
             var qqplus=qq+1;
           }
           var addQuestionIdent=qqplus+firstQid-1;
           if(quesStatus[qqplus]==0)
           {
             $("#sprite-butts"+qqplus).css('background-position','0px -136px');
             $("#sprite-butts"+qqplus).css('color','#FFF');
             quesStatus[qqplus]=1;
           }   
           var myElem = $("#myquestion"+addQuestionIdent);
           if (!myElem.length)
           {
             doCrypt(1,addQuestionIdent,1);
             $("#leftpane"+addQuestionIdent).css('display','block');
             $("#rightpane"+addQuestionIdent).css('display','block');
           }
           else
           {
             doCrypt(1,addQuestionIdent,0);
             $("#myquestion"+addQuestionIdent).css('display','block');
             $("#myanswer"+addQuestionIdent).css('display','block');
           }
           $("#qno-disp").html(qqplus);
           myDate = hourt+":"+minst+":"+secst;
           if(!pauseSetter)
           {
             if(myDate!=myDatep)
             {
               var curtime={};
               curtime['st'] = myDatep;
               curtime['end'] = myDate;
               resp[qIdent]['t'].push(curtime);
             }
             myDatep=myDate;
           }
           questionIdent=addQuestionIdent;
           questionIdentPrev=questionIdent;
           questStatusCount();
         }

         function displayQuestionsSave(qIdent)
         {
           var qansp=saveSelection();
           var antemp=questionIdentPrev-firstQid+1;
           quesAnswer[antemp]=qansp;
           var anoSec=(qIdent-firstQid+1)%nq;
           $( "span[id^='sec-e']" ).removeClass("currclass");
           $("span[id='sec-e"+getSection(anoSec+1)+"']").addClass("currclass");
           $("#sec-other").html(secShortList[getSection(anoSec+1)]);
           var qq=questionIdentPrev-firstQid+1;
           if(quesAnswer[qq]!=0)
           {
             $("#sprite-butts"+qq).css('background-position','0px -264px');
             $("#sprite-butts"+qq).css('color','#FFF');   
             quesStatus[qq]=2;
           }
           prevElem=$("#myquestion"+questionIdentPrev);
           if(!prevElem.length)
           {
             doCrypt(0,questionIdentPrev,1);
             $("#leftpane"+questionIdentPrev).css('display','none');
             $("#rightpane"+questionIdentPrev).css('display','none');
           }
           else
           {
             doCrypt(0,questionIdentPrev,0);
             $("#myquestion"+questionIdentPrev).css('display','none');
             $("#myanswer"+questionIdentPrev).css('display','none');
           }
           var tempo=questionIdent-firstQid+2;
           var scrolltemp=tempo+4;
           var tp=$("#sprite-butts"+scrolltemp);
           if(tp.length)
           {
             tp.get(0).scrollIntoView(false);
           }
           if(qIdent==lastQid)
           {
             var qqplus=1;
           }
           else
           {
             var qqplus=qq+1;
           }
           var addQuestionIdent=qqplus+firstQid-1;
           if(quesStatus[qqplus]==0)
           {
             $("#sprite-butts"+qqplus).css('background-position','0px -136px');
             $("#sprite-butts"+qqplus).css('color','#FFF');
             quesStatus[qqplus]=1;
           }    
           var myElem = $("#myquestion"+addQuestionIdent);
           if (!myElem.length)
           {
             doCrypt(1,addQuestionIdent,1);
             $("#leftpane"+addQuestionIdent).css('display','block');
             $("#rightpane"+addQuestionIdent).css('display','block');
           }
           else
           {
             doCrypt(1,addQuestionIdent,0);
             $("#myquestion"+addQuestionIdent).css('display','block');
             $("#myanswer"+addQuestionIdent).css('display','block');
           }
           $("#qno-disp").html(qqplus);
           myDate =hourt+":"+minst+":"+secst;
           if(!pauseSetter)
           {
             if(myDate!=myDatep)
             {
               var curtime={};
               curtime['st'] = myDatep;
               curtime['end'] = myDate;
               resp[qIdent]['t'].push(curtime);
             }
             myDatep=myDate;
           }
           questionIdent=addQuestionIdent;
           questionIdentPrev=questionIdent;
           questStatusCount();
         }
         function getInstructions()
         {
           $("#b1").css('background-color','#C7DCF0');
           $("#b1").css('color','#000');
           $("#b3").css('background-color','#C7DCF0');
           $("#b3").css('color','#000');
           $("#b2").css('background-color','#2F72B7');
           $("#b2").css('color','#FFF');
           $("#question-inner-pane").css('display','none');
           $("#candidate-details-onbutton").css('display','none');
           if($('#question-list-onbutton').css('display')!='none')
             cryptQlist(0);
           $("#question-list-onbutton").css('display','none');
           var inshtml=$("#instruction-pane-1").html(); 
           $('#instructions-onbutton').html(inshtml);
           $("#instructions-onbutton").css('display','block');
           $("#button-holder").css('display','none');
           $("#main-back-button").css('display','block');
           $("#question-no-bar").css('display','none');
         }
         function getAllBack()
         {

           $("#b1").css('background-color','#C7DCF0');
           $("#b1").css('color','#000');
           $("#b2").css('background-color','#C7DCF0');
           $("#b2").css('color','#000');
           $("#b3").css('background-color','#C7DCF0');
           $("#b3").css('color','#000');
           $("#instructions-onbutton").css('display','none');
           if($('#question-list-onbutton').css('display')!='none')
             cryptQlist(0);
           $("#question-list-onbutton").css('display','none');
           $("#candidate-details-onbutton").css('display','none');
           $("#button-holder").css('display','block');
           $("#main-back-button").css('display','none');
           $("#question-inner-pane").css('display','block');
           $("#question-no-bar").css('display','block'); 
         }

         function getQuestionPaper()
         {
           $("#b2").css('background-color','#C7DCF0');
           $("#b2").css('color','#000');
           $("#b3").css('background-color','#C7DCF0');
           $("#b3").css('color','#000');
           $("#b1").css('background-color','#2F72B7');
           $("#b1").css('color','#FFF');
           $("#question-inner-pane").css('display','none');
           $("#instructions-onbutton").css('display','none');
           $("#candidate-details-onbutton").css('display','none');
           $("#button-holder").css('display','none');
           $("#main-back-button").css('display','block');
           $("#question-no-bar").css('display','none');
           if($('#question-list-onbutton').css('display')!='block')
             cryptQlist(1);
           $("#question-list-onbutton").css('display','block');
         }

         function getCandProfile()
         {
           $("#b1").css('background-color','#C7DCF0');
           $("#b1").css('color','#000');
           $("#b2").css('background-color','#C7DCF0');
           $("#b2").css('color','#000');
           $("#b3").css('background-color','#2F72B7');
           $("#b3").css('color','#FFF');
           if($('#question-list-onbutton').css('display')!='none')
             cryptQlist(0);
           $("#question-list-onbutton").css('display','none');
           $("#question-inner-pane").css('display','none');
           $("#instructions-onbutton").css('display','none');
           $("#button-holder").css('display','none');
           $("#main-back-button").css('display','block');
           $("#question-no-bar").css('display','none');
           $("#candidate-details-onbutton").css('display','block'); 
         }
     
         function finalSubmit()
         {
           $("#b1").css('background-color','#C7DCF0');
           $("#b1").css('color','#000');
           $("#b2").css('background-color','#C7DCF0');
           $("#b2").css('color','#000');
           $("#b3").css('background-color','#C7DCF0');
           $("#b3").css('color','#000');
           myDate = hourt+":"+minst+":"+secst;
           if(myDate!=myDatep)
           {
             var curtime={};
             curtime['st'] = myDatep;
             curtime['end'] = myDate;
             resp[questionIdent]['t'].push(curtime);
           }
           myDatep=myDate;
           $("#question-inner-pane").css('display','none');
           $("#candidate-details-onbutton").css('display','none');
           if($('#question-list-onbutton').css('display')!='none')
             cryptQlist(0);
           $("#question-list-onbutton").css('display','none');
           $("#instructions-onbutton").css('display','none');
           $("#button-holder").css('display','none');
           $("#main-back-button").css('display','none');
           $("#question-no-bar").css('display','none');
           $("#f-tbody").html("");
           for(var i=0;i<nq;i++)
           {
             var secTempName=secList[getSection(i+1)];
             var secName=secList[getSection(i+1)];
             var secNamen=secList[getSection(i+2)];
             var countSec=0;
             for(var p=0;p<nq;p++)
             {
               if(secTempName==secList[getSection(p+1)])
               {
                 countSec++;
               }
             }
             if(secName!=secNamen)
             {
               var dot=getCountStatus(2,secName);
               var dot1=getCountStatus(1,secName);
               var dot2=getCountStatus(3,secName)+getCountStatus(4,secName);
               var dot3=getCountStatus(0,secName);       
               var a=$('<tr></tr>');
               var b=$('<td></td>');
               b.html(secName);
               a.append(b);
               var c=$('<td></td>');
               c.html(countSec);
               a.append(c);
               var d=$('<td></td>');
               d.html(dot);
               a.append(d);
               var e=$('<td></td>');
               e.html(dot1);
               a.append(e);
               var f=$('<td></td>');
               f.html(dot2);
               a.append(f);
               var g=$('<td></td>');
               g.html(dot3);
               a.append(g);
               $("#f-tbody").append(a);
             }
           }
           $("#instruction-pane-1").css('display','none');
           $("#submit-pane").css('display','block');
           $("#sure").css('display','block');
           $("#left-container-post").css('display','none');
           $("#left-container").css('display','block');
           $("#right-container-post").css('display','none');
           $("#right-container").css('display','block');
           $("#candidate-img-con").css('display','block');
         }

         function sBack()
         {
           $("#submit-pane").css('display','none');
           $("#sure").css('display','none');
           $("#left-container-post").css('display','block');
           $("#left-container").css('display','none');
           $("#right-container-post").css('display','block');
           $("#right-container").css('display','none');
           $("#candidate-img-con").css('display','none');
           $("#question-no-bar").css('display','block');
           $("#question-inner-pane").css('display','block');
           $("#button-holder").css('display','block');
         }

         function sendData()
         {
           window.onbeforeunload=null;
           $("#sure").css('display','none');
           $("#plswait").css('display','block');
           completeResp={};
           myDate = hourt+":"+minst+":"+secst;
           if(myDate!=myDatep)
           {
             var curtime={};
             curtime['st'] = myDatep;
             curtime['end'] = myDate;
             resp[questionIdent]['t'].push(curtime);
           }
           myDatep=myDate;
           for(var ip=1;ip<=nq;ip++)
           {
             var t=ip+firstQid-1;
             if(quesAnswer[ip] != 0)
                 resp[t]['o']=""+quesAnswer[ip];
             else
                 resp[t]['o']="";
           }
           for(var i=firstQid;i<=lastQid;i++)
           {
             if(resp[i]['t'].length!=0)
             {
               completeResp[i]=resp[i];
             }
           }
           var finalJson=JSON.stringify(completeResp);
           var params = {};
           params['data']  = finalJson;
           params['uid']  = '';
           params['qpi']  = '1';
           params['ppi']  = '-1';
           params['lang'] = lang;
           params['c'] = 'sscsec';
           params['source'] = "web";
           var url = '/exams/tests/p/submittestfull.cgi';
           $.post(url,params, function(data) {
             if(data){
               window.opener.location.reload();
               window.location = '/exams/solution/?c=sscsec&testid=1&from=test';
             }else{
               alert('Please check if you are connected to internet');
             }
           });
         }

         function clearme(optionNo)
         {
           var optionNo=optionNo;
           var optionB=optionNo-1;
           var radios = $('[name="option'+questionIdent+'"]');      
           var tom=questionIdent-firstQid+1;
           if(clr[tom][optionNo]==0)
           {    
             for(var it=1;it<=5;it++)
             {
               clr[tom][it]=0;
             }
             clr[tom][optionNo]=1;
             radios[optionB].checked=true;
           }
           else
           {  
             clr[tom][optionNo]=0;
             radios[optionB].checked=false;
             if(quesStatus[tom]==2||quesStatus[tom]==4||quesStatus[tom]==3)
             {
               $('#sprite-butts'+tom).css('background-position','0px -136px');
               $("#sprite-butts"+tom).css('color','#FFF');
               quesStatus[tom]=1;
             }
           }
         }

         function clearOption()
         {
           var tom=questionIdent-firstQid+1;
           var getEle = $('[name="option'+questionIdent+'"]');      
           for(var p=0;p<getEle.length;p++)
           {
             if(getEle[p].checked)
             {   
               getEle[p].checked=false;
               quesAnswer[tom]=0;
               for(var to=1;to<=5;to++)
               {
                 clr[tom][to]=0;
               }
             }
           }
           if(quesStatus[tom]==2||quesStatus[tom]==4||quesStatus[tom]==3)
           {
             $('#sprite-butts'+tom).css('background-position','0px -136px');
             $("#sprite-butts"+tom).css('color','#FFF');
             quesStatus[tom]=1;
           }
           questStatusCount();
         }

         function getCountStatus(statusCode,secname)
         {
           var counterStatus=0;
           for(var i=1;i<=nq;i++)
           {
             var k=i-1;
             if(quesStatus[i]==statusCode)
             {
               if(secList[getSection(k+1)]==secname)
               {
                 counterStatus++;
               } 
             }
           }
           return counterStatus;
         }

         function shiftSection(sid)
         {
           var qd=getStartQuestion(sid);
           var quesid=qd+firstQid-1;
           displayQuestions(quesid);
         }

         function nDisplayHoverbox(a,obj)
         {
           var csecname=secList[a];
           $("#hover-con-child").html("<br>"+"&#160&#160&#160&#160&#160&#160"+csecname+""+"<hr class='hrstyle'>");
           var ans=getCountStatus(2,csecname);
           var notAns=getCountStatus(1,csecname);
           var marked=getCountStatus(3,csecname)+getCountStatus(4,csecname);
           var notVisited=getCountStatus(0,csecname);
           var position=getPosition(obj);
           var x=position.x+(obj.clientWidth/2);
           var y=position.y+obj.clientHeight-2;
           $("#hover-con").css('left',x+'px');
           $("#hover-con").css('top',y+'px');
           $("#hover-con").css('display','table');
           $("#answ").html(ans);
           $("#unansw").html(notAns);
           $("#marked").html(marked);
           $("#notvisited").html(notVisited);
         }

        function hideHoverbox()
        {
          $("#hover-con").css('display','none');
        }

        function getPosition(element) 
        {
          var xPosition = 0;
          var yPosition = 0;
          while(element) 
          {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
          }
          return { x: xPosition, y: yPosition };
        }

        function saveSelection()
        {
          var radiob = $('[name="option'+questionIdentPrev+'"]');      
          var qans=0;
          for(var po=0;po<noOption;po++)
          {
            if(radiob[po].checked)
            {
              var qans=po+1;
              return qans;
            }
          }
          return qans;
        }
        
        function pauseTest(parg)
        {
          var purl='/exams/tests/p/save.cgi';
          var cloneResponse =JSON.parse(JSON.stringify(resp));
          if(parg)
          {
             window.onbeforeunload=null;
            $('#dummy-black').show();
            $('#calert').show();
            $('#question-inner-pane').css('opacity','0.1');
            $('#main-container').css('opacity','0.3');
            clearInterval(intId);
            purl='/exams/tests/p/pause.cgi';
          }
          finalresp={};
          completeResp={};
          myDate = hourt+":"+minst+":"+secst;
          if(myDate!=myDatep)
          {
            var curtime={};
            curtime['st'] = myDatep;
            curtime['end'] = myDate;
            cloneResponse[questionIdent]['t'].push(curtime);
          }
          for(var ip=1;ip<=nq;ip++)
          {
            var t=ip+firstQid-1;
            if(quesAnswer[ip] != 0)
                cloneResponse[t]['o']=""+quesAnswer[ip];
            else
                cloneResponse[t]['o']="";
	    cloneResponse[t]['s']=""+quesStatus[ip];
          }
          for(var i=firstQid;i<=lastQid;i++)
          {
            if(cloneResponse[i]['t'].length!=0)
            {
              completeResp[i]=cloneResponse[i];
            }
          }
          finalresp["tdata"]=completeResp;
          finalresp["ltime"]=""+((hourt*3600)+(minst*60)+parseInt(secst));
          finalresp["lqn"]=""+questionIdent;
          var finalJson=JSON.stringify(finalresp);
          var params = {};
          params['data']  = finalJson;
          params['uid']  = '';
          params['qpi']  = '1';
          params['ppi']  = '-1';
          params['c']  = 'sscsec';
          $.post(purl,params, function(data) {
              if(parg)
              {
                  $('#pausetext').html('Test has been paused. You can resume the test by visiting the main test page.');
                  $('#pauseok').html('OK');
              }
          });
        }

        pauseSetter=0;
        if(pauseSet==1)
        {
          lqn='1001';
          ltime='1196';
          resumeData= JSON.parse('{"1001":{"q":"1001","t":[{"st":"00:20:00","end":"00:19:56"}],"o":"","s":"1"}}');
          pauseSetter=1;
          questionIdentPrev=0;
          for(var qindex in resumeData)
          {
            var found = 0;
            if(qindex == '0') continue;
            switch(parseInt(resumeData[qindex]["s"]))
            {
              case 1:
                  displayQuestions(qindex);
                  found = 1;
                      break;
              case 2:
                      $('input:radio[value='+resumeData[qindex]["o"]+'][id=radio'+qindex+']').attr('checked',true);
                      displayQuestions(qindex);
                      displayQuestionsSave(qindex);
                  found = 1;
                      break;
              case 3:
		      displayQuestions(qindex);
		      displayQuestionsMark(qindex);
                  found = 1;
                      break;
              case 4:
                    $('input:radio[value='+resumeData[qindex]["o"]+'][id=radio'+qindex+']').attr('checked', true);
                      displayQuestions(qindex);
                      displayQuestionsMark(qindex);
                  found = 1;
                      break;
            }
            if(found ==0)
            {
                if(resumeData[qindex]["o"] == ""){
                    displayQuestions(qindex);
                }
                else {
                      $('input:radio[value='+resumeData[qindex]["o"]+'][id=radio'+qindex+']').attr('checked',true);
                      displayQuestions(qindex);
                      displayQuestionsSave(qindex);
                }
            }
            var ttake=resumeData[qindex]["t"];
            for(var i in ttake)
            {
              var curtime={};
              curtime['st'] = ttake[i]["st"];
              curtime['end'] = ttake[i]["end"];
              resp[qindex]['t'].push(curtime);
            }
          }
          pauseSetter=0;
        }
        

        $('#dropdownMenu2').on("click", function() {
          $('.lang-dropdown-menu').toggle("show");
        });
        $('.lang-dropdown-menu li').on('click', function(){
            var selected=$(this).text();
            $('.dd-selected-item').html(selected);
            $('.lang-dropdown-menu li').toggle();
            $('.lang-dropdown-menu').hide();
        });


        function changelangstart()
        {
            changelang();
            if(lang == 'eqt')
            {
                $('#defname1').html('English');
                $('#defname2').html('Hindi');
                $('#defname3').html('English');
            }
            else
            {
                $('#defname1').html('Hindi');
                $('#defname2').html('English');
                $('#defname3').html('Hindi');
            }
        }

        function changelang()
        {
            if(lang == 'eqt')
            {
                $('.hqt').show();
                $('.eqt').hide();
                lang = 'hqt';
            }
            else
            {
                $('.hqt').hide();
                $('.eqt').show();
                lang = 'eqt';
            }
        }
        function questStatusCount(){
            var answered = 0 ;
            var notanswered = 0;
            var notvisited = 0;
            var marked = 0;
            for(var i = 0; i < quesStatus.length; i++){
                if(quesStatus[i] == 0){
                    notvisited += 1;
                }else if(quesStatus[i] == 1){
                    notanswered += 1;
                }else if(quesStatus[i] == 2){
                    answered += 1;
                }else if(quesStatus[i] == 3 || quesStatus[i] == 4){
                    marked += 1;
                }
            }
            $('#stic-answered').html(answered);
            $('#stic-notanswered').html(notanswered);
            $('#stic-notvisited').html(notvisited);
            $('#stic-marked').html(marked);
        }
        $(".darr-rightslide").on("click", function(){
            $("#question-outer-pane").animate({
                width:"122%"
            },100);
            $('#right-low-half-outer').hide();
            $(".darr-leftslide").show()
        });
        $(".darr-leftslide").on("click", function(){
            $("#question-outer-pane").animate({
                width:"95%"
            },100);
            $('#right-low-half-outer').show();
            $(this).hide()
        });
           
$( document ).ready(function() {
    var mac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    var isAndroid = /(android)/i.test(navigator.userAgent);

    if ((!mac)&&(!isAndroid)){
        var ctr=0;
        $("#question-inner-pane, .rightpane, .leftpane").bind('mousewheel DOMMouseScroll', function(){
            ctr++;
            if(ctr == 1){
                $(".scrolltooltip").slideDown();
            }
            return false;
        }); 
    }
});

 $("#tclose").on("click", function(){
     $(".scrolltooltip").slideUp();
 });

      