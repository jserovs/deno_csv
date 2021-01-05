import { parseCsv } from "./deps.ts";

import { convertToEntry, groupBy, getBillableHours } from "./services/EntryServices.ts";


const content = await parseCsv(
  await Deno.readTextFile("Report_20210104_2029.csv"),
  {
    skipFirstRow: true,
    separator: ";",
  },
);

const grouped = groupBy(convertToEntry(content), (item) => item.name);
getBillableHours(grouped);
