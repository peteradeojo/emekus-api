import { Router } from "express";

const router = Router();

export default function () {
  router.get("/", (req, res) => {
    res.json({ name: "baba" });
  });

  return router;
}
