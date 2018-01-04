var SC_LENGTH = 2;
var lastANS;
var typedSequence = "";
var typingDisplay, answerDisplay;
var currentInput = "";
var decimalRegex = /([\×\+\-\÷]\w*)$/; //if this is true, allow decimal
var decimalRegex2 = /^\w*[.]/; //if this is false, allow decimal
//lets input functions know to concat their inputs on to what is now the answer
var clearWithNextButton = false;
var operators = ['×','÷','+','-','%'];
var operatorsMap = new Map([['×','*'],['÷','/'],['ln','log'],['π','pi'],['√','sqrt']]);
var kbSC = {
    "sq":".sqrt-button",
    "pi":".pi-button",
    "si":".sin-button",
    "co":".cos-button",
    "ta":".tan-button",
    "as":".asin-button",
    "ac":".acos-button",
    "at":".atan-button",
    "ln":".ln-button",
    "lo":".log-button",
    "fl":".floor-button",
    "cl":".ceil-button",
    "ab":".abs-button"
};

$(document).ready(function() {
    typingDisplay = document.getElementsByClassName("currently-typing")[0];
    answerDisplay = document.getElementsByClassName("display-answer")[0];

    //#region handle number button click events
    $(".zero").click(function() {
        if(currentInput!="") {
            inputNumber("0");
        }
    });
    $(".one").click(function() {
        inputNumber("1");
    });
    $(".two").click(function() {
        inputNumber("2");
    });
    $(".three").click(function() {
        inputNumber("3");
    });
    $(".four").click(function() {
        inputNumber("4");
    });
    $(".five").click(function() {
        inputNumber("5");
    });
    $(".six").click(function() {
        inputNumber("6");
    });
    $(".seven").click(function() {
        inputNumber("7");
    });
    $(".eight").click(function() {
        inputNumber("8");
    });
    $(".nine").click(function() {
        inputNumber("9");
    });
    //#endregion

    //#region C and DEL
    $(".clear-button").click(function() {
        currentInput="";
        $(answerDisplay).text("");
        clearWithNextButton=false;
        updateTypingDisplay();
    });
    $(".back-button").click(function() {
        currentInput = currentInput.substring(0,currentInput.length-1);
        updateTypingDisplay();
    });
    //#endregion

    //#region operators and .
    $(".multiply-button").click(function() {
        inputOperator("×");
    });
    $(".divide-button").click(function() {
        inputOperator("÷");
    });
    $(".add-button").click(function() {
        inputOperator("+");
    });
    $(".subtract-button").click(function() {
        inputOperator("-");
    });
    $(".decimal-button").click(function() {
        if(clearWithNextButton) {
            currentInput="";
            clearWithNextButton=false;
        }
        if(currentInput=="" || (!/\.(?:.(?!\.))\w*$/.test(currentInput)&&currentInput[currentInput.length-1]!=".")) {
            currentInput+=".";
        }
        updateTypingDisplay();
    });
    //#endregion

    //#region equals button
    $(".equals-button").click(function() {
        //!clearWithNextButton makes it so that the user can't keep pressing equals
        if(!clearWithNextButton && currentInput!="") {
            currentInput+="=";
            updateTypingDisplay();
            var parsedInput = currentInput;
            operatorsMap.forEach(function(v,k) {
                //replace display symbols with computer arithmetic symbols
                var regexTest = new RegExp(k,"g");
                parsedInput = parsedInput.replace(regexTest,v);
            });
            //remove equals sign
            parsedInput = parsedInput.slice(0,-1);
            //check for unmatched open brackets and match them
            var numUnmatchedBrackets;
            if(/\(/.test(parsedInput) && !(/\)/.test(parsedInput))) {
                numUnmatchedBrackets = parsedInput.match(/\(/g).length;
            } else if(/\(/.test(parsedInput) && /\)/.test(parsedInput)) {
                numUnmatchedBrackets = parsedInput.match(/\(/g).length -parsedInput.match(/\)/g).length;
            }
            console.log(numUnmatchedBrackets);
            for(var u = 0; u < numUnmatchedBrackets; u++) {
                parsedInput+=")";
                console.log(parsedInput);
            }
            //log base 10 done separately (requires regex group)
            if(/log\(.*\)/.test(parsedInput)) {
                parsedInput = parsedInput.replace(/log\((.*)\)/,'log($1,10)');
            }
            //initialise variable to be displayed
            var currentAnswer;  
            console.log(parsedInput);
            try {
                currentAnswer = (math.round(math.eval(parsedInput),6));
            } catch(exception) {
                //user bad input
                console.log(exception);
                currentAnswer = "Error";
            }
            //math.round doesn't handle large/(small) numbers in exponential form 
            if(/e/.test(currentAnswer)) {
                currentAnswer = currentAnswer.toPrecision(7);
            }
            $(answerDisplay).text(currentAnswer);
            lastANS=currentAnswer;
            clearWithNextButton=true;
        }
    });
    //#endregion

    //#region handle key presses
    $(window).keyup(function(e) {
        switch(e.keyCode) {
            case 46: $(".back-button").click(); break;
            case 48: 
                if(e.shiftKey===true) {
                    $(".rp-button").click();
                } else {
                    $(".zero").click();
                } break;
            case 49: 
                if(e.shiftKey===true) {
                    $(".fact-button").click();
                } else {
                    $(".one").click();
                } break;
            case 50: $(".two").click(); break;
            case 51: $(".three").click(); break;
            case 52: $(".four").click(); break;
            case 53: 
                if(e.shiftKey===true) {
                    $(".mod-button").click();
                } else {
                    $(".five").click();
                } break;
            case 54: 
                if(e.shiftKey===true) {
                    $(".exp-button").click();
                } else {
                    $(".six").click();
                } break;
            case 55: $(".seven").click(); break;
            case 56: 
                if(e.shiftKey===true) {
                    $(".multiply-button").click();
                } else {
                    $(".eight").click();
                } break;
            case 57: 
                if(e.shiftKey===true) {
                    $(".lp-button").click();
                } else {
                    $(".nine").click();
                } break;
            case 69: $(".e-button").click(); break;
            case 187:
                if(e.shiftKey===true) {
                    $(".add-button").click();
                } else {
                    $(".equals-button").click();
                } break;
            case 189: $(".subtract-button").click(); break;
            case 190: $(".decimal-button").click(); break;
            case 191: $(".divide-button").click(); break;
            case 13: $(".equals-button").click(); break;
            case 27: $(".clear-button").click(); break;
            case 8: $(".back-button").click(); break;
            default: break;
        }
        //keeps track of last two characters typed... works..
        var justTyped = String.fromCharCode(e.keyCode);
        typedSequence+=justTyped.toLowerCase();
        if(typedSequence.length>SC_LENGTH) {
            typedSequence=typedSequence.slice(1);
        }
        console.log(typedSequence);
        if(kbSC[typedSequence]) {
            $(kbSC[typedSequence]).click();
        }
    });
    //#endregion

    //#region handle drawer open and buttons

    $(".drawer-handle").click(function() {
        if($(".drawer-area").css("top")=='420px') {
            $(".drawer-area").css("top",'0');
        } else {
            $(".drawer-area").css("top",'420px');
        }
    });

    //#region scientific buttons
    $(".fact-button").click(function() {
        //not an operator but..
        inputOperator("!");
    });
    $(".exp-button").click(function() {
        inputOperator("^");
    });
    $(".sqrt-button").click(function() {
        inputFunc("√");
    });
    $(".pi-button").click(function() {
        inputNumber("π");
    });
    $(".sin-button").click(function() {
        inputFunc("sin");
    });
    $(".cos-button").click(function() {
        inputFunc("cos");
    });
    $(".tan-button").click(function() {
        inputFunc("tan");
    });
    $(".asin-button").click(function() {
        inputFunc("asin");
    });
    $(".acos-button").click(function() {
        inputFunc("acos");
    });
    $(".atan-button").click(function() {
        inputFunc("atan");
    });
    $(".ln-button").click(function() {
        inputFunc("ln"); //Math.log is log_e
    });
    $(".e-button").click(function() {
        inputNumber("e");
    });
    $(".mod-button").click(function() {
        inputOperator("%");
    });
    $(".log-button").click(function() {
        inputFunc("log"); //Math.log10 is log_10
    });
    $(".floor-button").click(function() {
        inputFunc("floor");
    });
    $(".ceil-button").click(function() {
        inputFunc("ceil");
    });
    $(".abs-button").click(function() {
        inputFunc("abs");
    });
    $(".lp-button").click(function() {
        inputNumber("(");
    });
    $(".rp-button").click(function() {
        inputNumber(")");
    });
    //#endregion

    //#endregion

    //#region ans button
    $(".ans-button").click(function() {
        inputNumber(lastANS);
    });

    //#endregion
});

function updateTypingDisplay() {
    $(typingDisplay).text(currentInput);
}

function inputOperator(operator) {
    if(clearWithNextButton) {
        currentInput=$(answerDisplay).text();
        clearWithNextButton=false;
    }
    if(currentInput==""&&operator!="-") {
        return;
    }
    if(!isOperator(currentInput[currentInput.length-1])) {
        // !isNaN(currentInput[currentInput.length-1]) || currentInput[currentInput.length-1]=="."
        currentInput+=operator;
    } else {
        currentInput=currentInput.slice(0,-1);
        currentInput+=operator;
    }
    updateTypingDisplay();
}

function inputFunc(func) {
    if(clearWithNextButton) {
        currentInput="";
        clearWithNextButton=false;
    }
    currentInput+=func+"(";
    updateTypingDisplay();
}

function inputNumber(number) {
    if(clearWithNextButton) {
        currentInput="";
        clearWithNextButton=false;
    }
    currentInput+=number;
    updateTypingDisplay();
}

function isOperator(operator) {
    return operators.includes(operator);
}
