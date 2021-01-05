import { parseCsv } from "./deps.ts";
import { BreakUp } from "./classes/BreakUp.ts";
import { Entry } from "./classes/Entry.ts";
import { convertToEntry, groupBy } from "./services/EntryServices.ts";
import { nonBillablePhaseArray } from "./data/AdditionalData.ts";

const content = await parseCsv(
  await Deno.readTextFile("Report_20210104_2029.csv"),
  {
    skipFirstRow: true,
    separator: ";",
  },
);

function getBillableHours(map: Map<string, Entry[]>): BreakUp[] {
  var summary: BreakUp[] = [];
  for (const key of map.keys()) {
    let billableSum = 0;
    let totalHours = 0;

    map.get(key)?.forEach((element) => {
      totalHours += element.hours;
      if (!nonBillablePhaseArray.includes(element.phase)) {
        billableSum += element.hours;
      }
    });

    const item = new BreakUp(key, totalHours, billableSum);

    item.printInfo();
    summary.push(item);
  }
  return summary;
}

const grouped = groupBy(convertToEntry(content), (item) => item.name);
getBillableHours(grouped);
