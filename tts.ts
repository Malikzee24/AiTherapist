// server/tts.ts
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: 'C:\\Users\\ASUS TUF\\Documents\\AI Therapist\\project\\modern-brand-462915-s5-de7539a2215e.json',
});

export async function synthesize(text: string) {
  const request = {
    input: { text },
    voice: {
      languageCode: 'en-US',
      ssmlGender: 'NEUTRAL' as const, // <- fix type error
    },
    audioConfig: { audioEncoding: 'MP3' as const }, // <- fix type error
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent as Buffer, 'binary');
  return 'output.mp3';
}
