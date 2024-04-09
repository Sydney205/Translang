import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import fetch from "node-fetch";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Translang server is live!");
});

app.post("/translate", async (c) => {
  const body = await c.req.parseBody();

  let srcLang: string | number | File | (string | File)[] = body.srcLang
  let tarLang: string | number | File | (string | File)[] = body.tarLang
  let textToTranslate: string | number | File | (string | File)[] = body.textToTranslate

  const translation = await transLang(srcLang, tarLang, textToTranslate);

  console.log(`${translation}`);
  return c.text(`${translation}`);
});

const port: number = parseInt(process.env.PORT || '3000', 10);
console.log(`\n\x1B[91m[Hono]:\x1B[0m Server is running on port ${port}\n`);

serve({
  fetch: app.fetch,
  port,
});

// Let's translate...
async function transLang(src: any, tar: any, text: any) {
  try {
    const res = await fetch(
      "https://translate.terraprint.co/translate", // Libretranslate API
      {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: src,
          target: tar,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json() as { translatedText: string }; // Await the JSON parsing
    return data.translatedText;
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}
