const express = require('express');
const path = require('path');
const app = express();
const server = app.listen(8000, () => { //Od tej chwili nasz serwer powinien być już "podatny" na komunikację z klientami. Teraz trzeba ustawić nasłuchiwacze.
  console.log('Server is running on Port:', 8000)
});
const socket = require('socket.io'); //uruchamiamy klienta websocketowego. Automatycznie emituje on do serwera akcję connection. Ma ona informować serwer, że pojawił się właśnie nowy podmiot do obsługi. Co ważne, przy tej okazji wysyłana jest też informacja o tym kliencie.
//Oprócz eventu connection, automatycznie wysyłanego przy inicjacji połączenia przez socket, istnieje jeszcze drugi analogiczny – disconnect. On także jest uruchamiany automatycznie, tylko że w momencie zamknięcia połączenia (czyli gdy np. użytkownik wyłącza zakładkę z naszą aplikacją).
const io = socket(server); //Integrujmy z naszym serwerem możliwości oferowane przez paczkę socket.

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
 
  socket.on('message', (message) => { //kiedy wykryjesz nowe połączenie (nowego socketa), nasłuchuj na nim na zdarzenie message, przy czym jeśli je wykryjesz, zrób pusha do tablicy messages.
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message); //Dane z socket.emit w app.js musimy odebrać w naszej funkcji przypiętej do nasłuchiwacza, a następnie dodać jako nowy element tablicy messages.
    socket.broadcast.emit('message', message);//Emitując zdarzenie z użyciem broadcastu (socket.broadcast.emit), nadajemy je do wszystkich socketów, oprócz tego, z którego go wysyłamy. 
  });// Bez tego broadcasta: nasz klient działa tak, że zanim wyśle zdarzenie z wiadomością na serwer, wcześniej dodaje ją już do HTMLa. Gdyby odebrał informację o nowej (swojej) wiadomości, dopisałby ją do listy drugi raz.
  
  socket.on('join', (user) => { //kiedy wykryjesz nowe połączenie (nowego socketa), nasłuchuj na nim na zdarzenie message, przy czym jeśli je wykryjesz, zrób pusha do tablicy messages.
    let newUser = { name: user.name, id: socket.id }; //Serwer ma ustawiony nasłuchiwacz na join. Kiedy go wykryje, odbiera login i na bazie tej informacji oraz socket.id, dodaje nowy wpis do tablicy.
    users.push(newUser); //Dane z socket.emit w app.js musimy odebrać w naszej funkcji przypiętej do nasłuchiwacza, a następnie dodać jako nowy element tablicy messages.
    socket.broadcast.emit('join', newUser); //Samą informację o zalogowaniu serwer już posiada, wystarczy rozszerzyć tę funkcjonalność. Poprzednio umieszczaliśmy wpis o tej osobie w tablicy users, teraz przesyłaj tę informację dalej, do pozostałych socketów (np. pod zdarzeniem o nazwie join). 
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left');
    let indexElemToRemove = users.findIndex(x => x.id == socket.id); //usuwamy z tablicy zalogowanych użytkowników.
    let nameToRemove = users[indexElemToRemove].name;
    socket.broadcast.emit('removeUser', nameToRemove);
    users.splice(indexElemToRemove, 1);
  }); //automatyczny event disconnect. Powinien on być wysyłany przez klienta w momencie zamykania połączenia = okna. Możemy to potraktować jako swoiste "pożegnanie".
  console.log('I\'ve added a listener on message and disconnect events \n');
});

let users = []; //tablica, która powinna zawsze posiadać aktualną listę zalogowanych użytkowników.
  
/*Gdy tylko pojawi się nowy klient (np. otworzymy zakładkę z naszą aplikacją), serwer to zauważy (wykryje event connection) i poinformuje 
nas o tym w konsoli. socket, jak mówiliśmy, to po prostu dostęp do samego klienta, a socket.id to unikalny identyfikator automatycznie 
nadawany każdemu przy inicjacji połączenia z serwerem. Czasami może być przydatny. Po wypisaniu informacji o nowym kliencie, serwer od 
razu zaczyna też oczekiwać na zdarzenie message, jeśli je wykryje, to wypisze w konsoli tekst "Oh, I've got something!".
Naturalnie każdy nowy klient (socket) to nowa wiadomość w konsoli i nowy nasłuchiwacz. Tak jak mówiliśmy już wcześniej, funkcja 
w connection będzie odpalana z osobna dla każdego klienta przy jego dołączeniu. */

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => { //endpoint, który będzie zwracał naszą aplikację. Kod będzie starał się wyłapywać wszystkie możliwe linki, więc gdyby znalazł się przed naszymi endpointami z zewnętrznych plików, przechwytywałby również ich adresy (np. /seats czy /concerts).
  res.sendFile(path.join(__dirname, '/client/index.html')); //Od teraz wejście w każdy link, którego serwer nie dopasował do wcześniejszych endpointów, będzie powodować po prostu zwrócenie w przeglądarce naszej reactowej aplikacji.
});

let messages = [];

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
