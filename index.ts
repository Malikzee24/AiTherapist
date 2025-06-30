// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { synthesize } from './tts';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const filePath = await synthesize(text);
    const audio = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audio);
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(5000, () => {
  console.log('TTS Server is running on http://localhost:5000');
});
