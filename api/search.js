export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const search = url.searchParams.get("search");
    const state = url.searchParams.get("state");

    // Serve API documentation
    if (path === "/") {
      return new Response(`
        <html><head><title>AnshAPI Docs</title></head><body style="font-family:sans-serif;padding:2rem;">
        <h1> AnshAPI - Bing Search API</h1>
        <p>This API provides <b>web and image search</b> using Bing.</p>
        <h2> How to Use</h2>
        <code>/api?search=QUERY&state=web|image</code><br/>
        <ul>
          <li><b>search</b>: your query</li>
          <li><b>state</b>: <code>web</code> or <code>image</code></li>
        </ul>
        <h2> Examples</h2>
        <ul>
          <li><a href="/api?search=dog&state=image">Image: dog</a></li>
          <li><a href="/api?search=elon%20musk&state=web">Web: elon musk</a></li>
        </ul>
        <div style="margin-top:2rem;font-size:0.9rem;color:#555;">
          Made with  by <b>@anshapi</b> on Telegram
        </div>
        </body></html>
      `, { headers: { "Content-Type": "text/html" } });
    }

    // Serve API
    if (path === "/api") {
      if (!search || !state) {
        return jsonResponse({
          status: "error",
          message: "Missing 'search' or 'state' parameter."
        }, 400);
      }

      try {
        if (state === "image") {
          const results = await scrapeBingImages(search);
          return jsonResponse({
            status: "success",
            query: search,
            state: "image",
            images: {
              results,
              count: results.length
            },
            message: "Image results fetched successfully."
          });
        } else if (state === "web") {
          const results = await scrapeBingWeb(search);
          return jsonResponse({
            status: "success",
            query: search,
            state: "web",
            web: {
              results,
              count: results.length
            },
            message: "Web results fetched successfully."
          });
        } else {
          return jsonResponse({
            status: "error",
            message: "Invalid state. Use 'web' or 'image'."
          }, 400);
        }
      } catch (err) {
        return jsonResponse({
          status: "error",
          message: "Server error. Possibly due to Bing blocking the request."
        }, 500);
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

async function scrapeBingImages(query) {
  const res = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const html = await res.text();
  const matches = [...html.matchAll(/<img[^>]+src="(http[^">]+)"/g)];
  return matches.map(m => m[1]).filter(src => src.startsWith("http"));
}

async function scrapeBingWeb(query) {
  const res = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const html = await res.text();
  const results = [];
  const blocks = [...html.matchAll(/<li class="b_algo".*?<\/li>/gs)];

  for (const block of blocks) {
    const item = block[0];
    const urlMatch = item.match(/<a href="([^"]+)"/);
    const titleMatch = item.match(/<a[^>]*>(.*?)<\/a>/s);
    const snippetMatch = item.match(/<p>(.*?)<\/p>/s);

    if (urlMatch && titleMatch) {
      results.push({
        url: urlMatch[1],
        title: stripTags(titleMatch[1]),
        snippet: snippetMatch ? stripTags(snippetMatch[1]) : ""
      });
    }
  }

  return results;
}

function stripTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
}
