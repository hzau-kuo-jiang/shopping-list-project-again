const itemList = document.getElementById('item-list');
const filterInput = document.getElementById('filter-input');
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
		if (saveItemsToLocalStorage('add', inputValue)) {
			itemInput.value = '';
			renderItemsFromLocalStorage();
		} else {
			alert('You have already added this item!');
		}
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
		const item = target.parentElement.parentElement;
		const itemValue = item.textContent.trim();
		item.remove();
		
		renderAfterEditModeChanged();
		
		saveItemsToLocalStorage('remove', itemValue);
		renderItemsFromLocalStorage();
	}
}

// 1 event listener
itemList.addEventListener('click', removeItem);

// End1 remove an item


// Region1 remove all items
// 1 main function
const removeAllItems = () => {
	removeAllSurfaceItems();
	saveItemsToLocalStorage('removeAll');
}

// 1 event listener
clearBtn.addEventListener('click', removeAllItems);

// End1 remove all items


// Region2 remove all surface items

// 1 remove all surface items
const removeAllSurfaceItems = () => {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}
	renderAfterEditModeChanged();
}

// End2 remove all surface items


// Region2 render filter and clear button

// 1 after item added or removed, depending on the number of items, render filter and clear button
const renderFilterAndClearBtn = () => {
	if (checkItemNumber() > 0) {
		filterInput.style.display = 'block';
		clearBtn.style.display = 'block';
	} else {
		filterInput.style.display = 'none';
		clearBtn.style.display = 'none';
	}
}

// 2 check if there is any item left
const checkItemNumber = () => {
	const items = itemList.querySelectorAll('li');
	return items.length;
}

// End2 render filter and clear button


// Region1 toggle edit mode

// 1 main function
const enterEditMode = (event) => {
	const target = event.target;
	
	if (target.classList.contains('edit-mode')) {
		target.classList.remove('edit-mode');
	} else if (target.tagName === 'LI') {
		addEditModeClass(target);
	}
	
	renderAfterEditModeChanged();
}

// 2 first remove all edit-mode class, then add edit-mode class to the target item
const addEditModeClass = (item) => {
	const items = itemList.querySelectorAll('li');
	items.forEach((item) => item.classList.remove('edit-mode'));
	item.classList.add('edit-mode');
	
	itemInput.focus();
}

// 1 event listener
itemList.addEventListener('click', enterEditMode);

// End1 toggle edit mode


// Region1 edit item

// 1 main function
const editItem = (event) => {
	event.preventDefault();
	
	if (!checkEditMode()) {
		return;
	}
	
	const inputValue = itemInput.value.trim();
	if (!inputValue) {
		return;
	}
	
	const itemInListValue = itemList.querySelector('.edit-mode').firstChild.textContent.trim();
	
	if (saveItemsToLocalStorage('edit', inputValue, itemInListValue)) {
		itemInput.value = '';
		renderItemsFromLocalStorage();
	} else {
		alert('You have already added this item!');
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


// Region1 filter items

// 1 main function
const filterItems = (event) => {
	const inputValue = event.target.value.trim().toLowerCase();
	
	const items = itemList.querySelectorAll('li');
	items.forEach((item) => {
		const itemText = item.firstChild.textContent.trim().toLowerCase();
		if (itemText.indexOf(inputValue) !== -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
}

// 1 event listener
filterInput.addEventListener('input', filterItems);

// End1 filter items


// Region1 load items from local storage


const renderItemsFromLocalStorage = () => {
	removeAllSurfaceItems();
	
	const items = JSON.parse(localStorage.getItem('items')) || [];
	items.forEach((item) => {
		itemList.appendChild(createItem(item));
	});
	
	renderFilterAndClearBtn();
}

// 2 save items to local storage

const saveItemsToLocalStorage = (type, newItem, oldItem) => {
	let itemsFromLocalStorage;
	
	if (localStorage.getItem('items') === null) {
		itemsFromLocalStorage = [];
	} else {
		itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'));
	}
	
	let operateSuccessFlag;
	
	switch (type) {
		case 'add':
			if (itemsFromLocalStorage.indexOf(newItem) === -1) {
				itemsFromLocalStorage.push(newItem);
				operateSuccessFlag = true;
			} else {
				operateSuccessFlag = false;
			}
			break;
		case 'remove':
			// itemsFromLocalStorage = itemsFromLocalStorage.filter((itemFromLocalStorage) => itemFromLocalStorage !== newItem);
			itemsFromLocalStorage.splice(itemsFromLocalStorage.indexOf(newItem), 1);
			break;
		case 'removeAll':
			itemsFromLocalStorage = [];
			break;
		case 'edit':
			if (itemsFromLocalStorage.indexOf(newItem) === -1) {
				// itemsFromLocalStorage = itemsFromLocalStorage.filter((itemFromLocalStorage) => itemFromLocalStorage !== oldItem);
				itemsFromLocalStorage.splice(itemsFromLocalStorage.indexOf(oldItem), 1);
				itemsFromLocalStorage.push(newItem);
				operateSuccessFlag = true;
			} else {
				operateSuccessFlag = false;
			}
			break;
	}
	
	localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage));
	
	return operateSuccessFlag;
}

window.addEventListener('DOMContentLoaded', renderItemsFromLocalStorage);

// End1 load items from local storage