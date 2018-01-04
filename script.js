var typingDisplay, answerDisplay;
var currentInput = "";
var decimalAllowed = true;
//lets input functions know to concat their inputs on to what is now the answer
var clearWithNextButton = false;
var operatorsMap = new Map([['×','*'],['÷','/']]);

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
        //should (couldve)? used regex
        if(decimalAllowed) {
            currentInput+=".";
            updateTypingDisplay();
            decimalAllowed = false;
        }
    });
    //#endregion

    //#region equals button
    $(".equals-button").click(function() {
        if(!clearWithNextButton && currentInput!="") {
            currentInput+="=";
            updateTypingDisplay();
            var parsedInput = currentInput;
            operatorsMap.forEach(function(v,k) {
                var regexTest = new RegExp(k,"g");
                parsedInput = parsedInput.replace(regexTest,v);
            });
            //remove equals sign
            parsedInput = parsedInput.slice(0,-1);
            //remove operator if it's at the end
            if(isNaN(parsedInput[parsedInput.length-1])) {
                parsedInput = parsedInput.slice(0,-1);
            }
            //evaluate expressino using eval (might change this later..)
            var currentAnswer = (Math.round(eval(parsedInput)*100000)/100000);
            if(/e/.test(currentAnswer)) {
                currentAnswer = currentAnswer.toPrecision(7);
            }
            $(answerDisplay).text(currentAnswer);
            clearWithNextButton=true;
        }
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
    if(!isNaN(currentInput[currentInput.length-1]) || currentInput[currentInput.length-1]==".") {
        currentInput+=operator;
    } else {
        currentInput=currentInput.slice(0,-1);
        currentInput+=operator;
    }
    decimalAllowed=true;
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