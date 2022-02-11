interface Model {
  correct: number
  incorrect: number
  isSettingsOpen: boolean
  selectedTerms: Set<string>
  terms: Array<string>
  operations: Array<string>
  comparisons: Array<string>
  selectedOperations: Set<string>
  selectedComparisons: Set<string>
  validRanges: Set<string>
  unknownTerm: null | string
  number1: number
  number2: number
  correctAnswer: number
  currentAnswer: string
  currentOperation: null | string
  currentComparison: null | string
}

// model.correct = 0
// model.incorrect = 0

// handle settings open

// model.settings_open = false
let NO_VALUE = '?'
let BACKSPACE_CODE = 'Backspace'

function getKeycodes() {
  let keyCodes = new Map<string, string>()

  for (let i = 0; i <= 9; i++) {
    keyCodes.set(`Digit${i}`, `${i}`)
  }

  keyCodes.set(BACKSPACE_CODE, BACKSPACE_CODE)
  keyCodes.set(MINUS_CODE, MINUS_CODE)

  return keyCodes
}

let KEY_CODES = getKeycodes()

let BTN_SELECTED = 'btn-primary'
let BTN_UNSELECTED = 'btn-outline-primary'

let A_TERM_ID = 'a_term'
let B_TERM_ID = 'b_term'
let C_TERM_ID = 'c_term'

let A_NUMBER_ID = 'a_number'
let B_NUMBER_ID = 'b_number'
let C_NUMBER_ID = 'c_number'

let A_MIN_ID = 'a_min'
let B_MIN_ID = 'b_min'
let C_MIN_ID = 'c_min'

let A_MAX_ID = 'a_max'
let B_MAX_ID = 'b_max'
let C_MAX_ID = 'c_max'

let MIN_SUFFIX = 'min'
let MAX_SUFFIX = 'max'
let NUMBER_SUFFIX = '_number'
let TERM_SUFFIX = 'term'

let BUTTON_NEED_SELECT = 'btn-danger'
let BUTTON_INACTIVE = 'btn-secondary'

let PLUS = 'plus'
let MINUS = 'minus'
let TIMES = 'times'
let DIVIDE = 'divide'

let EQ = 'eq'
let GEQ = 'geq'
let LEQ = 'leq'
let LT = 'lt'
let GT = 'gt'
let INFINITY = '?'

let MINUS_SIGN = '-'
let MINUS_CODE = 'Minus'

let EMPTY_STRING = ''

var model: Model = {
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
  currentAnswer: '',
}

function getById(id: string) {
  return document.getElementById(id)
}

function addMinus(id: string) {
  // TODO
}

function addDigitOrMinus(i: string) {
  if (model.unknownTerm == null) {
    return
  }
  let newAnswer = model.currentAnswer.concat(i.toString())
  let answerNode = getById(model.unknownTerm)
  if (!isNaN(parseInt(newAnswer)) || newAnswer == MINUS_SIGN) {
    answerNode!.textContent = newAnswer
  }
  validateAnswer(newAnswer)
}

function deleteDigit() {
  if (model.unknownTerm == null) {
    return
  }
  let answerNode = getById(model.unknownTerm)
  let currentAnswer = answerNode!.textContent
  let newAnswer = currentAnswer == null ? null : currentAnswer.slice(0, -1)
  answerNode!.textContent = newAnswer
}

function parseIntNode(id: string) {
  let node = getById(id)
  if (node != null && node.textContent != null) {
    return parseInt(node.textContent)
  }
  return NaN
}

function validateAnswer(answer: string) {
  if (
    model.unknownTerm == null ||
    model.selectedTerms.size != 2 ||
    model.currentOperation == null ||
    model.currentComparison == null
  ) {
    return
  }
  let correctAnswer = model.correctAnswer.toString()
  if (answer.length >= correctAnswer.length) {
    if (correctAnswer != answer) {
      setTimeout(showCorrectAnswer, 1000, correctAnswer)
      let answerNode = getById(C_NUMBER_ID)
      answerNode!.style.color = 'red'
      model.incorrect += 1
    } else {
      model.correct += 1
    }
    setTimeout(updateCounters, 1000)
    setTimeout(setNewTask, 2000)
  }
}

function showCorrectAnswer(answer: string) {
  let answerNode = getById(C_NUMBER_ID)
  answerNode!.style.color = 'green'
  answerNode!.textContent = answer
}

// random number between min and max+1
function getRandomInteger(min: number, max: number) {
  let rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

function setCorrectAnswer(combination: string) {
  let number1 = model.number1
  let number2 = model.number2
  let operationId = model.currentOperation
  let ans = NaN
  if (combination == 'ab') {
    if (operationId == PLUS) {
      ans = number1 + number2
    } else if (operationId == MINUS) {
      ans = number1 - number2
    } else if (operationId == DIVIDE && number2 != 0) {
      ans = number1 / number2
    } else if (operationId == TIMES) {
      ans = number1 * number2
    }
  } else if (combination == 'ac') {
    if (operationId == PLUS) {
      ans = number2 - number1
    } else if (operationId == MINUS) {
      ans = number1 - number2
    } else if (operationId == DIVIDE && number2 != 0) {
      ans = number1 / number2
    } else if (operationId == TIMES) {
      ans = number2 / number1
    }
  } else if (combination == 'bc') {
    if (operationId == PLUS) {
      ans = number2 - number1
    } else if (operationId == MINUS) {
      ans = number1 + number2
    } else if (operationId == DIVIDE && number2 != 0) {
      ans = number1 * number2
    } else if (operationId == TIMES) {
      ans = number2 / number1
    }
  }
  model.correctAnswer = ans
}

function setNewTask() {
  // TODO remember correct answer
  for (let t of model.terms) {
    if (model.selectedTerms.has(t)) {
      let tMin = parseIntNode(`${t[0]}_${MIN_SUFFIX}`)
      let tMax = parseIntNode(`${t[0]}_${MAX_SUFFIX}`)

      let numberNode = getById(`${t[0]}_${NUMBER_SUFFIX}`)

      if (isNaN(tMin) || isNaN(tMax)) {
        numberNode!.textContent = NO_VALUE
      } else {
        numberNode!.textContent = getRandomInteger(tMin, tMax).toString()
      }
    } else {
      let numberNode = getById(`${t[0]}_${NUMBER_SUFFIX}`)
      numberNode!.textContent = NO_VALUE
      numberNode!.removeAttribute('style')
    }
  }
}

function updateCounters() {
  getById('correct')!.textContent = model.correct.toString()
  getById('incorrect')!.textContent = model.incorrect.toString()
}

function toggleSettingsOpen() {
  model.isSettingsOpen = !model.isSettingsOpen
}

// handle key presses

function startListenToKeys() {
  document.addEventListener('keydown', function (event) {
    if (KEY_CODES.has(event.code) && !model.isSettingsOpen) {
      let code = KEY_CODES.get(event.code)
      if (code == BACKSPACE_CODE) {
        deleteDigit()
      } else if (code == MINUS_CODE){
        addDigitOrMinus(MINUS_SIGN)
      } else if (code != null){
        addDigitOrMinus(code)
      }
    }
  })
}

function insertAfter(newNode: HTMLElement, referenceNode: HTMLElement) {
  if (referenceNode.parentNode != null) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }
}

function disableIfInvalidRange(id: string) {
  let nodeMin = parseIntNode(`${id[0]}_${MIN_SUFFIX}`)
  let nodeMax = parseInt(`${id[0]}_${MAX_SUFFIX}`)

  if (isNaN(nodeMin) || isNaN(nodeMax)) {
    model.validRanges.delete(id)
  }
}

// validate that min value is less than max
// show error

let INVALID = 'is-invalid'

function validateInput(termLetter: string, suffix: string) {
  let idMin = `${termLetter}_${MIN_SUFFIX}`
  let idMax = `${termLetter}_${MAX_SUFFIX}`
  let idCurrent = `${termLetter}_${suffix}`
  let input1 = getById(idMin)
  let input2 = getById(idMax)
  let number1 = parseIntNode(idMin)
  let number2 = parseIntNode(idMax)
  if (number2 < number1) {
    if (idMin === idCurrent) {
      input2!.classList.add(INVALID)
      input1!.classList.remove(INVALID)
    } else if (idMax === idCurrent) {
      input1!.classList.add(INVALID)
      input2!.classList.remove(INVALID)
    }
  } else {
    input1!.classList.remove(INVALID)
    input2!.classList.remove(INVALID)
  }
  selectThird()
  setNewTask()
}

function toggleTerm(id: string) {
  let node = getById(id)
  // for initial setup
  if (node!.classList.contains(BTN_UNSELECTED)) {
    model.selectedTerms.add(id)
    node!.classList.remove(BTN_UNSELECTED)
    node!.classList.add(BTN_SELECTED)
  } else if (node!.classList.contains(BTN_SELECTED)) {
    model.selectedTerms.delete(id)

    // both nodes need to be selected
    for (let term of model.terms) {
      if (!model.selectedTerms.has(term)) {
        let termNode = getById(term)
        termNode!.classList.remove(BTN_SELECTED, BUTTON_INACTIVE)
        termNode!.classList.add(BUTTON_NEED_SELECT)
        termNode!.removeAttribute('disabled')

        let termMinNode = getById(`${term[0]}_${MIN_SUFFIX}`)
        let termMaxNode = getById(`${term[0]}_${MAX_SUFFIX}`)

        termMinNode!.removeAttribute('disabled')
        termMaxNode!.removeAttribute('disabled')
      }
    }
  } else if (node!.classList.contains(BUTTON_NEED_SELECT)) {
    model.selectedTerms.add(id)
    node!.classList.remove(BUTTON_NEED_SELECT)
    node!.classList.add(BTN_SELECTED)
  }
  if (model.selectedTerms.size === 2) {
    selectThird()
  }
}

function selectThird() {
  if (model.selectedTerms.size < 2) {
    return
  }

  let t = ''
  for (let term of model.terms) {
    if (!model.selectedTerms.has(term)) {
      t = term
      break
    }
  }

  // that the third term is selected isn't recorded in the model
  let node = getById(t)
  let nodeMin = getById(`${t[0]}_${MIN_SUFFIX}`)
  let nodeMax = getById(`${t[0]}_${MAX_SUFFIX}`)

  node!.classList.remove(BUTTON_NEED_SELECT, BTN_UNSELECTED)
  node!.classList.add(BUTTON_INACTIVE)

  let range = getRange()
  nodeMin!.textContent = isNaN(range.min) ? INFINITY : range.min.toString()
  nodeMax!.textContent = isNaN(range.max) ? INFINITY : range.max.toString()
  disableIfInvalidRange(t)

  nodeMin!.setAttribute('disabled', 'true')
  nodeMax!.setAttribute('disabled', 'true')
}

// given terms for
//  a and b, determine range for c
//  a and c, determine range for b
//  b and c, determine range for a

function getRange() {
  let terms = model.selectedTerms
  let operations = model.selectedOperations
  if (terms.has(A_TERM_ID) && terms.has(B_TERM_ID)) {
    let aMin = parseIntNode(A_MIN_ID)
    let bMin = parseIntNode(B_MIN_ID)
    let aMax = parseIntNode(A_MAX_ID)
    let bMax = parseIntNode(B_MAX_ID)

    let rangeMin = Number.MAX_SAFE_INTEGER
    let rangeMax = Number.MIN_SAFE_INTEGER

    let aNumbers = [aMin, aMax]
    let bNumbers = [bMin, bMax]

    for (let op of model.operations) {
      if (model.selectedOperations.has(op)) {
        for (let a of aNumbers) {
          for (let i = 0; i < bNumbers.length; i++) {
            let b = bNumbers[i]
            if (isNaN(a) || isNaN(b)) {
              continue
            }
            if (op === PLUS) {
              rangeMin = Math.min(rangeMin, a + b)
              rangeMax = Math.max(rangeMax, a + b)
            }
            if (op === MINUS) {
              rangeMin = Math.min(rangeMin, a - b)
              rangeMax = Math.max(rangeMax, a - b)
            }
            if (op === TIMES) {
              rangeMin = Math.min(rangeMin, a * b)
              rangeMax = Math.max(rangeMax, a * b)
            }
            if (op === DIVIDE) {
              if (bMin === 0 && bMax === 0) {
                continue
              }
              let bNumber = b
              if (b === 0) {
                bNumber = i === 0 ? 1 : -1
              }
              rangeMin = Math.min(rangeMin, Math.ceil(a / bNumber))
              rangeMax = Math.max(rangeMax, Math.floor(a / bNumber))
            }
          }
        }
      }
    }

    return {
      min: rangeMin === Number.MAX_SAFE_INTEGER ? NaN : rangeMin,
      max: rangeMax === Number.MIN_SAFE_INTEGER ? NaN : rangeMax,
    }
  } else
    return {
      min: NaN,
      max: NaN,
    }
}

function toggleOperation(id: string) {
  let opNode = getById(id)
  if (model.selectedOperations.has(id)) {
    opNode!.classList.remove(BTN_SELECTED)
    opNode!.classList.add(BTN_UNSELECTED)
    model.selectedOperations.delete(id)
  } else {
    opNode!.classList.remove(BTN_UNSELECTED)
    opNode!.classList.add(BTN_SELECTED)
    model.selectedOperations.add(id)
  }
}

function setInitial() {
  getById(A_MIN_ID)!.textContent = '0'
  getById(A_MAX_ID)!.textContent = '10'
  getById(B_MIN_ID)!.textContent = '0'
  getById(B_MAX_ID)!.textContent = '10'
  setNewTask()
}

function toggleComparison(id: string) {
  let compNode = getById(id)
  if (model.selectedComparisons.has(id)) {
    compNode!.classList.remove(BTN_SELECTED)
    compNode!.classList.add(BTN_UNSELECTED)
    model.selectedComparisons.delete(id)
  } else {
    compNode!.classList.remove(BTN_UNSELECTED)
    compNode!.classList.add(BTN_SELECTED)
    model.selectedComparisons.add(id)
  }
}

function initTerms() {
  toggleTerm(A_TERM_ID)
  toggleTerm(B_TERM_ID)
  toggleOperation(PLUS)
  selectThird()
  toggleComparison(EQ)
  selectThird()
  setInitial()
  selectThird()
  startListenToKeys()
}

export {
  addDigitOrMinus as addDigit,
  deleteDigit,
  validateInput,
  toggleSettingsOpen as updateSettingsOpen,
  toggleComparison,
  toggleOperation,
  toggleTerm,
  initTerms,
}
