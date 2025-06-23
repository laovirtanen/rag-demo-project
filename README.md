# AskMyDocs – RAG Demo

Moderni web-sovellus, jossa voit ladata PDF- tai TXT-dokumentteja ja kysyä niistä kysymyksiä tekoälyn (GPT-4o) avulla. Sovellus perustuu Retrieval-Augmented Generation (RAG) -arkkitehtuuriin.

🌐 **Live-demo:** [https://rag-demo-project.vercel.app/](https://rag-demo-project.vercel.app/)

---

## Pääkohdat

- **Tiedostojen lataus** (PDF/TXT) ja automaattinen tekstin pilkkominen
- **Vektorihaku**: OpenAI:n embeddingit ja pilvessä pyörivä vektorikanta (Weaviate)
- **Chat-käyttöliittymä**: Kysy, saat vastauksen ja lähteet näytetään
- **Moderni UI**: Responsiivinen, nopea ja selkeä

---

## Teknologia

- **Frontend:** React + TailwindCSS (Vercel)
- **Backend:** Node.js/Express (Railway)
- **AI:** OpenAI API (embedding + chat)
- **Vektorikanta:** Weaviate Cloud Service (SaaS)

---

## Järjestelmän arkkitehtuuri

```mermaid
graph TD
  User -->|selain| Frontend
  Frontend -->|API| Backend
  Backend -->|embedding| OpenAI
  Backend -->|vektorit| Weaviate

---

Kokeile itse!
Avaa Live-demo

Lataa PDF- tai TXT-tiedosto

Kysy mitä tahansa tiedoston sisällöstä

---

Demo-projektin tarkoitus
Osoittaa kuinka helposti RAG-pohjainen haku voidaan toteuttaa pilvipalveluilla

Soveltuu pohjaksi mm. yritysdokumenttien, ohjeiden, tai minkä tahansa tekstiaineiston hakuun