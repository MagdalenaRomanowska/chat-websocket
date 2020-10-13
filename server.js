const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => { //endpoint, który będzie zwracał naszą aplikację. Kod będzie starał się wyłapywać wszystkie możliwe linki, więc gdyby znalazł się przed naszymi endpointami z zewnętrznych plików, przechwytywałby również ich adresy (np. /seats czy /concerts).
  res.sendFile(path.join(__dirname, '/client/index.html')); //Od teraz wejście w każdy link, którego serwer nie dopasował do wcześniejszych endpointów, będzie powodować po prostu zwrócenie w przeglądarce naszej reactowej aplikacji.
});

let messages = [];

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});