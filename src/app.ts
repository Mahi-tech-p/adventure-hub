import express from "express"
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";
const app = express();

app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

app.get('/health', (req,res) => {
    res.status(200).json({
        success: true,
        message:"Adventure Hib API is running"
    })
})

app.use("/api/v1/", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});



app.use(errorHandler)
export default app