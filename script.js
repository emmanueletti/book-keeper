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

  const bookMark = {
    name,
    url,
  };
  bookMarks.push(bookMark);
  // WHOA!! RESET A FORM METHOD
  localStorage.setItem('bookMarks', JSON.stringify(bookMarks));
  bookMarkForm.reset();
  websiteNameEl.focus();
};

const initBookMarks = () => {
  const localBookMarksData = JSON.parse(localStorage.getItem('bookMarks'));
  bookMarks = localBookMarksData ?? [
    {
      name: 'Emmanuel Etti',
      url: 'https://emmanueletti.com',
    },
  ];
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
