import { serve } from "https://deno.land/std/http/server.ts";

import { parse } from "https://deno.land/std/flags/mod.ts";
import {
  FormFile,
  multiParser,
} from "https://deno.land/x/multiparser@v2.0.3/mod.ts";
import { BufReader } from "https://deno.land/std@0.82.0/io/bufio.ts";

import { parseCsv } from "./deps.ts";
import { convertToEntry, getBillableHours, groupBy } from "./services/EntryServices.ts";

const { args } = Deno;
const DEFAULT_PORT = 8000;
const argPort = parse(args).port;

const s = serve({ port: argPort ? Number(argPort) : DEFAULT_PORT });
console.log(`🦕 Deno server running 🦕`);

type Reader = Deno.Reader;

for await (const req of s) {
  if (req.url === "/upload") {
    const form = await multiParser(req);
    if (form) {
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
      
      const grouped = groupBy(convertToEntry(content), (item) => item.name);
      const result = await getBillableHours(grouped);

      req.respond({
        headers: new Headers({"Content-Type": "application/json; charset=utf-8"}),
        body: JSON.stringify(result)
      })
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
