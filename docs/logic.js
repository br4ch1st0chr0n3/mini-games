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
    value = key_codes.get(event.keyCode)
    if (value === 'backspace') {
      delete_digit()
    } else {
      add_digit(value)
    }
  }
})

function insert_after(new_node, reference_node) {
  reference_node.parentNode.insertBefore(new_node, reference_node.nextSibling);
}

function validate_input(id_min, id_max, id_current){
  input1 = document.getElementById(id_min)
  input2 = document.getElementById(id_max)
  number1 = parseInt(input1.value)
  number2 = parseInt(input2.value)
  if (number2 < number1){
    if (id_min === id_current) {
      input2.classList.add('is-invalid')
      input1.classList.remove('is-invalid')
    }
    else if (id_max === id_current) {
      input1.classList.add('is-invalid')
      input2.classList.remove('is-invalid')
    }
  }
  else {
    input1.classList.remove('is-invalid')
    input2.classList.remove('is-invalid')
  }
}