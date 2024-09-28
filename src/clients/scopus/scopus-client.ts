import { Zodios } from "@zodios/core";
import { api } from "./schema";

export const scopus = new Zodios("https://api.elsevier.com", api, { sendDefaults: true });
