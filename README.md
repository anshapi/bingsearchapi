# AnshAPI - Bing Web & Image Search API

This is a simple and powerful API that scrapes **Bing** search results for both **web pages** and **images**. Built for developers, hobbyists, and learners.

---

## 🔧 How to Use

**Endpoint:**  
`/api/search?search=QUERY&state=web|image`

### Parameters:
- `search` — the query to search on Bing
- `state` — either `web` or `image`

### Examples:
- 🔗 Web: `/api/search?search=elon+musk&state=web`
- 🖼 Image: `/api/search?search=dog&state=image`

---

## 🖥 Example Response (Web)

```json
{
  "status": "success",
  "query": "elon musk",
  "state": "web",
  "web": {
    "results": [
      {
        "url": "https://example.com",
        "title": "Elon Musk - Example",
        "snippet": "Elon Musk is a tech entrepreneur..."
      }
    ],
    "count": 1
  },
  "message": "Web results fetched successfully."
}
```

---

## 📦 Deployment

This project is fully deployable on [Vercel](https://vercel.com/):

### Project structure:
```
/api/search.js     ← Main API logic
/index.html        ← Documentation UI
/vercel.json       ← Rewrite config
/README.md         ← This file
```

---

## 👤 Developer

**Made by [@anshapi](https://t.me/anshapi) on Telegram**  
Free to use • Open-source • Credit appreciated ✨

---

## 💬 Support

If you like this API or have suggestions, DM me on Telegram 👉 [@anshapi](https://t.me/anshapi)
