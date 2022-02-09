let no_answer = '?'

var model = {}
model.correct = 0
model.incorrect = 0

set_new_task()

function add_digit(i) {
  answer_node = document.getElementById('answer')
  current_answer = answer_node.textContent
  if (current_answer === no_answer) {
    current_answer = ''
  }
  new_answer = current_answer.concat(i.toString())
  answer_node.textContent = new_answer
  validate_answer(new_answer)
}

function delete_digit() {
  answer_node = document.getElementById('answer')
  current_answer = answer_node.textContent
  new_answer = current_answer.slice(0, -1)
  answer_node.textContent = new_answer
}

function validate_answer(answer) {
  first_number = parseInt(document.getElementById('first_number').textContent)
  second_number = parseInt(document.getElementById('second_number').textContent)
  result = first_number + second_number
  result_string = result.toString()
  if (result_string.length === answer.length) {
    if (result_string !== answer) {
      setTimeout(show_correct_answer, 1000, result_string)
      answer_node.style.color = 'red'
      model.incorrect += 1
    } else {
      model.correct += 1
    }
    setTimeout(update_counters, 1000)
    setTimeout(set_new_task, 2000)
  }
}

function show_correct_answer(answer) {
  answer_node = document.getElementById('answer')
  answer_node.style.color = 'green'
  answer_node.textContent = answer
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function set_new_task() {
  first_number = getRandomInt(10)
  second_number = getRandomInt(10)
  document.getElementById('first_number').textContent = first_number.toString()
  document.getElementById('second_number').textContent =
    second_number.toString()
  answer_node = document.getElementById('answer')
  answer_node.textContent = no_answer
  answer_node.removeAttribute('style')
}

function update_counters() {
  document.getElementById('correct').textContent = model.correct.toString()
  document.getElementById('incorrect').textContent = model.incorrect.toString()
}

// handle settings open

model.settings_open = false

function update_settings_open() {
  model.settings_open = !model.settings_open
}

// handle key presses

let key_codes = new Map()

for (let i = 0; i <= 9; i++) {
  key_codes.set(48 + i, i)
}

let backspace = 'backspace'

key_codes.set(8, backspace)

document.addEventListener('keydown', function (event) {
  if (key_codes.has(event.keyCode) && model.settings_open === false) {
    let value = key_codes.get(event.keyCode)
    if (value === 'backspace') {
      delete_digit()
    } else {
      add_digit(value)
    }
  }
})

function insert_after(new_node, reference_node) {
  reference_node.parentNode.insertBefore(new_node, reference_node.nextSibling)
}

// validate that min value is less than max
// show error
function validate_input(id_min, id_max, id_current) {
  let input1 = document.getElementById(id_min)
  let input2 = document.getElementById(id_max)
  let number1 = parseInt(input1.value)
  let number2 = parseInt(input2.value)
  if (number2 < number1) {
    if (id_min === id_current) {
      input2.classList.add('is-invalid')
      input1.classList.remove('is-invalid')
    } else if (id_max === id_current) {
      input1.classList.add('is-invalid')
      input2.classList.remove('is-invalid')
    }
  } else {
    input1.classList.remove('is-invalid')
    input2.classList.remove('is-invalid')
  }
}

let btn_selected = 'btn-primary'
let btn_unselected = 'btn-outline-primary'

function toggle_term(id) {
  let node = document.getElementById(id)
  if (node.classList.contains(btn_unselected)) {
    node.classList.remove(btn_unselected)
    node.classList.add(btn_selected)
  } else {
    node.classList.add(btn_unselected)
    node.classList.remove(btn_selected)
  }
  if (model.selected_terms.has(id)) {
    model.selected_terms.delete(id)
  } else {
    model.selected_terms.add(id)
  }
  if (model.selected_terms.size === 2) {
    select_third()
  } else {
    // TODO: trigger red danger
    // for (e of model.)
  }
}

model.selected_terms = new Set()

let a_term_id = 'a_term'
let b_term_id = 'b_term'
let c_term_id = 'c_term'

model.terms = [a_term_id, b_term_id, c_term_id]

let a_min_id = 'a_min'
let b_min_id = 'b_min'
let c_min_id = 'c_min'

let a_max_id = 'a_max'
let b_max_id = 'b_max'
let c_max_id = 'c_max'

let min_suffix = '_min'
let max_suffix = '_max'

let btn_need_select = 'btn-danger'
let btn_inactive = 'btn-secondary'

// given terms for 
//  a and b, determine range for c
//  a and c, determine range for b
//  b and c, determine range for a

function select_third() {
  if (model.terms.size === 0) {
    return
  }
  
  let t = NaN
  for (let term of model.terms) {
    if (!model.selected_terms.has(term)) {
      t = term
    }
  }
  let node = document.getElementById(t)
  let node_min = document.getElementById(t[0] + min_suffix)
  let node_max = document.getElementById(t[0] + max_suffix)

  node.classList.remove(btn_need_select)
  node.classList.remove(btn_unselected)
  node.classList.add(btn_inactive)

  node_min.setAttribute('readonly', 'true')
  node_max.setAttribute('readonly', 'true')

  range = get_range()
  node_min.value = range.min === Number.NaN ? infinity : range_min
  node_max.value = range.max === Number.NaN ? infinity : range_max
}

let plus = 'plus'
let minus = 'minus'
let times = 'times'
let divide = 'divide'

model.operations = [plus, minus, times, divide]
model.selected_operations = new Set()

let eq = 'eq'
let geq = 'geq'
let leq = 'leq'
let lt = 'lt'
let gt = 'gt'
let infinity = '?'

function get_range() {
  terms = model.selected_terms
  operations = model.selected_operations
  if (terms.has(a_term_id) && terms.has(b_term_id)) {
    let a_min = parse_int(document.getElementById(a_min_id).value)
    let b_min = parse_int(document.getElementById(b_min_id).value)
    let a_max = parse_int(document.getElementById(a_max_id).value)
    let b_max = parse_int(document.getElementById(b_max_id).value)

    range_min = Number.MAX_VALUE
    range_max = Number.MIN_VALUE

    let a_numbers = [a_min, a_max]
    let b_numbers = [b_min, b_max]
    for (let op of model.operations) {
      if (model.selected_operations.has(op)) {
        for (let a of a_numbers) {
          for (let i = 0; i < b_numbers.length; i++) {
            let b = b_numbers[i]

            if (a === NaN || b === NaN) {
              continue
            }

            if (op === plus) {
              range_min = Math.min(range_min, a + b)
              range_max = Math.max(range_max, a + b)
            }
            if (op === minus) {
              range_min = Math.min(range_min, a - b)
              range_max = Math.max(range_max, a - b)
            }
            if (op === times) {
              range_min = Math.min(range_min, a * b)
              range_max = Math.max(range_max, a * b)
            }
            if (op === divide) {
              let b_number = b
              if (i === 0) {
                b_number = i === 0 ? 1 : -1
              }
              range_min = Math.min(range_min, Math.ceil(a / b_number))
              range_max = Math.max(range_max, Math.floor(a / b_number))
            }
          }
        }
      }
    }
    return {
      min: range_min === Number.MAX_VALUE ? NaN : range_min,
      max: range_max === Number.MIN_VALUE ? NaN : range_max,
    }
  }
}

function toggle_operation(id) {
  let op_node = document.getElementById(id)
  if (op_node.classList.contains(btn_selected)) {
    op_node.classList.remove(btn_selected)
    op_node.classList.add(btn_unselected)
    model.selected_operations.delete(id)
  } else {
    op_node.classList.remove(btn_unselected)
    op_node.classList.add(btn_selected)
    model.selected_operations.add(id)
  }
  select_third()
}

function init_terms() {
  toggle_term(a_term_id)
  toggle_term(b_term_id)
}

init_terms()
