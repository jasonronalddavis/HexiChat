import fs from 'fs';
import OpenAI from 'openai';


const app = express();
const upload = multer({ dest: 'uploads/' });

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: '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',  // Replace with your OpenAI API Key
});

// Endpoint to handle audio file upload and transcription
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  const audioFilePath = req.file.path;

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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});