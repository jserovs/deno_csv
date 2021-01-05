import { parseDate } from "../deps.ts";
import { Entry } from "../classes/Entry.ts";
import { BreakUp } from "../classes/BreakUp.ts";
import { nonBillablePhaseArray } from "../data/AdditionalData.ts";

function convertToEntry(list: any): Entry[] {
  var entryList: Entry[] = [];
  var hours: number;
  var date: Date;
  var name: string;
  var customer: string;
  var project: string;
  var phase: string;
  list.forEach((element: any) => {
    if (typeof element === "object") {
      // const list: string[] = ["Hours", "Date", "Person", "Account","Case", "Phase"];
      for (const i in element) {
        if (i.includes("Hours")) hours = parseFloat(element[i]);
        if (i.includes("Date")) date = parseDate(element[i], "dd/MM/yyyy");
        if (i.includes("Person")) name = element[i];
        if (i.includes("Account")) customer = element[i];
        if (i.includes("Case")) project = element[i];
        if (i.includes("Phase")) phase = element[i];
      }
      const entry: Entry = {
        name: name,
        date: date,
        hours: hours,
        customer: customer,
        project: project,
        phase: phase,
      };

      entryList.push(entry);
    }
  });
  return entryList;
}

function groupBy(
  list: Entry[],
  keyGetter: (arg0: any) => any,
): Map<string, Entry[]> {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

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

export { convertToEntry, groupBy, getBillableHours };
