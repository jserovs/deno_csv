import { parseCsv } from './deps.ts';
 
const content = await parseCsv(await Deno.readTextFile('items.csv'), {
  skipFirstRow: true,
  columns: ['item', 'quantity.', 'pricePerItem'],
});

console.log(content);