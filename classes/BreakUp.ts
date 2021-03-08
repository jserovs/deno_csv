class BreakUp {
  private name: string;
  private totalHours: number;
  private billableHours: number;
  constructor(
    name: string,
    totalHours: number,
    billableHours: number,
  ) {
    this.name = name;
    this.totalHours = totalHours;
    this.billableHours = billableHours;
  }

  printInfo(): string {
    const output = this.name + ": customer work = " + this.billableHours +
      ", total hours = " + this.totalHours + ", percentage = " +
      ((this.billableHours / this.totalHours) * 100).toFixed(3);

    console.log(output);

    return output;
  }
}

export { BreakUp };
