let items = [
  'Сделать проектную работу',
  'Полить цветы',
  'Пройти туториал по Реакту',
  'Сделать фронт для своего проекта',
  'Прогуляться по улице в солнечный день',
  'Помыть посуду',
];

const listElement = document.querySelector('.to-do__list');
const formElement = document.querySelector('.to-do__form');
const inputElement = document.querySelector('.to-do__input');
const templateElement = document.querySelector('#to-do__item-template');
const itemTemplate = templateElement.content.querySelector('.to-do__item');
const storageKey = 'tasks';

function loadTasks() {
  const savedTasks = localStorage.getItem(storageKey);

  if (savedTasks === null) {
    return items;
  }

  try {
    const tasks = JSON.parse(savedTasks);

    if (Array.isArray(tasks) && tasks.every((task) => typeof task === 'string')) {
      return tasks;
    }
  } catch {
    return items;
  }

  return items;
}

function getTasksFromDOM() {
  const itemsNamesElements = listElement.querySelectorAll('.to-do__item-text');
  const tasks = [];

  itemsNamesElements.forEach((textElement) => {
    tasks.push(textElement.textContent);
  });

  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function createItem(item) {
  const clone = itemTemplate.cloneNode(true);
  const textElement = clone.querySelector('.to-do__item-text');
  const deleteButton = clone.querySelector('.to-do__item-button_type_delete');
  const duplicateButton = clone.querySelector('.to-do__item-button_type_duplicate');
  const editButton = clone.querySelector('.to-do__item-button_type_edit');

  textElement.textContent = item;
  textElement.setAttribute('contenteditable', 'false');

  deleteButton.addEventListener('click', () => {
    clone.remove();
    items = getTasksFromDOM();
    saveTasks(items);
  });

  duplicateButton.addEventListener('click', () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);

    listElement.prepend(newItem);
    items = getTasksFromDOM();
    saveTasks(items);
  });

  editButton.addEventListener('click', () => {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();
  });

  textElement.addEventListener('blur', () => {
    textElement.setAttribute('contenteditable', 'false');
    items = getTasksFromDOM();
    saveTasks(items);
  });

  return clone;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const itemName = inputElement.value.trim();

  if (itemName === '') {
    return;
  }

  const newItem = createItem(itemName);

  listElement.prepend(newItem);
  items = getTasksFromDOM();
  saveTasks(items);
  formElement.reset();
  inputElement.focus();
}

formElement.addEventListener('submit', handleFormSubmit);

items = loadTasks();
items.forEach((item) => {
  listElement.append(createItem(item));
});
