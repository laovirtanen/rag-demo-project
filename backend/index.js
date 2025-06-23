require('dotenv').config();

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const pdfParse = require('pdf-parse');
const axios   = require('axios');

const app = express();
const PORT = 3001;
app.use(express.json());

// Tiedostojen tallennusasetukset
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/'); },
  filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });

// Jakaa tekstin järkeviin osiin lauseiden mukaan
function splitTextToChunks(text, chunkSize = 500) {
  const chunks = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    const potentialChunk = currentChunk + (currentChunk ? '. ' : '') + trimmedSentence;
    
    if (potentialChunk.length <= chunkSize) {
      currentChunk = potentialChunk;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + '.');
        currentChunk = trimmedSentence;
      } else {
        // Jos yksittäinen lause on liian pitkä, jaetaan se sanojen mukaan
        const words = trimmedSentence.split(' ');
        let wordChunk = '';
        for (const word of words) {
          if ((wordChunk + ' ' + word).length <= chunkSize) {
            wordChunk += (wordChunk ? ' ' : '') + word;
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = word;
          }
        }
        if (wordChunk) currentChunk = wordChunk;
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk + (currentChunk.endsWith('.') ? '' : '.'));
  }
  
  return chunks.filter(chunk => chunk.trim().length > 0);
}

// Luo embedding-vektori tekstille OpenAI:n avulla
async function getEmbedding(text) {
  const response = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      input: text,
      model: "text-embedding-3-small"
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.data[0].embedding;
}

// Luo Weaviate-tietorakenne dokumenttien tallentamista varten
async function createWeaviateClass() {
  try {
    const check = await axios.get('http://localhost:8080/v1/schema');
    const exists = check.data.classes && check.data.classes.find(c => c.class === "Chunk");
    if (exists) return;
    await axios.post('http://localhost:8080/v1/schema', {
      class: "Chunk",
      vectorizer: "none",
      properties: [
        { name: "content", dataType: ["text"] },
        { name: "filename", dataType: ["string"] },
        { name: "chunk_index", dataType: ["int"] }
      ]
    });
  } catch (e) {
    // Sivutetaan virheet
  }
}

// Tallentaa tekstikappaleet ja niiden vektorit Weaviate-tietokantaan
async function upsertChunks(chunks, embeddings, filename) {
  await createWeaviateClass();
  for (let i = 0; i < chunks.length; i++) {
    await axios.post('http://localhost:8080/v1/objects', {
      class: "Chunk",
      properties: {
        content: chunks[i],
        filename: filename,
        chunk_index: i
      },
      vector: embeddings[i]
    });
  }
}

// Hakee relevanteimmat tekstikappaleet kysymyksen perusteella
async function queryWeaviate(queryEmbedding, limit = 5) {
  const graphqlQuery = {
    query: `
      {
        Get {
          Chunk(
            nearVector: {vector: [${queryEmbedding.join(',')}]}
            limit: ${limit}
          ) {
            content
            filename
            chunk_index
            _additional { distance }
          }
        }
      }
    `
  };
  const response = await axios.post('http://localhost:8080/v1/graphql', graphqlQuery);
  return response.data.data.Get.Chunk;
}

// Luo vastaus OpenAI:lla dokumenttien kontekstin perusteella
async function askOpenAIWithContext(chunks, question) {
  const contextText = chunks.map(
    (c, i) => `Ote ${i+1}:\n${c.content}`
  ).join('\n\n');

  const messages = [
    {
      role: "system",
      content: "Vastaa mahdollisimman hyödyllisesti käyttäjän kysymykseen käyttämällä alla olevia dokumenttiotteita. Jos vastausta ei löydy, ilmoita rehellisesti."
    },
    {
      role: "user",
      content:
        `Dokumenttiotteet:\n${contextText}\n\nKysymys: ${question}\n\nVastaa suomeksi!`
    }
  ];

  const resp = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,  // Pidempiä vastauksia varten
      temperature: 0.2
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return resp.data.choices[0].message.content.trim();
}

// ------------ ROUTES ------------

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('Tiedostoa ei lähetetty!');
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  let text = "";
  if (ext === '.txt') {
    text = fs.readFileSync(filePath, 'utf8');
  } else if (ext === '.pdf') {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    text = data.text;
  } else {
    return res.send('Sallittu vain TXT tai PDF.');
  }
  const chunks = splitTextToChunks(text);
  const embeddings = await Promise.all(chunks.map(getEmbedding));
  await upsertChunks(chunks, embeddings, req.file.filename);
  res.json({ message: 'Tallennus ok', chunkCount: chunks.length });
});

app.post('/query', async (req, res) => {
  const { question, limit = 5 } = req.body;
  if (!question) return res.status(400).json({ error: 'Kysymys puuttuu' });
  const embedding = await getEmbedding(question);
  const results = await queryWeaviate(embedding, limit);

  if (results && results.length > 0) {
    const llmAnswer = await askOpenAIWithContext(results, question);
    res.json({
      question,
      context: results.map(c => ({ content: c.content, distance: c._additional?.distance })),
      answer: llmAnswer
    });
  } else {
    res.json({
      question,
      context: [],
      answer: "Yhtään relevanttia tekstipätkää ei löytynyt tietokannasta."
    });
  }
});

app.get('/', (_, res) => res.send('AskMyDocs backend toimii!'));

// Käynnistä palvelin
app.listen(PORT, () => console.log(`Backend käynnissä portissa ${PORT}`));
