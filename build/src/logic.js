// model.correct = 0
// model.incorrect = 0
// handle settings open
// model.settings_open = false
let noValue = '?';
let keyCodes = getKeycodes();
let btnSelected = 'btn-primary';
let btnUnselected = 'btn-outline-primary';
let A_TERM_ID = 'a_term';
let B_TERM_ID = 'b_term';
let C_TERM_ID = 'c_term';
let A_NUMBER_ID = 'a_number';
let B_NUMBER_ID = 'b_number';
let C_NUMBER_ID = 'c_number';
let A_MIN_ID = 'a_min';
let B_MIN_ID = 'b_min';
let C_MIN_ID = 'c_min';
let A_MAX_ID = 'a_max';
let B_MAX_ID = 'b_max';
let C_MAX_ID = 'c_max';
let MIN_SUFFIX = '_min';
let MAX_SUFFIX = '_max';
let NUMBER_SUFFIX = '_number';
let BUTTON_NEED_SELECT = 'btn-danger';
let BUTTON_INACTIVE = 'btn-secondary';
let PLUS = 'plus';
let MINUS = 'minus';
let TIMES = 'times';
let DIVIDE = 'divide';
let EQ = 'eq';
let GEQ = 'geq';
let LEQ = 'leq';
let LT = 'lt';
let GT = 'gt';
let INFINITY = '?';
var model = {
    correct: 0,
    incorrect: 0,
    settingsOpen: false,
    selectedTerms: new Set(),
    terms: [A_TERM_ID, B_TERM_ID, C_TERM_ID],
    operations: [PLUS, MINUS, TIMES, DIVIDE],
    selectedOperations: new Set(),
    comparisons: [EQ, GEQ, LEQ, LT, GT],
    selectedComparisons: new Set(),
    validRanges: new Set(),
};
// function get_unknown_term() {
//   if (model.selected_terms.size === 2) {
//     for (let t of model.terms) {
//       if (!model.selected_terms.has(t)) {
//         return t
//       }
//     }
//   }
//   return NaN
// }
function getById(id) {
    return document.getElementById(id);
}
function addDigit(i) {
    let answerNode = getById(C_NUMBER_ID);
    let currentAnswer = answerNode.textContent;
    if (currentAnswer === noValue) {
        currentAnswer = '';
    }
    let newAnswer = currentAnswer.concat(i.toString());
    if (!isNaN(parseInt(newAnswer)) && model.selectedTerms.size == 2) {
        if (model.validRanges.has(i)) {
            answerNode.textContent = newAnswer;
        }
    }
    validateAnswer(newAnswer);
}
function deleteDigit() {
    let answerNode = getById(C_NUMBER_ID);
    let currentAnswer = answerNode.textContent;
    let newAnswer = currentAnswer.slice(0, -1);
    answerNode.textContent = newAnswer;
}
function parseIntNode(id) {
    let node = getById(id);
    if (node != null && node.textContent != null) {
        return parseInt(node.textContent);
    }
    return NaN;
}
function validateAnswer(answer) {
    let number1 = parseIntNode(A_NUMBER_ID);
    let number2 = parseIntNode(B_NUMBER_ID);
    let result = number1 + number2;
    let resultString = result.toString();
    if (resultString.length === answer.length) {
        if (resultString !== answer) {
            setTimeout(showCorrectAnswer, 1000, resultString);
            let answerNode = getById(C_NUMBER_ID);
            answerNode.style.color = 'red';
            model.incorrect += 1;
        }
        else {
            model.correct += 1;
        }
        setTimeout(updateCounters, 1000);
        setTimeout(setNewTask, 2000);
    }
}
function showCorrectAnswer(answer) {
    let answerNode = getById(C_NUMBER_ID);
    answerNode.style.color = 'green';
    answerNode.textContent = answer;
}
// random number between min and max+1
function getRandomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
function setNewTask() {
    for (let t of model.terms) {
        if (model.selectedTerms.has(t)) {
            let tMin = parseIntNode(t[0] + MIN_SUFFIX);
            let tMax = parseIntNode(t[0] + MAX_SUFFIX);
            let numberNode = getById(t[0] + NUMBER_SUFFIX);
            if (isNaN(tMin) || isNaN(tMax)) {
                numberNode.textContent = noValue;
            }
            else {
                numberNode.textContent = getRandomInteger(tMin, tMax).toString();
            }
        }
        else {
            let numberNode = getById(t[0] + NUMBER_SUFFIX);
            numberNode.textContent = noValue;
            numberNode.removeAttribute('style');
        }
    }
}
function updateCounters() {
    getById('correct').textContent = model.correct.toString();
    getById('incorrect').textContent = model.incorrect.toString();
}
function updateSettingsOpen() {
    model.settingsOpen = !model.settingsOpen;
}
// handle key presses
function getKeycodes() {
    let keyCodes = new Map();
    for (let i = 0; i <= 9; i++) {
        keyCodes.set(48 + i, i);
    }
    let backspace = 'backspace';
    keyCodes.set(8, backspace);
    return keyCodes;
}
document.addEventListener('keydown', function (event) {
    if (keyCodes.has(event.keyCode) && model.settingsOpen === false) {
        let value = keyCodes.get(event.keyCode);
        if (value === 'backspace') {
            deleteDigit();
        }
        else {
            addDigit(value);
        }
    }
});
function insertAfter(newNode, referenceNode) {
    if (referenceNode.parentNode != null) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}
function disableIfInvalidRange(id) {
    let nodeMin = parseIntNode(id[0] + MIN_SUFFIX);
    let nodeMax = parseInt(id[0] + MAX_SUFFIX);
    if (isNaN(nodeMin) || isNaN(nodeMax)) {
        model.validRanges.delete(id);
    }
}
// validate that min value is less than max
// show error
let invalid = 'is-invalid';
function validateInput(idMin, idMax, idCurrent) {
    let input1 = getById(idMin);
    let input2 = getById(idMax);
    let number1 = parseIntNode(idMin);
    let number2 = parseIntNode(idMax);
    if (number2 < number1) {
        if (idMin === idCurrent) {
            input2.classList.add(invalid);
            input1.classList.remove(invalid);
        }
        else if (idMax === idCurrent) {
            input1.classList.add(invalid);
            input2.classList.remove(invalid);
        }
    }
    else {
        input1.classList.remove(invalid);
        input2.classList.remove(invalid);
    }
    setNewTask();
    selectThird();
}
function toggleTerm(id) {
    let node = getById(id);
    // for initial setup
    if (node.classList.contains(btnUnselected)) {
        model.selectedTerms.add(id);
        node.classList.remove(btnUnselected);
        node.classList.add(btnSelected);
    }
    else if (node.classList.contains(btnSelected)) {
        model.selectedTerms.delete(id);
        // both nodes need to be selected
        for (let term of model.terms) {
            if (!model.selectedTerms.has(term)) {
                let termNode = getById(term);
                termNode.classList.remove(btnSelected, BUTTON_INACTIVE);
                termNode.classList.add(BUTTON_NEED_SELECT);
                termNode.removeAttribute('disabled');
                let termMinNode = getById(term[0] + MIN_SUFFIX);
                let termMaxNode = getById(term[0] + MAX_SUFFIX);
                termMinNode.removeAttribute('disabled');
                termMaxNode.removeAttribute('disabled');
            }
        }
    }
    else if (node.classList.contains(BUTTON_NEED_SELECT)) {
        model.selectedTerms.add(id);
        node.classList.remove(BUTTON_NEED_SELECT);
        node.classList.add(btnSelected);
    }
    if (model.selectedTerms.size === 2) {
        selectThird();
    }
}
function selectThird() {
    if (model.selectedTerms.size < 2) {
        return;
    }
    let t = '';
    for (let term of model.terms) {
        if (!model.selectedTerms.has(term)) {
            t = term;
            break;
        }
    }
    // that the third term is selected isn't recorded in the model
    let node = getById(t);
    let nodeMin = getById(t[0] + MIN_SUFFIX);
    let nodeMax = getById(t[0] + MAX_SUFFIX);
    node.classList.remove(BUTTON_NEED_SELECT, btnUnselected);
    node.classList.add(BUTTON_INACTIVE);
    let range = getRange();
    nodeMin.textContent = isNaN(range.min) ? INFINITY : range.min.toString();
    nodeMax.textContent = isNaN(range.max) ? INFINITY : range.max.toString();
    disableIfInvalidRange(t);
    nodeMin.setAttribute('disabled', 'true');
    nodeMax.setAttribute('disabled', 'true');
}
// given terms for
//  a and b, determine range for c
//  a and c, determine range for b
//  b and c, determine range for a
function getRange() {
    let terms = model.selectedTerms;
    let operations = model.selectedOperations;
    if (terms.has(A_TERM_ID) && terms.has(B_TERM_ID)) {
        let aMin = parseIntNode(A_MIN_ID);
        let bMin = parseIntNode(B_MIN_ID);
        let aMax = parseIntNode(A_MAX_ID);
        let bMax = parseIntNode(B_MAX_ID);
        let rangeMin = Number.MAX_SAFE_INTEGER;
        let rangeMax = Number.MIN_SAFE_INTEGER;
        let aNumbers = [aMin, aMax];
        let bNumbers = [bMin, bMax];
        for (let op of model.operations) {
            if (model.selectedOperations.has(op)) {
                for (let a of aNumbers) {
                    for (let i = 0; i < bNumbers.length; i++) {
                        let b = bNumbers[i];
                        if (isNaN(a) || isNaN(b)) {
                            continue;
                        }
                        if (op === PLUS) {
                            rangeMin = Math.min(rangeMin, a + b);
                            rangeMax = Math.max(rangeMax, a + b);
                        }
                        if (op === MINUS) {
                            rangeMin = Math.min(rangeMin, a - b);
                            rangeMax = Math.max(rangeMax, a - b);
                        }
                        if (op === TIMES) {
                            rangeMin = Math.min(rangeMin, a * b);
                            rangeMax = Math.max(rangeMax, a * b);
                        }
                        if (op === DIVIDE) {
                            if (bMin === 0 && bMax === 0) {
                                continue;
                            }
                            let bNumber = b;
                            if (b === 0) {
                                bNumber = i === 0 ? 1 : -1;
                            }
                            rangeMin = Math.min(rangeMin, Math.ceil(a / bNumber));
                            rangeMax = Math.max(rangeMax, Math.floor(a / bNumber));
                        }
                    }
                }
            }
        }
        return {
            min: rangeMin === Number.MAX_SAFE_INTEGER ? NaN : rangeMin,
            max: rangeMax === Number.MIN_SAFE_INTEGER ? NaN : rangeMax,
        };
    }
    else
        return {
            min: NaN,
            max: NaN,
        };
}
function toggleOperation(id) {
    let opNode = getById(id);
    if (model.selectedOperations.has(id)) {
        opNode.classList.remove(btnSelected);
        opNode.classList.add(btnUnselected);
        model.selectedOperations.delete(id);
    }
    else {
        opNode.classList.remove(btnUnselected);
        opNode.classList.add(btnSelected);
        model.selectedOperations.add(id);
    }
}
function setInitial() {
    getById(A_MIN_ID).textContent = '0';
    getById(A_MAX_ID).textContent = '10';
    getById(B_MIN_ID).textContent = '0';
    getById(B_MAX_ID).textContent = '10';
    setNewTask();
}
function toggleComparison(id) {
    let compNode = getById(id);
    if (model.selectedComparisons.has(id)) {
        compNode.classList.remove(btnSelected);
        compNode.classList.add(btnUnselected);
        model.selectedComparisons.delete(id);
    }
    else {
        compNode.classList.remove(btnUnselected);
        compNode.classList.add(btnSelected);
        model.selectedComparisons.add(id);
    }
}
function initTerms() {
    toggleTerm(A_TERM_ID);
    toggleTerm(B_TERM_ID);
    toggleOperation(PLUS);
    selectThird();
    toggleComparison(EQ);
    selectThird();
    setInitial();
    selectThird();
}
initTerms();
export { addDigit, deleteDigit, validateInput, updateSettingsOpen, toggleComparison, toggleOperation, toggleTerm, initTerms, };
