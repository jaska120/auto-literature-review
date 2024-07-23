/**
 * Convert an unknown value to an Error object.
 * If the input is already an Error object, it is returned as is.
 * If the input is a string, it is used as the message of the Error object.
 * @param e The unknown value to convert.
 * @returns An Error object.
 */
export function toError(e: unknown): Error {
  if (e instanceof Error) {
    return e;
  }
  if (typeof e === "string") {
    return new Error(e);
  }
  try {
    const str = JSON.stringify(e);
    return new Error(str);
  } catch (err) {
    return new Error("Cannot convert to string");
  }
}
