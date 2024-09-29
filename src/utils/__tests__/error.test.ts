import { toError } from "../error";

describe("toError", () => {
  it("should not alter an Error object", () => {
    const error = new Error("This is an error message");
    const result = toError(error);
    expect(result).toBe(error);
  });

  it("should return an Error object with the given message", () => {
    const message = "This is an error message";
    const error = toError(message);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
  });

  it("should return an Error object with the stringified value", () => {
    const value = { key: "value" };
    const error = toError(value);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('{"key":"value"}');
  });
});
