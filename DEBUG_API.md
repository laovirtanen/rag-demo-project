# API Connection Debug

Tämä tiedosto auttaa vianmäärityksessä, jos API-yhteys ei toimi.

## Vercel Frontend → Railway Backend

### 1. Tarkista ympäristömuuttujat Vercelissä
```
REACT_APP_API_URL = https://rag-demo-project-production.up.railway.app
```

### 2. Testaa API-yhteys suoraan
```bash
# Health-check
curl https://rag-demo-project-production.up.railway.app/health

# CORS preflight test
curl -I -X OPTIONS https://rag-demo-project-production.up.railway.app/upload \
  -H "Origin: https://rag-demo-project.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

### 3. Browser DevTools
- Avaa F12 → Network tab
- Kokeile tiedoston latausta
- Katso onko Origin-header oikein
- Tarkista Response Headers:
  - `Access-Control-Allow-Origin`
  - `Access-Control-Allow-Methods`

### 4. Yleisimmät ongelmat

**CORS Error**: Backend ei salli frontend-domainia
- Tarkista backendin CORS-asetukset
- Varmista että Railway-backend on deployattu uusimmalla koodilla

**Network Error**: Väärä API URL
- Tarkista `REACT_APP_API_URL` Vercelissä
- Varmista että Railway-backend vastaa health-checkiin

**500 Error**: Backend-virhe
- Tarkista Railway-lokit
- Varmista että `OPENAI_API_KEY` on asetettu

### 5. Frontend API-kutsut

Kaikki API-kutsut käyttävät nyt yhteistä konfiguraatioa:
- `src/config/api.js` - API URL:ien määritys
- `FileUpload.js` - POST `/upload`
- `QueryInterface.js` - POST `/query`
