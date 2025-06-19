# 🌐 AnshAPI - Bing Search API (Cloudflare Workers)

A simple but powerful public API that provides **web** and **image** search results scraped from **Bing** — deployed on **Cloudflare Workers**.
Perfect for experiments, bots, or educational tools.

---

## 🚀 Live Usage

Once deployed, your Worker will expose two endpoints:

### 1. API Endpoint

```
https://<your-worker-subdomain>.workers.dev/api?search=QUERY&state=web|image
```

### 2. API Docs (Homepage)

```
https://<your-worker-subdomain>.workers.dev/
```

---

## 🔧 API Parameters

| Parameter | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `search`  | string | The search query (e.g., `elon musk`) |
| `state`   | string | Either `web` or `image`              |

---

## 🧪 Example Requests

### 🔗 Web Search:

```
https://<your-worker>.workers.dev/api?search=tesla&state=web
```

### 🖼 Image Search:

```
https://<your-worker>.workers.dev/api?search=dogs&state=image
```

---

## 📆 JSON Response Format

### Web Example:

```json
{
  "status": "success",
  "query": "elon musk",
  "state": "web",
  "web": {
    "results": [
      {
        "url": "https://example.com",
        "title": "Elon Musk Biography",
        "snippet": "Elon Musk is a technology entrepreneur..."
      }
    ],
    "count": 1
  },
  "message": "Web results fetched successfully."
}
```

---

## ⚙️ Deploy to Cloudflare Workers

### 🛠 1. Install Wrangler

```bash
npm install -g wrangler
```

### 🛠 2. Init a Worker

```bash
wrangler init bingsearchapi
cd bingsearchapi
```

### 🛠 3. Replace Code

Replace `src/index.js` with the API logic provided in `index.js`.

### 🛠 4. Update `wrangler.toml`

```toml
name = "bingsearchapi"
main = "src/index.js"
compatibility_date = "2024-06-19"
```

### 🛠 5. Publish 🚀

```bash
wrangler publish
```

---

## 👤 Developer Info

* 👨‍💻 Made by [@anshapi](https://t.me/anshapi) on Telegram
* 🌍 Free and open to use — credit appreciated
* ⚠ For educational and non-commercial use

---

## 💬 Support

Have feedback or want to say thanks? DM [@anshapi](https://t.me/anshapi) ✨
