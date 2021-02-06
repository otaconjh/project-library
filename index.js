let myLibrary = [];
myLibrary.push(new BookConstructor("The Hobbit", "J.R.R. Tolkien", "295", true));

function BookConstructor(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}
BookConstructor.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read" : "not read yet"}`;
};
function addBookToLibrary(book, library) {
  let newLibrary = Array.from(library);
  newLibrary.push(book);
  return newLibrary;
}
BookConstructor.prototype.toggleRead = function () {
  this.read = !this.read;
};
/**
 *
 * @param {Number} bookIndex
 * @param {Array} library
 */
function deleteBookAtIndex(bookIndex, library) {
  let newLibrary = [...library.slice(0, bookIndex), ...library.slice(bookIndex + 1)];
  return newLibrary;
}
function displayBooks(myLibrary) {
  // Get DOM element for table body
  let tbody = document.getElementById("table-body");
  tbody.innerHTML = "";
  myLibrary.forEach((book, index) => {
    let bookRow = document.createElement("tr");
    bookRow.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${book.pages}</td><td>${book.read}</td><td><button class="toggle-button">Toggle</button></td><td><button class="delete-button">Delete</button></td>`;
    bookRow.setAttribute("data-index", index);
    tbody.appendChild(bookRow);
  });
}
const parseBookInfo = (event) => {
  event.preventDefault();
  console.log(event);
  let fieldArr = Array.from(event.target.elements);
  fieldArr.pop();
  fieldArr = fieldArr.map((field, index) => {
    if (index == 2) {
      return Number(field.value);
    } else if (index == 3) {
      return field.checked;
    } else {
      return field.value;
    }
  });
  let book = new BookConstructor(...fieldArr);
  myLibrary = addBookToLibrary(book, myLibrary);
  displayBooks(myLibrary);
  let removeModalEvent = new CustomEvent("click", {detail: {bookAdded: true}});
  window.dispatchEvent(removeModalEvent);
  event.target.reset();
};

const showModal = (event) => {
  console.log(event);
  let modalContainer = document.getElementById("modal");
  modalContainer.classList.remove("modal-hidden");

  // modalContainer.classList.add("modal-visible");
};
const removeModal = (event) => {
  let modalContainer = document.getElementById("modal");
  if (event.target == modalContainer || event.detail.bookAdded) {
    modalContainer.classList.add("modal-hidden");
  }
};

let bookButton = document.getElementById("new-book-button");
bookButton.addEventListener("click", showModal);
window.addEventListener("click", removeModal);

let submitButton = document.getElementById("book-submit");
// submitButton.addEventListener("load", parseBook);

let form = document.getElementById("new-book-form");
form.addEventListener("submit", parseBookInfo);

let tbody = document.getElementById("table-body");
tbody.addEventListener("click", checkButton);

function checkButton(event) {
  if (event.target.className == "delete-button") {
    console.log(event.target);
    let bookIndex = Number(event.target.parentElement.parentElement.dataset.index);
    myLibrary = deleteBookAtIndex(bookIndex, myLibrary);
    displayBooks(myLibrary);
  }
  if (event.target.className == "toggle-button") {
    console.log(event.target);
    let bookIndex = Number(event.target.parentElement.parentElement.dataset.index);
    myLibrary[bookIndex].toggleRead();
    displayBooks(myLibrary);
  }
}
