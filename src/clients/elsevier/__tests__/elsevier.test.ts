import { Elsevier } from "../elsevier";

describe("Elsevier client", () => {
  it("should create an instance", () => {
    const elsevier = new Elsevier();
    expect(elsevier).toBeInstanceOf(Elsevier);
  });
});
