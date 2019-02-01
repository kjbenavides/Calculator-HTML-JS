// calc.js
// Author: Kelvin Benavides
// Date:   25 January 2018

function createButton(id, txt) {
  let btn = document.createElement("button");
  btn.setAttribute("id", id);
  let t = document.createTextNode(txt);
  btn.appendChild(t);
  btn.onclick = function(){addCalculation(txt)};
  document.getElementById("calculator").appendChild(btn);
  return btn;
};
function styleButton(btn) {
  btn.className = "calc-button";
  return btn;
};
function newLine(dst) {
  let br = document.createElement("br");
  if (dst == "body"){
    document.body.appendChild(br);
  } else if (dst == "calculator"){
    document.getElementById(dst).appendChild(br);
  }
};

function createCalculator() {
  // Style div
  let div = document.getElementById("calculator");
  div.style.backgroundColor = "lightblue";
  div.style.width = "440px";
  div.style.height = "475px";
  div.style.paddingLeft = "10px";
  div.style.paddingTop = "10px";
  // Result Window
  let textResult = document.createElement("textarea");
  textResult.style.width = "430px";
  textResult.style.fontSize = "32px";
  textResult.rows = 3;
  textResult.id = "result";
  textResult.readOnly = true;
  textResult.style.resize = "none";
  textResult.style.cursor = "auto";
  //textResult.innerHTML = "1 + 2 + 3\n\n= 5";
  document.getElementById("calculator").appendChild(textResult);
  newLine("calculator");
  /// Calculator
  let buttons = [["num7", "7"], ["num8", "8"], ["num9", "9"], ["div", "/"],
                 ["num4", "4"], ["num5", "5"], ["num6", "6"], ["mul", "*"],
                 ["num1", "1"], ["num2", "2"], ["num3", "3"], ["sub", "-"],
                 ["num0", "0"], ["dec", "."],  ["equ", "="],  ["add", "+"],
                 ["clr", "C"]];
  for (let i = 0; i < buttons.length; i++){
    let btn = styleButton(createButton(buttons[i][0], buttons[i][1]));
    buttons[i].unshift(btn);
    if ((i+1) % 4 === 0){
      newLine("calculator");
    }
  }
};
// parses result textarea and displays result as "\n\n= %result%";
let newCalculation = false;
let resultArr = [];
function calculate(result) {
  let regexp = /[/*\-+]/; // operators
  let total = 0.0;
  let strArr = [...resultArr];
  //let strArr = result.innerHTML.split(" "); // array with each part of equation
  // convert each element into a number instead of a string
  for (let i = 0; i < strArr.length; i++){
    if (!regexp.test(strArr[i])){ // not an operator
      strArr[i] = parseFloat(strArr[i]);
    }
  }

  let simplify1 = true;
  let simplify2 = false;
  // simplify the equation by going through the order of operations (mult/div -> sub/add)
  while (strArr.length > 1){ // loop until there is only one value left, the total
    // simplify * and /, loop until no more found
    while (simplify1){
      simplify1 = false;
      for (let j = 1; j < strArr.length; j++){
        if (strArr[j] == "*" || strArr[j] == "/"){
          simplify1 = true;
          if (strArr[j] == "*"){
            strArr[j-1] *= strArr[j+1]; // multiply previous elem by next
          } else if (strArr[j] == "/"){
            strArr[j-1] /= strArr[j+1]; // divide previous elem by next
          }
          strArr.splice(j, 2); // remove the operator and next elem from array, keeping the previous
          j = 0; // search for operators from the beginning
        }
      }
      if (!simplify1){ // no * or / found, move on to simplifying - and +
        simplify2 = true;
      }
    }
    // simplify - and +, loop until no more found
    while (simplify2){
      simplify2 = false;
      for (let j = 1; j < strArr.length; j++){
        if (strArr[j] == "-" || strArr[j] == "+"){
          simplify2 = true;

          if (strArr[j] == "-"){
            strArr[j-1] -= strArr[j+1]; // subtract next from previous elem
          } else if (strArr[j] == "+"){
            strArr[j-1] += strArr[j+1]; // add next elem to previous
          }
          strArr.splice(j, 2);
          j = 0;
        }
      }
    }
  }
  newCalculation = true; // flag to reset result textarea
  total = strArr[0]; // total equal to only value left in strArr, the total
  result.innerHTML += "\n\n= " + total;
  return total;
};

let str = "";
let answer = "";
function addCalculation(calc) {
  let result = document.getElementById("result");
  // reset textarea when a button is clicked to solve new equation
  if (newCalculation){
    result.innerHTML = answer;
    resultArr = [];
    str = answer;
    newCalculation = false;
  }
  // add corresponding operator or number to the textarea
  function pushOperator(op, num){
    result.innerHTML += " " + op + " ";
    resultArr.push(num);
    resultArr.push(op);
    return "";
  }
  if (calc == "/"){
    str = pushOperator(calc, str);
  } else if (calc == "*"){
    str = pushOperator(calc, str);
  } else if (calc == "-"){
    str = pushOperator(calc, str);
  } else if (calc == "+"){
    str = pushOperator(calc, str);
  } else if (calc == "="){
    resultArr.push(str);
    str = "";
    answer = calculate(result);
  } else if (calc == "."){
    result.innerHTML += calc;
    str += calc;
  } else if (calc == "C"){
    result.innerHTML = "";
    newCalculation = true;
    answer = "";
  } else {
    result.innerHTML += calc;
    str += calc;
  }
};

createCalculator();

function validateLogin() {
  // check for cookie
  function getCookie() {
    let name = "username=";
    let ca = document.cookie.split(";");
    alert(ca);
    for (let i = 0; i < ca.length; i++){
      let c = ca[i];
      while (c.charAt(0) == " "){
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0){
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  if (getCookie() != ""){
    alert("Welcome, admin");
  } else {
    alert("Not logged in");
    document.location = "login.html";
  }
}
