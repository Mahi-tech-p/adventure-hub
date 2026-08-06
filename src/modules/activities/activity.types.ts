

import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { activities } from "./activity.schems.js";

export type Activity = InferSelectModel<typeof activities>
export type NewActivity = InferInsertModel<typeof activities>