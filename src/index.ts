import express from "express";
import routes from "./routes";
import morgan from "morgan"

const app = express();
app.use(morgan("dev"))  // Adding the basic sever logging.
app.use(express.json());
app.use("/api", routes);

// catch-all error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ 
    error: "something went wrong" 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
