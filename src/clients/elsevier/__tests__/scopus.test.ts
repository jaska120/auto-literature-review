import { Scopus } from "../scopus";

describe("Scopus client", () => {
  it("should create an instance", async () => {
    const scopus = new Scopus({ apiKey: "test" });
    expect(scopus).toBeInstanceOf(Scopus);
  });
});
