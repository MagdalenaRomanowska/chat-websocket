const loginForm = document.getElementById('welcome-form'); //formularz logowania.
const messagesSection = document.getElementById('messages-section'); //sekcja z wiadomościami.
const messagesList = document.getElementById('messages-list'); //lista wiadomości.
const addMessageForm = document.getElementById('add-messages-form'); //formularz dodawania wiadomości.
const userNameInput = document.getElementById('username'); //pole tekstowe z formularza logowania.
const messageContentInput = document.getElementById('message-content'); //pole tekstowe z formularza do wysyłania wiadomości.
let userName;

document.getElementById("welcome-form").addEventListener("submit", function login(event) {
    event.preventDefault()
    if (userNameInput.value == '') {
        alert("Error. Please enter your name.");
    } else {
        userName = userNameInput.value;
        document.querySelector('.welcome-form').classList.remove('show');
        document.querySelector('.messages-section').classList.add('show');
    }
});

function addMessage(author, content) {
    const message = document.createElement('li'); //Na starcie stwórz nowy element li i dodaj go do stałej message.
    message.classList.add('message'); //Następnie dodaj do niego klasę .message oraz .message--received, która zadba o eleganckie wyłonienie się elementu.
    message.classList.add('message--received');
    if (author === userName) message.classList.add('message--self'); //Jeśli author jest równe zmiennej globalnej userName, to dodaj do li również klasę .message--self. Będzie ona rozróżniała nasze wiadomości od tych wysłanych przez inne osoby.
    message.innerHTML = `  
      <h3 class="message__author">${userName === author ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `; //Następnie dodaj jako jego treść dwa kolejne elementy – nagłówek h3 o klasie message__author i diva o klasie message__content. Skąd wiemy, że akurat tak ma wyglądać struktura li?
    messagesList.appendChild(message); //Jako treść nagłówka wpisz wartość author lub You (jeśli author jest równe userName). Jako treść diva wpisz zawartość content.
} //Na końcu dodaj element message do #messagesList.

document.getElementById("add-messages-form").addEventListener("submit", function sendMessage(event) {
    event.preventDefault()
    if (messageContentInput.value == '') {
        alert("Error. Please enter your message.");
    } else {
        addMessage(userName, messageContentInput.value);
        messageContentInput.value = '';
    }
});