import express from 'express';
import 'dotenv/config';
import connectDB from './config/DB.js';
import urlRouter from './routes/url.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, '../client/dist')));
const PORT = process.env.PORT;

app.use(express.json());

// Connect to the database
connectDB();

// API routes or Redirects to the original URL
app.use("/", urlRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});