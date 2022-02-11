let no_value = '?'

var model: {
  correct: number
  incorrect: number
  settings_open: boolean
  selected_terms: Set<string>
  terms: Array<string>
  operations: Array<string>
  comparisons: Array<string>
  selected_operations: Set<string>
  selected_comparisons: Set<string>
  valid_ranges: Set<string>
}

model.correct = 0
model.incorrect = 0

// handle settings open

model.settings_open = false

let key_codes = get_keycodes()

let btn_selected = 'btn-primary'
let btn_unselected = 'btn-outline-primary'

model.selected_terms = new Set()

let a_term_id = 'a_term'
let b_term_id = 'b_term'
let c_term_id = 'c_term'

let a_number_id = 'a_number'
let b_number_id = 'b_number'
let c_number_id = 'c_number'

model.terms = [a_term_id, b_term_id, c_term_id]

let a_min_id = 'a_min'
let b_min_id = 'b_min'
let c_min_id = 'c_min'

let a_max_id = 'a_max'
let b_max_id = 'b_max'
let c_max_id = 'c_max'

let min_suffix = '_min'
let max_suffix = '_max'
let number_suffix = '_number'

let btn_need_select = 'btn-danger'
let btn_inactive = 'btn-secondary'

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

model.comparisons = [eq, geq, leq, lt, gt]
model.selected_comparisons = new Set()

model.valid_ranges = new Set()

function get_unknown_term() {
  if (model.selected_terms.size === 2) {
    for (let t of model.terms) {
      if (!model.selected_terms.has(t)) {
        return t
      }
    }
  }
  return NaN
}

function add_digit(i: string) {
  let answer_node = document.getElementById(c_number_id)
  let current_answer = answer_node.textContent
  if (current_answer === no_value) {
    current_answer = ''
  }
  let new_answer = current_answer.concat(i.toString())
  if (!isNaN(parseInt(new_answer)) && model.selected_terms.size == 2) {
    if (model.valid_ranges.has(i)) {
      answer_node.textContent = new_answer
    }
  }
  validate_answer(new_answer)
}

function delete_digit() {
  let answer_node = document.getElementById(c_number_id)
  let current_answer = answer_node.textContent
  let new_answer = current_answer.slice(0, -1)
  answer_node.textContent = new_answer
}

function validate_answer(answer: string) {
  let first_number = parseInt(document.getElementById(a_number_id).textContent)
  let second_number = parseInt(document.getElementById(b_number_id).textContent)
  let result = first_number + second_number
  let result_string = result.toString()
  if (result_string.length === answer.length) {
    if (result_string !== answer) {
      setTimeout(show_correct_answer, 1000, result_string)
      let answer_node = document.getElementById(c_number_id)
      answer_node.style.color = 'red'
      model.incorrect += 1
    } else {
      model.correct += 1
    }
    setTimeout(update_counters, 1000)
    setTimeout(set_new_task, 2000)
  }
}

function show_correct_answer(answer: string) {
  let answer_node = document.getElementById(c_number_id)
  answer_node.style.color = 'green'
  answer_node.textContent = answer
}

// random number between min and max+1
function get_random_integer(min: number, max: number) {
  let rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

function set_new_task() {
  for (let t of model.terms) {
    if (model.selected_terms.has(t)) {
      let t_min = parseInt(
        document.getElementById(t[0] + min_suffix).textContent
      )
      let t_max = parseInt(
        document.getElementById(t[0] + max_suffix).textContent
      )

      let number_node = document.getElementById(t[0] + number_suffix)

      if (isNaN(t_min) || isNaN(t_max)) {
        number_node.textContent = no_value
      } else {
        number_node.textContent = get_random_integer(t_min, t_max).toString()
      }
    } else {
      // set no_value
      let number_node = document.getElementById(t[0] + number_suffix)
      number_node.textContent = no_value
      number_node.removeAttribute('style')
    }
  }
}

function update_counters() {
  document.getElementById('correct').textContent = model.correct.toString()
  document.getElementById('incorrect').textContent = model.incorrect.toString()
}

function update_settings_open() {
  model.settings_open = !model.settings_open
}

// handle key presses

function get_keycodes() {
  let key_codes = new Map()

  for (let i = 0; i <= 9; i++) {
    key_codes.set(48 + i, i)
  }

  let backspace = 'backspace'

  key_codes.set(8, backspace)
  return key_codes
}

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

function insert_after(new_node: HTMLElement, reference_node: HTMLElement) {
  reference_node.parentNode.insertBefore(new_node, reference_node.nextSibling)
}

function disable_if_invalid_range(id: string) {
  let node_min = parseInt(
    document.getElementById(id[0] + min_suffix).textContent
  )
  let node_max = parseInt(
    document.getElementById(id[0] + max_suffix).textContent
  )

  if (isNaN(node_min) || isNaN(node_max)) {
    model.valid_ranges.delete(id)
  }
}

// validate that min value is less than max
// show error

let invalid = 'is-invalid'

function validate_input(id_min: string, id_max: string, id_current: string) {
  let input1 = document.getElementById(id_min)
  let input2 = document.getElementById(id_max)
  let number1 = parseInt(input1.textContent)
  let number2 = parseInt(input2.textContent)
  if (number2 < number1) {
    if (id_min === id_current) {
      input2.classList.add(invalid)
      input1.classList.remove(invalid)
    } else if (id_max === id_current) {
      input1.classList.add(invalid)
      input2.classList.remove(invalid)
    }
  } else {
    input1.classList.remove(invalid)
    input2.classList.remove(invalid)
  }
  set_new_task()
  select_third()
}

function toggle_term(id: string) {
  let node = document.getElementById(id)
  // for initial setup
  if (node.classList.contains(btn_unselected)) {
    model.selected_terms.add(id)
    node.classList.remove(btn_unselected)
    node.classList.add(btn_selected)
  } else if (node.classList.contains(btn_selected)) {
    model.selected_terms.delete(id)

    // both nodes need to be selected
    for (let term of model.terms) {
      if (!model.selected_terms.has(term)) {
        let term_node = document.getElementById(term)
        term_node.classList.remove(btn_selected, btn_inactive)
        term_node.classList.add(btn_need_select)
        term_node.removeAttribute('disabled')

        let term_min_node = document.getElementById(term[0] + min_suffix)
        let term_max_node = document.getElementById(term[0] + max_suffix)

        term_min_node.removeAttribute('disabled')
        term_max_node.removeAttribute('disabled')
      }
    }
  } else if (node.classList.contains(btn_need_select)) {
    model.selected_terms.add(id)
    node.classList.remove(btn_need_select)
    node.classList.add(btn_selected)
  }
  if (model.selected_terms.size === 2) {
    select_third()
  }
}

function select_third() {
  if (model.selected_terms.size < 2) {
    return
  }

  let t = ""
  for (let term of model.terms) {
    if (!model.selected_terms.has(term)) {
      t = term
      break
    }
  }

  // that the third term is selected isn't recorded in the model
  let node = document.getElementById(t)
  let node_min = document.getElementById(t[0] + min_suffix)
  let node_max = document.getElementById(t[0] + max_suffix)

  node.classList.remove(btn_need_select, btn_unselected)
  node.classList.add(btn_inactive)

  let range = get_range()
  node_min.textContent = isNaN(range.min) ? infinity : range.min.toString()
  node_max.textContent = isNaN(range.max) ? infinity : range.max.toString()
  disable_if_invalid_range(t)

  node_min.setAttribute('disabled', 'true')
  node_max.setAttribute('disabled', 'true')
}

// given terms for
//  a and b, determine range for c
//  a and c, determine range for b
//  b and c, determine range for a

function get_range() {
  let terms = model.selected_terms
  let operations = model.selected_operations
  if (terms.has(a_term_id) && terms.has(b_term_id)) {
    let a_min = parseInt(document.getElementById(a_min_id).textContent)
    let b_min = parseInt(document.getElementById(b_min_id).textContent)
    let a_max = parseInt(document.getElementById(a_max_id).textContent)
    let b_max = parseInt(document.getElementById(b_max_id).textContent)

    let range_min = Number.MAX_SAFE_INTEGER
    let range_max = Number.MIN_SAFE_INTEGER

    let a_numbers = [a_min, a_max]
    let b_numbers = [b_min, b_max]

    for (let op of model.operations) {
      if (model.selected_operations.has(op)) {
        for (let a of a_numbers) {
          for (let i = 0; i < b_numbers.length; i++) {
            let b = b_numbers[i]
            if (isNaN(a) || isNaN(b)) {
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
              if (b_min === 0 && b_max === 0) {
                continue
              }
              let b_number = b
              if (b === 0) {
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
      min: range_min === Number.MAX_SAFE_INTEGER ? NaN : range_min,
      max: range_max === Number.MIN_SAFE_INTEGER ? NaN : range_max,
    }
  } else
    return {
      min: NaN,
      max: NaN,
    }
}

function toggle_operation(id: string) {
  let op_node = document.getElementById(id)
  if (model.selected_operations.has(id)) {
    op_node.classList.remove(btn_selected)
    op_node.classList.add(btn_unselected)
    model.selected_operations.delete(id)
  } else {
    op_node.classList.remove(btn_unselected)
    op_node.classList.add(btn_selected)
    model.selected_operations.add(id)
  }
}

function set_initial() {
  document.getElementById(a_min_id).textContent = '0'
  document.getElementById(a_max_id).textContent = '10'
  document.getElementById(b_min_id).textContent = '0'
  document.getElementById(b_max_id).textContent = '10'
  set_new_task()
}

function toggle_comparison(id: string) {
  let comp_node = document.getElementById(id)
  if (model.selected_comparisons.has(id)) {
    comp_node.classList.remove(btn_selected)
    comp_node.classList.add(btn_unselected)
    model.selected_comparisons.delete(id)
  } else {
    comp_node.classList.remove(btn_unselected)
    comp_node.classList.add(btn_selected)
    model.selected_comparisons.add(id)
  }
}

function init_terms() {
  toggle_term(a_term_id)
  toggle_term(b_term_id)
  toggle_operation(plus)
  select_third()
  toggle_comparison(eq)
  select_third()
  set_initial()
  select_third()
}

init_terms()
