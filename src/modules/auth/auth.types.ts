import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { refreshTokens, users } from "./auth.schema.js";


export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type RefreshToken = InferInsertModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>