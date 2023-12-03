var vKeyboard = {
	layout : [{"id":1,"name":"numericLayout"},{"id":2,"name":"alphaNumericLayout"}], // 0 - numeric ; 1 - alphanumeric
	numericLayout : [
		[["Backspace"]],
		[["7"], ["8"], ["9"]], 
		[["4"], ["5"], ["6"]], 
		[["1"], ["2"], ["3"]], 
		[["0"], ["."], ["-"]],
		[["&#x2190;"],["&#x2192;"]],
		[["Clear All"]]
	],
	alphaNumericLayout : [
		[
			[["1"],["2"],["3"],["4"],["5"],["6"],["7"],["8"],["9"],["0"]],
			[["q"],["w"],["e"],["r"],["t"],["y"],["u"],["i"],["o"],["p"]],
			[["a"],["s"],["d"],["f"],["g"],["h"],["j"],["k"],["l"]],
			[["z"],["x"],["c"],["v"],["b"],["n"],["m"],["."],["-"],["+"]],
			[["Space"],["Clear All"]],
			[["Backspace"],["Caps Lock"],["Shift"],["&#x2190;"],["&#x2192;"]]
		],
		[
			[["1"],["2"],["3"],["4"],["5"],["6"],["7"],["8"],["9"],["0"]],
			[["Q"],["W"],["E"],["R"],["T"],["Y"],["U"],["I"],["O"],["P"]],
			[["A"],["S"],["D"],["F"],["G"],["H"],["J"],["K"],["L"]],
			[["Z"],["X"],["C"],["V"],["B"],["N"],["M"],["."],["-"],["+"]],
			[["Space"],["Clear All"]],
			[["Backspace"],["Caps Lock"],["Shift"],["&#x2190;"],["&#x2192;"]]
		]
	],
	selectedKeyboard : '',
	saTypeQuesID:'',
	allowedChars : new Array("+","-"),
	splKeys : new Array("Caps Lock","Shift","&#x2192;","&#x2190;","Backspace","Space","Clear All"),
	capsBn : false,
	shiftBn : false,
	InsertionS : 0,
	keyProceed : true
};

function triggerKeyboard(type,isQuesMand){
	// Numeric Keyboard
	if(type==1){
		vKeyboard.saTypeQuesID = $('input[type="text"]').attr("id");
		var answerText = '<div id="vKeyboard" class="vKeyboard ';
		if(isQuesMand=="true")
			answerText +=' SAmandatoryClass';
		answerText+='">'+getHTMLVirtualKeyboard(type)+'</div>';
		$('#answer').after(answerText);
		$("#vKeyboard").width("135px");
	}
	// Alphanumeric Keyboard
/*	else if (type==2){
		$("#vKeyboard").width("350px");
	}*/
//	$("#vKeyboard").height("170px");
	bindOnClicks();
}
function triggerKeyboardGroup(type,quesId,isQuesMand){
	// Numeric Keyboard
	if(type==1){
		vKeyboard.saTypeQuesID = "answer"+quesId;
		var answerText= '<div id="vKeyboard'+quesId+'" class="vKeyboard';
		if(isQuesMand=="true")
			answerText +=' SAmandatoryClass';
		answerText+='">'+getHTMLVirtualKeyboard(type)+'</div>';
		$('#answer'+quesId).after(answerText);
		$("#vKeyboard"+quesId).width("135px");
	}
	// Alphanumeric Keyboard
/*	else if (type==2){
		$("#vKeyboard").width("350px");
	}*/
//	$("#vKeyboard").height("170px");
	bindOnClicks();
}

function getHTMLVirtualKeyboard(type){
	var str='';
	for(var i=0;i<vKeyboard.layout.length;i++){
		if(vKeyboard.layout[i].id==type){
			vKeyboard.selectedKeyboard = vKeyboard.layout[i].id;
			str += LayoutHTML(vKeyboard.layout[i].name);
			break;
		}
	}
	return str;
}


/***************************************************Fill Layout****************************************************************/
function LayoutHTML(type){
	var str ='';
	if(type == 'numericLayout'){
		for(var i=0;i<vKeyboard.numericLayout.length;i++){
			for(var j=0;j<vKeyboard.numericLayout[i].length;j++){
				//str+='<input type="button" class="vKeyboardKeys" value="'+vKeyboard.numericLayout[i][j]+'"/>';
				for(var k=0; k<vKeyboard.splKeys.length ; k++){
					if(vKeyboard.numericLayout[i][j] == vKeyboard.splKeys[k]){
						str +='<span class="vKeyboardSplKeys"';
						if(vKeyboard.numericLayout[i][j]=='&#x2190;')
							str += ' data="left" style="font-weight:normal"';
						if(vKeyboard.numericLayout[i][j]=='&#x2192;')
							str += ' data="right" style="font-weight:normal"';
						str +=">";
						str += vKeyboard.numericLayout[i][j];
						str += "</span>";
						splKeyFlag = true;
						break;
					}
				}
				if(!splKeyFlag){
					str+='<span class="vKeyboardKeys">'+vKeyboard.numericLayout[i][j]+'</span>';
				}
				splKeyFlag = false;
			}
			str+="<br/>";
		}
	}else if (type == 'alphaNumericLayout'){
		var splKeyFlag = false;
		var shiftKeys = (vKeyboard.shiftBn || vKeyboard.capsBn)? 1:0;
		//console.log(shiftKeys);
		for(var i=0;i<vKeyboard.alphaNumericLayout[shiftKeys].length;i++){
			for(var j=0;j<vKeyboard.alphaNumericLayout[shiftKeys][i].length;j++){
				for(var k=0; k<vKeyboard.splKeys.length ; k++){
					if(vKeyboard.alphaNumericLayout[shiftKeys][i][j] == vKeyboard.splKeys[k]){
						str +='<span class="vKeyboardSplKeys';
						if(vKeyboard.alphaNumericLayout[shiftKeys][i][j]=='Space' || vKeyboard.alphaNumericLayout[shiftKeys][i][j]=='Clear All' )
							str += ' space"';
						else
							str += '"';
						if(vKeyboard.alphaNumericLayout[shiftKeys][i][j]=='&#x2190;')
							str += '" data="left"';
						if(vKeyboard.alphaNumericLayout[shiftKeys][i][j]=='&#x2192;')
							str += '" data="right"';
						str += ">";
						str += vKeyboard.alphaNumericLayout[shiftKeys][i][j];
						str +="</span>";
						splKeyFlag = true;
						break;
					}
				}
				if(!splKeyFlag){
					str+='<span class="vKeyboardKeys">'+vKeyboard.alphaNumericLayout[shiftKeys][i][j]+'</span>';
				}
				splKeyFlag = false;
			}
			str+="<br/>";
		}
		
	}

	return str;
}

function setCursorPostion(){
	$("#"+vKeyboard.saTypeQuesID).caret({
		start: vKeyboard.InsertionS,
		end: vKeyboard.InsertionS
	});
}

function validateAndFill(text){
	if(vKeyboard.selectedKeyboard == 1){
		var previousText = $("#"+vKeyboard.saTypeQuesID).val();
		if(vKeyboard.InsertionS <= previousText.length){
			var newStr = previousText.substring(0,vKeyboard.InsertionS)+text+ previousText.substring(vKeyboard.InsertionS, previousText.length);
			if(numPadValidate(newStr)){
				$("#"+vKeyboard.saTypeQuesID).val(newStr);
				vKeyboard.InsertionS++;
			}
		}else{
			if(numPadValidate(previousText+text)){
				$("#"+vKeyboard.saTypeQuesID).val($("#"+vKeyboard.saTypeQuesID).val()+text);
				vKeyboard.InsertionS = $("#"+vKeyboard.saTypeQuesID).val().length;
				//SetCaretAtEnd(document.getElementById(vKeyboard.saTypeQuesID));
			}
		}
		
	}else if(vKeyboard.selectedKeyboard == 2 ){
		var previousText = $("#"+vKeyboard.saTypeQuesID).val();
		if(vKeyboard.InsertionS <= previousText.length){
			$("#"+vKeyboard.saTypeQuesID).val(previousText.substring(0,vKeyboard.InsertionS)+text+ previousText.substring(vKeyboard.InsertionS, previousText.length));
			vKeyboard.InsertionS++;
		}
		else{
			$("#"+vKeyboard.saTypeQuesID).val($("#"+vKeyboard.saTypeQuesID).val()+text);
			vKeyboard.InsertionS = $("#"+vKeyboard.saTypeQuesID).val().length;
			//SetCaretAtEnd(document.getElementById(vKeyboard.saTypeQuesID));
		}
	}
	setCursorPostion();
}
