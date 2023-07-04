const itemList = document.getElementById('item-list');
const filter = document.getElementById('filter');
const clearBtn = document.getElementById('clear-btn');
const itemInput = document.getElementById('item-input');
const itemForm = document.getElementById('item-form');
const submitBtn = document.getElementById('submit-btn');


// Region1 add new item

// 1 main function
const addItem = (event) => {
	event.preventDefault();
	if (checkEditMode()) {
		return;
	}
	
	const inputValue = itemInput.value.trim();
	if (inputValue) {
		const newItem = createItem(inputValue);
		itemList.appendChild(newItem);
		itemInput.value = '';
		renderFilterAndClearBtn();
	}
}

// 1 event listener
itemForm.addEventListener('submit', addItem);

// End1 add new item


// Region2 create new item

// 1 create new item
const createItem = (value) => {
	const li = document.createElement('li');
	li.textContent = value;
	li.appendChild(createButton());
	return li;
}

// 2 create button
const createButton = () => {
	const button = document.createElement('button');
	button.className = 'remove-item btn-link text-red';
	button.appendChild(createIcon('fa-solid fa-xmark'));
	return button;
}

// End2 create new item


// Region3 create icon

// 1 create icon
const createIcon = (classes) => {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}

// End3 create icon


// Region1 remove an item

// 1 main function
const removeItem = (event) => {
	const target = event.target;
	if (target.parentElement.classList.contains('remove-item')) {
		target.parentElement.parentElement.remove();
		renderFilterAndClearBtn();
		renderAfterEditModeChanged();
	}
}

// 1 event listener
itemList.addEventListener('click', removeItem);

// End1 remove an item


// Region1 remove all items
clearBtn.addEventListener('click', () => {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}
	renderFilterAndClearBtn();
	renderAfterEditModeChanged();
});

// End1 remove all items


// Region2 render filter and clear button

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

// End2 render filter and clear button


// Region1 enter edit item mode

// 1 main function
const enterEditMode = (event) => {
	const target = event.target;
	if (target.tagName === 'LI') {
		changeItemStyle(target);
	}
	renderAfterEditModeChanged();
}

// 2 first remove all edit-mode class, then add edit-mode class to the target item
const changeItemStyle = (item) => {
	const items = itemList.querySelectorAll('li');
	items.forEach((item) => item.classList.remove('edit-mode'));
	
	item.classList.add('edit-mode');
}

// 1 event listener
itemList.addEventListener('click', enterEditMode);

// End1 enter edit item mode


// Region1 edit item

// 1 main function
const editItem = (event) => {
	event.preventDefault();
	if (!checkEditMode()) {
		return;
	}
	
	const itemInEditMode = itemList.querySelector('.edit-mode');
	const inputValue = itemInput.value.trim();
	
	if (inputValue) {
		itemInEditMode.textContent = inputValue;
		itemInEditMode.appendChild(createButton());
		
		itemInEditMode.classList.remove('edit-mode');
		itemInput.value = '';
		renderAfterEditModeChanged();
	}
}

// 1 event listener
itemForm.addEventListener('submit', editItem);

// End1 edit item


// Region2 render after edit-mode class added or disappeared

// 1 main function
const renderAfterEditModeChanged = () => {
	const editModeFlag = checkEditMode();
	changeSubmitBtn(editModeFlag);
	renderItemInput(editModeFlag);
}

// 2 change submit button
const changeSubmitBtn = (editModeFlag) => {
	if (editModeFlag) {
		submitBtn.innerHTML = '';
		submitBtn.appendChild(createIcon('fa-solid fa-pencil'));
		submitBtn.appendChild(document.createTextNode(' Edit Item'));
		submitBtn.classList.add('edit-mode');
	} else {
		submitBtn.innerHTML = '';
		submitBtn.appendChild(createIcon('fa-solid fa-plus'));
		submitBtn.appendChild(document.createTextNode(' Add Item'));
		submitBtn.classList.remove('edit-mode');
	}
}

// 2 render item input
const renderItemInput = (editModeFlag) => {
	if (editModeFlag) {
		const editingItem = itemList.querySelector('.edit-mode');
		const itemText = editingItem.firstChild.textContent.trim();
		itemInput.value = itemText;
	} else {
		itemInput.value = '';
	}
}

// End2 render after edit-mode class added or disappeared


// Region3 check if there is any item in edit mode

// 1 check edit mode
const checkEditMode = () => {
	const items = itemList.querySelectorAll('li');
	return Array.from(items).find((item) => item.classList.contains('edit-mode'));
}

// End3 check if there is any item in edit mode