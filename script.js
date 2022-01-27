// Cached DOM elements
const showModalBtn = document.getElementById('show-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalContainer = document.getElementById('modal');

const bookMarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteURLEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

// State
let bookMarks = [];

// Functions
const toggleModal = (e) => {
  const isModalOpen = modalContainer.classList.contains('show-modal');

  if (isModalOpen) {
    return modalContainer.classList.remove('show-modal');
  }

  modalContainer.classList.add('show-modal');
  websiteNameEl.focus();
};

const validateInput = (inputEl, errorClass) => {
  if (!inputEl.value) {
    inputEl.classList.add(errorClass);
    return false;
  }

  return true;
};

const refreshDOM = () => {
  bookmarksContainer.innerHTML = '';
  bookMarks.forEach((bookmark) => updateDOM(bookmark));
};

const deleteBookMark = (url) => {
  const index = bookMarks.findIndex((bookmark) => bookmark.url === url);
  console.log(index);
  if (index >= 0) {
    bookMarks.splice(index, 1);
  }
  console.log(bookMarks);

  localStorage.setItem('bookMarks', JSON.stringify(bookMarks));
  refreshDOM();
};

const buildBookMarkItem = (name, url) => {
  // Link
  const linkEl = document.createElement('a');
  linkEl.href = url;
  linkEl.target = '_blank';
  linkEl.textContent = name;
  // Favicon
  const imageEl = document.createElement('img');
  imageEl.src = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`;
  imageEl.alt = 'Link favicon';
  // Name container
  const nameDiv = document.createElement('div');
  nameDiv.classList.add('name');
  nameDiv.append(imageEl, linkEl);
  // Close icon
  const iconEl = document.createElement('i');
  iconEl.classList.add('fas', 'fa-times');
  iconEl.id = 'delete-bookmark';
  iconEl.title = 'Delete Bookmark';
  // Interesting way of adding event listeners to nodes right at the point of
  // creation. gets around the issue of having to create event listeners
  // anf trying to time it for when the items are in the DOM
  iconEl.setAttribute('onclick', `deleteBookMark('${url}')`);

  // Item container
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');
  // Append can take mulitple node arguments, whereas appendchild can only take
  // one at a time
  itemDiv.append(iconEl, nameDiv);
  // itemDiv.appendChild(nameDiv);

  return itemDiv;
};

const updateDOM = (bookMark) => {
  const { name, url } = bookMark;
  bookmarksContainer.appendChild(buildBookMarkItem(name, url));
};

const storeBookMark = (e) => {
  e.preventDefault();
  const [websiteNameInput, websiteURLInput] = e.target;
  const validationResults = [
    validateInput(websiteNameInput, 'error'),
    validateInput(websiteURLInput, 'error', 'url'),
  ];

  if (validationResults.includes(false)) {
    return console.log('failed');
  }

  let name = websiteNameEl.value;
  let url = websiteURLInput.value;
  if (!url.includes('http://', 'https://')) {
    url = `https://${url}`;
  }

  const newBookMark = {
    name,
    url,
  };
  bookMarks.push(newBookMark);
  // WHOA!! RESET A FORM METHOD
  localStorage.setItem('bookMarks', JSON.stringify(bookMarks));
  bookMarkForm.reset();
  websiteNameEl.focus();
  updateDOM(newBookMark);
};

const initBookMarks = () => {
  const localBookMarksData = JSON.parse(localStorage.getItem('bookMarks'));
  bookMarks = localBookMarksData ?? [
    {
      name: 'Emmanuel Etti',
      url: 'https://emmanueletti.com',
    },
  ];
  bookMarks.forEach((bookMark) => {
    updateDOM(bookMark);
  });
  localStorage.setItem('bookMarks', JSON.stringify(bookMarks));
};

// Event Listeners
window.addEventListener('load', initBookMarks);
showModalBtn.addEventListener('click', toggleModal);
closeModalBtn.addEventListener('click', toggleModal);
modalContainer.addEventListener('click', (e) => {
  const didClickBackground = !e.target.closest('#modal-header-content');
  if (didClickBackground) {
    toggleModal();
  }
});

bookMarkForm.addEventListener('submit', storeBookMark);
