import { Express } from "express"
import { getAllUsersHandler } from "./User/user.controller"

export default function routes(app: Express) {
	app.get("/api/v1/users", getAllUsersHandler)
}
