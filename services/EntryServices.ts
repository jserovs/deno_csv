import { parseDate } from "../deps.ts";
import { Entry } from "../classes/Entry.ts";

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

export { convertToEntry, groupBy };
