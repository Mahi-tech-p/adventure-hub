import {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";

import { activitySlots } from "./activity-slot.schema.js";

export type ActivitySlot = InferSelectModel<
  typeof activitySlots
>;

export type NewActivitySlot = InferInsertModel<
  typeof activitySlots
>;