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

  printInfo() {
    console.log(
      this.name + ": billable hours = " + this.billableHours +
        ", total hours = " +
        this.totalHours + ", percentage = " +
        ((this.billableHours / this.totalHours) * 100).toFixed(3),
    );
  }
}

export { BreakUp };
