import { serve } from "https://deno.land/std/http/server.ts";

import { parse } from "https://deno.land/std/flags/mod.ts";
import {
  FormFile,
  multiParser,
} from "https://deno.land/x/multiparser@v2.0.3/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";

import { parseCsv } from "./deps.ts";
import {
  convertToEntry,
  getBillableHours,
  groupBy,
} from "./services/EntryServices.ts";
import { BreakUp } from "./classes/BreakUp.ts";

const { args } = Deno;
const DEFAULT_PORT = 8083;
const argPort = parse(args).port;

var output:string;

const server = serve({ port: argPort ? Number(argPort) : DEFAULT_PORT });
console.log(`🦕 Deno server running 🦕`);

for await (const req of server) {


  if (req.url === "/upload") {

    console.log (req.headers);
    console.log(req.headers.get("content-type"));
    const form = await multiParser(req);
    console.log ("multiparser")
    console.log (form);
    if (form) {
      console.log ("form")
      // getting file contents from upload
      const f = <FormFile> form.files["csv"];
      // creating reader from file content buffer
      const reader = new Deno.Buffer(f.content.buffer as ArrayBuffer);
      // parsing from created buffer
      const content = await parseCsv(BufReader.create(reader), {
        skipFirstRow: true,
        separator: ";",
      });

      console.log (content);

      const grouped = groupBy(convertToEntry(content), (item) => item.name);

      // console.log (grouped);
      const result = getBillableHours(grouped);

      output = "";

      for (const entry of result) {
        // console.log (entry);
        output += "<p>"+entry.printInfo()+"</p>";
      }

      await req.respond({
        // headers: new Headers({"Content-Type": "application/json; charset=utf-8"}),
        headers: new Headers({ "Content-Type": "text/html; charset=utf-8" }),
        // body: JSON.stringify(result, undefined, 2)

        body: output,
      });
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
