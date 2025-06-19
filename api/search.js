export default async function handler(req, res) {
  const { search, state } = req.query;

  if (!search || !state) {
    return res.status(400).json({
      status: "error",
      message: "Missing 'search' or 'state' parameter.",
    });
  }

  if (state === "image") {
    const results = await scrapeBingImages(search);
    return res.status(200).json({
      status: "success",
      query: search,
      state: "image",
      images: {
        results,
        count: results.length,
      },
      message: "Image results fetched successfully.",
    });
  } else if (state === "web") {
    const results = await scrapeBingWeb(search);
    return res.status(200).json({
      status: "success",
      query: search,
      state: "web",
      web: {
        results,
        count: results.length,
      },
      message: "Web results fetched successfully.",
    });
  } else {
    return res.status(400).json({
      status: "error",
      message: "Invalid state. Use 'web' or 'image'.",
    });
  }
}

async function scrapeBingImages(query) {
  const response = await fetch(\`https://www.bing.com/images/search?q=\${encodeURIComponent(query)}\`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await response.text();
  const matches = [...html.matchAll(/<img[^>]+src="(http[^">]+)"/g)];
  return matches.map((m) => m[1]).filter((src) => src.startsWith("http"));
}

async function scrapeBingWeb(query) {
  const response = await fetch(\`https://www.bing.com/search?q=\${encodeURIComponent(query)}\`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await response.text();
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
        snippet: snippetMatch ? stripTags(snippetMatch[1]) : "",
      });
    }
  }

  return results;
}

function stripTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
}
