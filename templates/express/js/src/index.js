import setHeaders from './config/headers.js';
import { httpLogger, logger } from './logger.js';

import express from 'express';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setHeaders);
app.use(httpLogger);

if (process.env.NODE_ENV === 'development') {
    app.get('/', (req, res) => {
        res.send('Welcome to api set up by node-nitro ^_+');
    });
}

app.listen(PORT, () => {
    logger.info(`-> now listening at http://localhost:${PORT}/`);
});
