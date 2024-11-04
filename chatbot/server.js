import fs from 'fs';
import OpenAI from 'openai';
import multer from 'multer';
import fs from 'fs';
import ".env";


import { IncomingForm } from 'formidable';

const openai = new OpenAI({
  apiKey="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"
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the form data' });
        return;
      }

      const audioFilePath = files.audio.path;

      try {
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(audioFilePath),
          model: 'whisper-1',
          response_format: 'text',
        });

        res.json({ transcription: transcription.text });
      } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
      } finally {
        fs.unlinkSync(audioFilePath);  // Clean up uploaded file
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
