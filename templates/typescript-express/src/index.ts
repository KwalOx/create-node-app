import express from "express"
import { env } from "./env"
import routes from "./routes"
import cors from "cors"
import bodyParser from "body-parser"
import helmet from "helmet"

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(helmet())

routes(app)

app.listen(env.port, () => console.log(`Express running port ${env.port}`))
