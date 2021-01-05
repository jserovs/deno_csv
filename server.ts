// deno run --allow-net --allow-read standard-library.ts
// Docs: https://deno.land/std/http
import { serve } from "https://deno.land/std/http/server.ts";
const s = serve({ port: 8070 });
console.log(`🦕 Deno server running at http://localhost:8070/ 🦕`);
for await (const req of s) {
  req.respond({ body: "Hello from your first Deno server" });
}
