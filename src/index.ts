const ul_list = document.querySelector('.list')
const input_text = document.getElementById('text') as HTMLInputElement
const input_amount = document.getElementById('amount') as HTMLInputElement
const span_count = document.querySelector('.count') as HTMLHeadingElement
const form = document.querySelector('.form-control') as HTMLFormElement

const income = document.querySelector('.income') as HTMLParagraphElement
const expense = document.querySelector('.h3-real1 > p') as HTMLParagraphElement

const btn = document.querySelector('.btn') as HTMLButtonElement

interface transaction {
	id: number
	amount: number
	text: string
}

const localStorageTransactions = JSON.parse(
	localStorage.getItem('transactions')
)

console.log(localStorageTransactions)

let transactions: transaction[] =
	localStorage.getItem('transactions') !== null
		? localStorageTransactions
		: ([] as transaction[])

function addTransactions(e: Event) {
	e.preventDefault()

	if (input_text.value.trim() === '' || input_amount.value.trim() === '') {
		alert('Пожалуйста введите весь ввод')
	} else {
		const transaction: transaction = {
			id: Date.now(),
			amount: +input_amount.value,
			text: input_text.value,
		}

		transactions.push(transaction)
		transactionDOM(transaction)
		updateLocalStorage()
	}
}

function transactionDOM(transaction: transaction) {
	let li = document.createElement('li')
	let amount =
		transaction.amount < 0
			? `-${Math.abs(transaction.amount)}`
			: `+${transaction.amount}`
	li.classList.add(transaction.amount < 0 ? 'minus' : 'plus')
	let text = transaction.text

	li.innerHTML = `${text} <span>${amount}</span> <button class="delete-id" onclick ="deleteValue(
		${transaction.id}
	)">X</button>`
	ul_list.append(li)

	updateValues()
}

function deleteValue(id: number) {
	transactions = transactions.filter(val => val.id !== id)
	updateLocalStorage()
	init()
}

form.addEventListener('submit', function (e) {
	addTransactions(e)
})

function init() {
	ul_list.innerHTML = ''

	transactions.forEach(transactionDOM)
	updateValues()
}

function updateLocalStorage() {
	localStorage.setItem('transactions', JSON.stringify(transactions))
}

function updateValues() {
	let total = transactions.reduce((acc, val) => acc + val.amount, 0)
	let incoming = transactions.reduce(
		(acc, val) => (val.amount > 0 ? acc + val.amount : acc),
		0
	)

	let expensing = transactions.reduce(
		(acc, val) => (val.amount < 0 ? acc + val.amount : acc),
		0
	)

	// DOM
	income.textContent = `$${incoming.toFixed(2)}`
	span_count.textContent = `$${total.toFixed(2)}`
	expense.textContent = `$${expensing.toFixed(2)}`
}

init()
