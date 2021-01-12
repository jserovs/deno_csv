import { parseCsv } from "./deps.ts";

import { convertToEntry, groupBy, getBillableHours } from "./services/EntryServices.ts";


const content = await parseCsv(
  await Deno.readTextFile("20210112_1035.csv"),
  {
    skipFirstRow: true,
    separator: ";",
  },
);

const grouped = groupBy(convertToEntry(content), (item) => item.name);
const result = getBillableHours(grouped);

for (const entry of result) {
 entry.printInfo();
}
