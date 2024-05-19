import connectToDb from './config/db.js';
import setHeaders from './config/headers.js';
import { httpLogger, logger } from './logger.js';

import express from 'express';

const PORT = process.env.PORT || 3001;
const app = express();

(async () => {
    await connectToDb();
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setHeaders);
app.use(httpLogger);

app.get('/', (req, res) => {
    res.send('Welcome to api set up by node-nitro ^_+');
});

app.listen(PORT, () => {
    logger.info(`-> now listening at http://localhost:${PORT}/`);
});
