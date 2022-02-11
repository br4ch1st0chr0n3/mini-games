// model.correct = 0
// model.incorrect = 0
// handle settings open
// model.settings_open = false
let UNKNOWN = '?';
let BACKSPACE_CODE = 'Backspace';
let MINUS_SIGN = '-';
let MINUS_CODE = 'Minus';
function getKeycodes() {
    let keyCodes = new Map();
    for (let i = 0; i <= 9; i++) {
        keyCodes.set(`Digit${i}`, `${i}`);
    }
    keyCodes.set(BACKSPACE_CODE, BACKSPACE_CODE);
    keyCodes.set(MINUS_CODE, MINUS_CODE);
    return keyCodes;
}
let KEY_CODES = getKeycodes();
let BTN_SELECTED = 'btn-primary';
let BTN_UNSELECTED = 'btn-outline-primary';
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
let MIN_SUFFIX = 'min';
let MAX_SUFFIX = 'max';
let NUMBER_SUFFIX = 'number';
let TERM_SUFFIX = 'term';
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
let DISABLED = 'disabled';
let EMPTY_STRING = '';
var model = {
    correct: 0,
    incorrect: 0,
    isSettingsOpen: false,
    selectedTerms: new Set(),
    terms: [A_TERM_ID, B_TERM_ID, C_TERM_ID],
    operations: [PLUS, MINUS, TIMES, DIVIDE],
    selectedOperations: new Set(),
    comparisons: [EQ, GEQ, LEQ, LT, GT],
    selectedComparisons: new Set(),
    validRanges: new Set(),
    unknownTerm: null,
    currentOperation: null,
    currentComparison: null,
    number1: NaN,
    number2: NaN,
    correctAnswer: NaN,
    currentAnswer: EMPTY_STRING,
    isDisabledKeyboard: false
};
function getById(id) {
    return document.getElementById(id);
}
function addSymbol(symbol) {
    if (model.unknownTerm == null || model.isDisabledKeyboard) {
        return;
    }
    let newAnswer = model.currentAnswer.concat(symbol);
    if (!isNaN(parseInt(newAnswer)) || newAnswer == MINUS_SIGN) {
        model.currentAnswer = newAnswer;
        let answerNode = getById(`${model.unknownTerm[0]}_${NUMBER_SUFFIX}`);
        answerNode.textContent = newAnswer;
    }
    validateAnswer();
}
function deleteSymbol() {
    if (model.unknownTerm == null || model.isDisabledKeyboard) {
        return;
    }
    let newAnswer = model.currentAnswer.slice(0, -1);
    let answerNode = getById(`${model.unknownTerm[0]}_${NUMBER_SUFFIX}`);
    answerNode.textContent = newAnswer == EMPTY_STRING ? UNKNOWN : newAnswer;
    model.currentAnswer = newAnswer;
}
function parseIntNode(id) {
    let node = getById(id);
    if (node != null && node.value != null) {
        return parseInt(node.value);
    }
    return NaN;
}
function validateAnswer() {
    let answer = model.currentAnswer;
    if (model.unknownTerm == null ||
        model.selectedTerms.size != 2 ||
        model.currentOperation == null ||
        model.currentComparison == null) {
        // console.log(model.unknownTerm, "|", model.selectedTerms, "|", model.currentOperation, "|", model.currentComparison)
        return;
    }
    let correctAnswer = model.correctAnswer.toString();
    if (answer.length >= correctAnswer.length) {
        if (correctAnswer != answer) {
            setTimeout(showCorrectAnswer, 1000, correctAnswer);
            let answerNode = getById(C_NUMBER_ID);
            answerNode.style.color = 'red';
            model.incorrect += 1;
        }
        else {
            model.correct += 1;
        }
        model.isDisabledKeyboard = true;
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
let AB_COMBINATION = 'ab';
let AC_COMBINATION = 'ac';
let BC_COMBINATION = 'bc';
function setCorrectAnswer(combination) {
    let number1 = model.number1;
    let number2 = model.number2;
    let operationId = model.currentOperation;
    // console.log(number1, number2, operationId)
    let ans = NaN;
    if (combination == AB_COMBINATION) {
        if (operationId == PLUS) {
            ans = number1 + number2;
        }
        else if (operationId == MINUS) {
            ans = number1 - number2;
        }
        else if (operationId == DIVIDE && number2 != 0) {
            ans = number1 / number2;
        }
        else if (operationId == TIMES) {
            ans = number1 * number2;
        }
    }
    else if (combination == AC_COMBINATION) {
        if (operationId == PLUS) {
            ans = number2 - number1;
        }
        else if (operationId == MINUS) {
            ans = number1 - number2;
        }
        else if (operationId == DIVIDE && number2 != 0) {
            ans = number1 / number2;
        }
        else if (operationId == TIMES) {
            ans = number2 / number1;
        }
    }
    else if (combination == BC_COMBINATION) {
        if (operationId == PLUS) {
            ans = number2 - number1;
        }
        else if (operationId == MINUS) {
            ans = number1 + number2;
        }
        else if (operationId == DIVIDE && number2 != 0) {
            ans = number1 * number2;
        }
        else if (operationId == TIMES) {
            ans = number2 / number1;
        }
    }
    model.correctAnswer = ans;
}
function getRandomElement(s) {
    let randomIndex = getRandomInteger(0, s.size - 1);
    return s.size == 0 ? null : Array.from(s)[randomIndex];
}
function setNewTask() {
    if (model.unknownTerm == null) {
        return;
    }
    model.isDisabledKeyboard = false;
    model.currentOperation = getRandomElement(model.selectedOperations);
    model.currentComparison = getRandomElement(model.selectedComparisons);
    model.currentAnswer = EMPTY_STRING;
    if (model.currentOperation == null || model.currentComparison == null) {
        return;
    }
    if (model.unknownTerm == C_TERM_ID) {
        if (model.currentOperation != DIVIDE) {
            for (let t of model.terms) {
                let numberNode = getById(`${t[0]}_${NUMBER_SUFFIX}`);
                if (model.selectedTerms.has(t)) {
                    let tMin = parseIntNode(`${t[0]}_${MIN_SUFFIX}`);
                    let tMax = parseIntNode(`${t[0]}_${MAX_SUFFIX}`);
                    if (isNaN(tMin) || isNaN(tMax)) {
                        numberNode.textContent = UNKNOWN;
                    }
                    else {
                        let number = getRandomInteger(tMin, tMax);
                        if (t == A_TERM_ID) {
                            model.number1 = number;
                        }
                        else {
                            model.number2 = number;
                        }
                        numberNode.textContent = number.toString();
                    }
                }
                else {
                    numberNode.textContent = UNKNOWN;
                    numberNode.removeAttribute('style');
                }
            }
        }
        else {
            // TODO
        }
        setCorrectAnswer(AB_COMBINATION);
    }
    else {
        console.log('operation not supported');
    }
}
function updateCounters() {
    getById('correct').textContent = model.correct.toString();
    getById('incorrect').textContent = model.incorrect.toString();
}
function toggleSettingsOpen() {
    model.isSettingsOpen = !model.isSettingsOpen;
}
// handle key presses
function startListenToKeys() {
    document.addEventListener('keydown', function (event) {
        if (KEY_CODES.has(event.code) && !model.isSettingsOpen) {
            let code = KEY_CODES.get(event.code);
            if (code == BACKSPACE_CODE) {
                deleteSymbol();
            }
            else if (code == MINUS_CODE) {
                addSymbol(MINUS_SIGN);
            }
            else if (code != null) {
                addSymbol(code);
            }
        }
    });
}
function insertAfter(newNode, referenceNode) {
    if (referenceNode.parentNode != null) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}
function disableIfInvalidRange(id) {
    let nodeMin = parseIntNode(`${id[0]}_${MIN_SUFFIX}`);
    let nodeMax = parseInt(`${id[0]}_${MAX_SUFFIX}`);
    if (isNaN(nodeMin) || isNaN(nodeMax)) {
        model.validRanges.delete(id);
    }
}
// validate that min value is less than max
// show error
let INVALID = 'is-invalid';
function handleInput(termLetter, suffix) {
    validateInput(termLetter, suffix);
    maybeSelectThird();
    setNewTask();
}
function validateInput(termLetter, suffix) {
    let idMin = `${termLetter}_${MIN_SUFFIX}`;
    let idMax = `${termLetter}_${MAX_SUFFIX}`;
    let idCurrent = `${termLetter}_${suffix}`;
    let input1 = getById(idMin);
    let input2 = getById(idMax);
    let number1 = parseIntNode(idMin);
    let number2 = parseIntNode(idMax);
    if (number2 < number1) {
        if (idMin === idCurrent) {
            input2.classList.add(INVALID);
            input1.classList.remove(INVALID);
        }
        else if (idMax === idCurrent) {
            input1.classList.add(INVALID);
            input2.classList.remove(INVALID);
        }
    }
    else {
        input1.classList.remove(INVALID);
        input2.classList.remove(INVALID);
    }
}
function initialEnableTerm(id) {
    let node = getById(id);
    node.classList.remove(BTN_UNSELECTED);
    node.classList.add(BTN_SELECTED);
    model.selectedTerms.add(id);
}
function toggleTerm(termName) {
    let id = `${termName}_${TERM_SUFFIX}`;
    let node = getById(id);
    // for initial setup
    if (model.selectedTerms.has(id)) {
        model.selectedTerms.delete(id);
        model.unknownTerm = null;
        // both nodes need to be selected
        for (let term of model.terms) {
            if (!model.selectedTerms.has(term)) {
                let termNode = getById(term);
                termNode.classList.remove(BTN_SELECTED, BUTTON_INACTIVE);
                termNode.classList.add(BUTTON_NEED_SELECT);
                termNode.removeAttribute(DISABLED);
                let termMinNode = getById(`${term[0]}_${MIN_SUFFIX}`);
                let termMaxNode = getById(`${term[0]}_${MAX_SUFFIX}`);
                termMinNode.removeAttribute(DISABLED);
                termMaxNode.removeAttribute(DISABLED);
            }
        }
    }
    else {
        model.selectedTerms.add(id);
        node.classList.remove(BUTTON_NEED_SELECT);
        node.classList.add(BTN_SELECTED);
        maybeSelectThird();
    }
}
function maybeSelectThird() {
    if (model.selectedTerms.size == 2) {
        for (let t of model.terms) {
            if (!model.selectedTerms.has(t)) {
                model.unknownTerm = t;
                break;
            }
        }
    }
    if (model.unknownTerm == null) {
        return;
    }
    // console.log(model.unknownTerm)
    let t = model.unknownTerm;
    let node = getById(t);
    let nodeMin = getById(`${t[0]}_${MIN_SUFFIX}`);
    let nodeMax = getById(`${t[0]}_${MAX_SUFFIX}`);
    node.classList.remove(BUTTON_NEED_SELECT, BTN_UNSELECTED);
    node.classList.add(BUTTON_INACTIVE);
    node.setAttribute('disabled', 'true');
    let range = getRange();
    nodeMin.value = isNaN(range.min) ? EMPTY_STRING : range.min.toString();
    nodeMax.value = isNaN(range.max) ? EMPTY_STRING : range.max.toString();
    disableIfInvalidRange(t);
    nodeMin.setAttribute(DISABLED, 'true');
    nodeMax.setAttribute(DISABLED, 'true');
}
// given terms for
//  a and b, determine range for c
//  a and c, determine range for b
//  b and c, determine range for a
function getRange() {
    let ans = {
        min: NaN,
        max: NaN,
    };
    if (model.selectedTerms.has(A_TERM_ID) &&
        model.selectedTerms.has(B_TERM_ID)) {
        let aMin = parseIntNode(A_MIN_ID);
        let bMin = parseIntNode(B_MIN_ID);
        let aMax = parseIntNode(A_MAX_ID);
        let bMax = parseIntNode(B_MAX_ID);
        // console.log(aMin, bMin, aMax, bMax)
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
        ans.min = rangeMin === Number.MAX_SAFE_INTEGER ? NaN : rangeMin;
        ans.max = rangeMax === Number.MIN_SAFE_INTEGER ? NaN : rangeMax;
    }
    else {
        // TODO
    }
    return ans;
}
function toggleOperation(id) {
    let node = getById(id);
    if (model.selectedOperations.has(id)) {
        node.classList.remove(BTN_SELECTED);
        node.classList.add(BTN_UNSELECTED);
        model.selectedOperations.delete(id);
    }
    else {
        node.classList.remove(BTN_UNSELECTED);
        node.classList.add(BTN_SELECTED);
        model.selectedOperations.add(id);
    }
}
function setInitial() {
    getById(A_MIN_ID).value = '0';
    getById(A_MAX_ID).value = '10';
    getById(B_MIN_ID).value = '0';
    getById(B_MAX_ID).value = '10';
}
function toggleComparison(id) {
    let node = getById(id);
    if (model.selectedComparisons.has(id)) {
        node.classList.remove(BTN_SELECTED);
        node.classList.add(BTN_UNSELECTED);
        model.selectedComparisons.delete(id);
    }
    else {
        node.classList.remove(BTN_UNSELECTED);
        node.classList.add(BTN_SELECTED);
        model.selectedComparisons.add(id);
    }
}
function initTerms() {
    initialEnableTerm(A_TERM_ID);
    initialEnableTerm(B_TERM_ID);
    toggleOperation(PLUS);
    toggleComparison(EQ);
    setInitial();
    maybeSelectThird();
    setNewTask();
    startListenToKeys();
}
export { addSymbol, deleteSymbol, handleInput, toggleSettingsOpen, toggleComparison, toggleOperation, toggleTerm, initTerms, };
