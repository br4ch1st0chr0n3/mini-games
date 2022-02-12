var app = (function (exports) {
    'use strict';

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
    let C_NUMBER_ID = 'c_number';
    let A_MIN_ID = 'a_min';
    let B_MIN_ID = 'b_min';
    let A_MAX_ID = 'a_max';
    let B_MAX_ID = 'b_max';
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
        isDisabledKeyboard: false,
    };
    function getById(id) {
        return document.getElementById(id);
    }
    function addSymbol(symbol) {
        if (model.unknownTerm == null ||
            model.isDisabledKeyboard ||
            model.validRanges.size != 2) {
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
        model.currentAnswer = EMPTY_STRING;
        if (model.unknownTerm == null || model.validRanges.size != 2) {
            return;
        }
        // don't allow to type until correct configuration is chosen
        model.isDisabledKeyboard = false;
        model.currentOperation = getRandomElement(model.selectedOperations);
        model.currentComparison = getRandomElement(model.selectedComparisons);
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
                            let formattedNumber = number.toString();
                            if (number < 0) {
                                formattedNumber = `(${formattedNumber})`;
                            }
                            numberNode.textContent = formattedNumber;
                        }
                    }
                    else {
                        numberNode.textContent = UNKNOWN;
                        numberNode.removeAttribute('style');
                    }
                }
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
    // function updateIfValidRange(id: string) {
    //   let nodeMin = parseIntNode(`${id[0]}_${MIN_SUFFIX}`)
    //   let nodeMax = parseIntNode(`${id[0]}_${MAX_SUFFIX}`)
    //   if (isNaN(nodeMin) || isNaN(nodeMax)) {
    //     model.validRanges.delete(id)
    //   } else {
    //     model.validRanges.add(id)
    //   }
    // }
    // validate that min value is less than max
    // show error
    let INVALID = 'is-invalid';
    function update() {
        maybeSetThird();
        setNewTask();
    }
    function handleInput(termLetter, suffix) {
        validateInput(termLetter, suffix);
        update();
    }
    // function removeClass(node: HTMLElement, className: string) {
    //   while (node.classList.contains(className)) {
    //     node.classList.remove(className)
    //   }
    // }
    function validateInput(termName, suffix) {
        let idMin = `${termName}_${MIN_SUFFIX}`;
        let idMax = `${termName}_${MAX_SUFFIX}`;
        let idCurrent = `${termName}_${suffix}`;
        let input1 = getById(idMin);
        let input2 = getById(idMax);
        let number1 = parseIntNode(idMin);
        let number2 = parseIntNode(idMax);
        // console.log("number22")
        if (!isNaN(number1) && !isNaN(number2)) {
            if (number1 <= number2) {
                input1.classList.remove(INVALID);
                input2.classList.remove(INVALID);
                model.validRanges.add(termName);
            }
            else if (idMin == idCurrent) {
                input2.classList.add(INVALID);
                model.validRanges.delete(termName);
            }
            else if (idMax == idCurrent) {
                input1.classList.add(INVALID);
                model.validRanges.delete(termName);
            }
        }
        else if (isNaN(number1) && !isNaN(number2)) {
            input1.classList.add(INVALID);
            input2.classList.remove(INVALID);
            model.validRanges.delete(termName);
        }
        else if (!isNaN(number1) && isNaN(number2)) {
            input2.classList.add(INVALID);
            input1.classList.remove(INVALID);
            model.validRanges.delete(termName);
        }
        else if (isNaN(number1) && isNaN(number2)) {
            input1.classList.add(INVALID);
            input2.classList.add(INVALID);
            model.validRanges.delete(termName);
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
            maybeSetThird();
        }
    }
    function maybeSetThird() {
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
        node.setAttribute(DISABLED, 'true');
        let range = getRange();
        nodeMin.value = isNaN(range.min) ? EMPTY_STRING : range.min.toString();
        nodeMax.value = isNaN(range.max) ? EMPTY_STRING : range.max.toString();
        // console.log(range)
        // updateIfValidRange(t)
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
        if (model.unknownTerm == null || model.validRanges.size != 2) {
            return ans;
        }
        let [id1, id2] = Array.from(model.selectedTerms);
        let numbers1 = [
            parseIntNode(`${id1[0]}_${MIN_SUFFIX}`),
            parseIntNode(`${id1[0]}_${MAX_SUFFIX}`),
        ];
        let numbers2 = [
            parseIntNode(`${id2[0]}_${MIN_SUFFIX}`),
            parseIntNode(`${id2[0]}_${MAX_SUFFIX}`),
        ];
        let rangeMin = Number.MAX_SAFE_INTEGER;
        let rangeMax = Number.MIN_SAFE_INTEGER;
        if (model.unknownTerm == C_TERM_ID) {
            let [bMin, bMax] = numbers2;
            for (let op of model.operations) {
                if (model.selectedOperations.has(op)) {
                    for (let a of numbers1) {
                        for (let i = 0; i < numbers2.length; i++) {
                            let b = numbers2[i];
                            if (op == PLUS) {
                                rangeMin = Math.min(rangeMin, a + b);
                                rangeMax = Math.max(rangeMax, a + b);
                            }
                            if (op == MINUS) {
                                rangeMin = Math.min(rangeMin, a - b);
                                rangeMax = Math.max(rangeMax, a - b);
                            }
                            if (op == TIMES) {
                                rangeMin = Math.min(rangeMin, a * b);
                                rangeMax = Math.max(rangeMax, a * b);
                            }
                            if (op == DIVIDE) {
                                if (bMin == 0 && bMax == 0) {
                                    continue;
                                }
                                if ((bMin <= 0 && bMax > 0) || (bMin < 0 && bMax >= 0)) {
                                    if (bMin <= 0 && bMax > 0) {
                                        rangeMin = Math.min(rangeMin, a);
                                        rangeMax = Math.max(rangeMax, a);
                                    }
                                    if (bMin < 0 && bMax >= 0) {
                                        rangeMin = Math.min(rangeMin, -a);
                                        rangeMax = Math.max(rangeMax, -a);
                                    }
                                }
                                else {
                                    rangeMin = Math.min(rangeMin, Math.ceil(a / b));
                                    rangeMax = Math.max(rangeMax, Math.floor(a / b));
                                }
                            }
                        }
                    }
                }
            }
            ans.min = rangeMin === Number.MAX_SAFE_INTEGER ? NaN : rangeMin;
            ans.max = rangeMax === Number.MIN_SAFE_INTEGER ? NaN : rangeMax;
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
        update();
    }
    function setInitial() {
        getById(A_MIN_ID).value = '0';
        getById(A_MAX_ID).value = '10';
        validateInput(A_MIN_ID[0], MIN_SUFFIX);
        getById(B_MIN_ID).value = '0';
        getById(B_MAX_ID).value = '10';
        validateInput(B_MIN_ID[0], MIN_SUFFIX);
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
        update();
    }
    function initTerms() {
        initialEnableTerm(A_TERM_ID);
        initialEnableTerm(B_TERM_ID);
        toggleOperation(PLUS);
        toggleComparison(EQ);
        setInitial();
        maybeSetThird();
        setNewTask();
        startListenToKeys();
    }

    exports.addSymbol = addSymbol;
    exports.deleteSymbol = deleteSymbol;
    exports.handleInput = handleInput;
    exports.initTerms = initTerms;
    exports.toggleComparison = toggleComparison;
    exports.toggleOperation = toggleOperation;
    exports.toggleSettingsOpen = toggleSettingsOpen;
    exports.toggleTerm = toggleTerm;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
