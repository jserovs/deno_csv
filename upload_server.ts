import { serve } from "https://deno.land/std/http/server.ts";
import {
  FormFile,
  multiParser,
} from "https://deno.land/x/multiparser@v2.0.3/mod.ts";
import { BufReader } from "https://deno.land/std@0.82.0/io/bufio.ts";

import {} from "./app.ts";

import { parseCsv, parseDate } from "./deps.ts";

const s = serve({ port: 8070 });
console.log(`🦕 Deno server running at http://localhost:8070/ 🦕`);

type Reader = Deno.Reader;

for await (const req of s) {
  if (req.url === "/upload") {
    const form = await multiParser(req);
    if (form) {
      console.log(form);

      if (form.files["csv"] instanceof Array) {
        console.log("array");
      } // if file exists, convert it to array
      else if (form.files["csv"]) {
        console.log("single");
        // getting file contents from upload
        const f = <FormFile> form.files["csv"];
        // creating reader from file content buffer
        const reader = new Deno.Buffer(f.content.buffer as ArrayBuffer);
        // parsing from created buffer
        const content = await parseCsv(BufReader.create(reader), {
          skipFirstRow: true,
          separator: ";",
        });
        console.log(content);
      }
    }
  }

  req.respond({
    headers: new Headers({ "Content-Type": "text/html; charset=utf-8" }),
    body: `
    <h3>Deno http module</h3>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <div>CSV: <input type="file" name="csv"/></div>
      <input type="submit" value="Upload" />
    </form>
  `,
  });
}
