import { Request, Response } from "express";
import { getAllUsers } from "./user.service";

export async function getAllUsersHandler(req: Request, res: Response) {
	const [users, error] = getAllUsers();
	if (error) {
		console.log(error)
		return res.status(500).send("Something went wrong")
	}
	
	return res.json({data: users})
}
