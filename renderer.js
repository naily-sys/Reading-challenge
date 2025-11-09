const fetch = require('node-fetch');

async function fetchBooks() {
  const authorRes = await fetch('https://openlibrary.org/search/authors.json?q=roald');
  const authorData = await authorRes.json();
  const authorKey = authorData.docs[0].key;

  const worksRes = await fetch(`https://openlibrary.org/authors/${authorKey}/works.json`);
  const worksData = await worksRes.json();

  const list = document.getElementById('book-list');
  list.innerHTML = '';

  const progress = JSON.parse(localStorage.getItem('readingProgress')) || {};

  worksData.entries.forEach(book => {
    const item = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = progress[book.title] || false;

    checkbox.addEventListener('change', () => {
      saveProgress(book.title, checkbox.checked);
    });

    const label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${book.title}`));

    item.appendChild(label);
    list.appendChild(item);
  });
}


function saveProgress(title, isRead) {
  let progress = JSON.parse(localStorage.getItem('readingProgress')) || {};
  progress[title] = isRead;
  localStorage.setItem('readingProgress', JSON.stringify(progress));
}

function showSummary() {
  const checkboxes = document.querySelectorAll('#book-list input[type="checkbox"]');
  const totalBooks = checkboxes.length;
  let readCount = 0;

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      readCount++;
    }
  });

  alert(`You've read ${readCount} out of ${totalBooks} books!`);
}


function resetProgress() {
  localStorage.removeItem('readingProgress');
  alert('Progress has been reset!');
  // reload the book list to reflect reset
}

async function startChallenge() {
  const authorName = document.getElementById('author-input').value.trim();
  if (!authorName) {
    alert('Please enter an author name!');
    return;
  }

  try {
    const authorRes = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)}`);
    const authorData = await authorRes.json();

    if (!authorData.docs.length) {
      alert('Author not found!');
      return;
    }

    const authorKey = authorData.docs[0].key;
    const worksRes = await fetch(`https://openlibrary.org/authors/${authorKey}/works.json`);
    const worksData = await worksRes.json();

    const list = document.getElementById('book-list');
    list.innerHTML = '';

    const progress = JSON.parse(localStorage.getItem('readingProgress')) || {};

    worksData.entries.forEach((book, index) => {
    const card = document.createElement('div');
    card.className = 'book-card';

    const title = document.createElement('span');
    title.textContent = book.title;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `book-${index}`;
    checkbox.checked = progress[book.title] || false;

    checkbox.addEventListener('change', () => {
    saveProgress(book.title, checkbox.checked);
  });

  card.appendChild(title);
  card.appendChild(checkbox);
  list.appendChild(card);
});

  } catch (error) {
    console.error('Error fetching books:', error);
    alert('Something went wrong. Try again!');
  }
}



