import {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import { parks } from "./park.schema.js";

export type Park = InferSelectModel<typeof parks>;

export type NewPark = InferInsertModel<typeof parks>;
