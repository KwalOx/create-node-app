import User from "./user.model"

const exampleUsers = [
	new User(0, "John", "Doe"),
	new User(1, "Jane", "Doe"),
]

export function getAllUsers(): [User[] | null, unknown | null] {
	try {
		return [exampleUsers, null]
	} catch (e){
		return [null, e]
	}
}
