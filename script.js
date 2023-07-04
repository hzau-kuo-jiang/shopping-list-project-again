const itemList = document.getElementById('item-list');
const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const itemInput = document.getElementById('item-input');
const itemForm = document.getElementById('item-form');

// Region render filter and clear button

// 1 after item added or removed, depending on the number of items, render filter and clear button
const renderFilterAndClearBtn = () => {
	if (checkItemNumber() > 0) {
		filter.style.display = 'block';
		clearBtn.style.display = 'block';
	} else {
		filter.style.display = 'none';
		clearBtn.style.display = 'none';
	}
}

// 2 check if there is any item left
const checkItemNumber = () => {
	const items = itemList.querySelectorAll('li');
	return items.length;
}

// End render filter and clear button


// Region remove item

// 1 main function
const removeItem = (event) => {
	const target = event.target;
	if (target.parentElement.classList.contains('remove-item')) {
		target.parentElement.parentElement.remove();
		renderFilterAndClearBtn();
	}
}

// 1 event listener
itemList.addEventListener('click', removeItem);

// End remove item

// Region add new item

// 1 main function
const addItem = (event) => {
	event.preventDefault();
	const inputValue = itemInput.value.trim();
	if (inputValue) {
		const newItem = createItem(inputValue);
		itemList.appendChild(newItem);
		itemInput.value = '';
		renderFilterAndClearBtn();
	}
}

// 2 create new item
const createItem = (value) => {
	const li = document.createElement('li');
	li.textContent = value;
	li.appendChild(createButton());
	return li;
}

// 3 create button
const createButton = () => {
	const button = document.createElement('button');
	button.className = 'remove-item btn-link text-red';
	button.appendChild(createIcon());
	return button;
}

// 4 create icon
const createIcon = () => {
	const icon = document.createElement('i');
	icon.className = 'fa-solid fa-xmark';
	return icon;
}

// 1 event listener
itemForm.addEventListener('submit', addItem);

// End add new item