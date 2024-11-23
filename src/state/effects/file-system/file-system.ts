import { Stringifier, stringify } from "csv-stringify";

/**
 * Save a file to the user's file system.
 */
async function saveFile(fileName: string) {
  const streamSaver = (await import("streamsaver")).default;
  return streamSaver.createWriteStream(fileName);
}

/**
 * Save a CSV file to the user's file system.
 */
export async function saveCSVFile(fileName: string, columns: string[]): Promise<Stringifier> {
  const writeStream = await saveFile(fileName);
  const writer = writeStream.getWriter();
  const stringifier = stringify({ header: true, columns, delimiter: "," });

  stringifier.on("readable", () => {
    let chunk;
    // eslint-disable-next-line no-cond-assign
    while ((chunk = stringifier.read()) !== null) {
      writer.write(chunk);
    }
  });
  stringifier.on("error", (e) => {
    // eslint-disable-next-line no-console
    console.error("Error while writing to file", e);
    writer.abort();
  });
  stringifier.on("finish", () => {
    writer.close();
  });

  return stringifier;
}
