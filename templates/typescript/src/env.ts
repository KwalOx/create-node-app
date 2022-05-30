import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === "test") ? ".test" : "")}`) });

export const env = {
	node: process.env.NODE_ENV || "development",
	isProduction: process.env.NODE_ENV === "production",
	isTest: process.env.NODE_ENV === "test",
	isDevelopment: process.env.NODE_ENV === "development",
}
