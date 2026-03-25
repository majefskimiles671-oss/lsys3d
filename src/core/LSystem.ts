export class LSystem {
  constructor(
    public axiom: string,
    public rules: Record<string, string>
  ) {}

  generate(iterations: number): string {
    let current = this.axiom;

    for (let i = 0; i < iterations; i++) {
      let next = "";
      for (const c of current) {
        next += this.rules[c] ?? c;
      }
      current = next;
    }

    return current;
  }
}