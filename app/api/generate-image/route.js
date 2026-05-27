// Proxy for AI-generated food images
function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout));
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get("prompt");
    const seed = searchParams.get("seed") || "1";

    if (!prompt) {
      return new Response("Missing prompt", { status: 400 });
    }

    // 1. Try Unsplash Source (deterministic, fast, food-related)
    try {
      const unsplashUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(prompt + ",food")}`;
      const unsplashRes = await fetchWithTimeout(unsplashUrl, 4000);
      if (unsplashRes.ok && unsplashRes.headers.get("content-type")?.startsWith("image")) {
        const buffer = await unsplashRes.arrayBuffer();
        return new Response(buffer, {
          headers: {
            "Content-Type": unsplashRes.headers.get("content-type") || "image/jpeg",
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      }
    } catch {}

    // 2. Try Lorem Picsum (deterministic by seed, always works)
    try {
      const picsumUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt + seed)}/400/400`;
      const picsumRes = await fetchWithTimeout(picsumUrl, 4000);
      if (picsumRes.ok && picsumRes.headers.get("content-type")?.startsWith("image")) {
        const buffer = await picsumRes.arrayBuffer();
        return new Response(buffer, {
          headers: {
            "Content-Type": picsumRes.headers.get("content-type") || "image/jpeg",
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      }
    } catch {}

    // 3. Final fallback: generate SVG locally (instant, no network)
    const colors = ["#FF6B35", "#F7931E", "#C41E3A", "#8B4513", "#2E8B57", "#E91E63", "#FF5722"];
    const color = colors[Number(seed) % colors.length];
    const initials = prompt.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="400" height="400" fill="${color}"/>
      <text x="200" y="200" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
      <text x="200" y="270" font-family="Arial,sans-serif" font-size="20" fill="rgba(255,255,255,0.8)" text-anchor="middle">${prompt.slice(0, 25)}</text>
    </svg>`;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response("Error", { status: 500 });
  }
}
