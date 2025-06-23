# AskMyDocs - RAG Demo

Moderni web-sovellus, jossa käyttäjä voi ladata PDF- tai TXT-tiedostoja ja kysyä niistä kysymyksiä tekoälyn avulla. Projektissa käytetään RAG-arkkitehtuuria (Retrieval-Augmented Generation) ja OpenAI:n API:a.

## Arkkitehtuuri
- **Frontend**: React-sovellus (deploy: Vercel)
- **Backend**: Node.js/Express API (deploy: Railway)
- **AI**: OpenAI API (embedding + chat)
- **Tallennus**: In-memory (kehitysvaihe)

## Kansiot
- `backend/` – Node.js/Express backend, tiedostojen käsittely ja RAG
- `frontend/` – React-käyttöliittymä, tiedoston lataus ja chat

## Käyttöönotto

### Backend (Railway)
1. Luo Railway-projekti ja yhdistä tämä repository
2. Lisää ympäristömuuttuja: `OPENAI_API_KEY=sk-...`
3. Deploy automaattisesti

### Frontend (Vercel)
1. Luo Vercel-projekti ja yhdistä repository
2. Aseta build-kansio: `frontend`
3. Lisää ympäristömuuttuja: `REACT_APP_API_URL=https://your-railway-url`
4. Deploy automaattisesti

## Kehitysympäristö
```bash
# Backend
cd backend
npm install
cp .env.example .env  # Lisää OPENAI_API_KEY
npm start

# Frontend (toisessa terminaalissa)
cd frontend  
npm install
cp .env.example .env  # Aseta REACT_APP_API_URL=http://localhost:3001
npm start
```

## Ominaisuudet
- PDF/TXT tiedostojen lataus ja analysointi
- Älykäs dokumenttien pilkkominen lauseittain
- OpenAI embedding-pohjainen hakutoiminto
- Chat-käyttöliittymä lähteineen
- Moderni, responsiivinen ulkoasu
- CORS-turvallinen API
