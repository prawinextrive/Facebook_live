import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

const token = '12345';
const receivedUpdates: any[] = [];

app.set('port', port);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use(bodyParser.json());

app.get('/privacy_policy', (req: Request, res: Response): void => {
    const privacyPolicyPath = path.join(__dirname, 'privacy_policy.html');

    fs.readFile(privacyPolicyPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("<p>Error loading privacy policy.</p>");
        } else {
            res.send(data);
        }
    });
});

app.get('/webhook', (req: Request, res: Response): void => {
    const { 'hub.mode': hubMode, 'hub.verify_token': hubVerifyToken, 'hub.challenge': hubChallenge } = req.query;

    if (hubMode === 'subscribe' && hubVerifyToken === token) {
        res.send(hubChallenge as string);
    } else {
        res.sendStatus(400);
    }
});

app.post('/webhook', (req: Request, res: Response): void => {
    console.log('Facebook request body:', req.body);

    receivedUpdates.unshift(req.body);

    res.sendStatus(200);
});

