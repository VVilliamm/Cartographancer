const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//variabili d'ambiente
dotenv.config();
//inizializzazione express
const app = express();

connectDB(); //connessione al database

//middleware
app.use(cors());
app.use(express.json());

//middlerware di sistema
app.use(cors()); //consente chiamate AJAX da localhost:4200(Angular)
app.use(express.json()); //permette di leggere il body delle richieste in formato JSON

//rotte
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/maps', require('./routes/mapRoutes'));

//gestione rotte 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'endpoint not found' });
});

//middleware di gestione errori
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'internal server error' });
});

//avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});