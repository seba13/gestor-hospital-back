import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.status(200).json({
    data: "MICROSERVICIO 1"
  });
});

export default indexRouter;
