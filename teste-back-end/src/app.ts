import * as express from 'express';
import * as cors from 'cors';

import connectToDB from './config/db';
import paradaRouter from './routes/paradaRouter';
import linhaRouter from './routes/linhaRouter';

// Cria app express
const app = express();

// Usa as configurações do cors
app.use(cors());

app.use(express.json());

// Conecta com o banco de dados
connectToDB();

app.use('/parada', paradaRouter);

app.use('/linha', linhaRouter);

export default app;
