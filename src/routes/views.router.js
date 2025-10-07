import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
  const products = await req.products.getAll();
  res.render("home", { products });
});

router.get("/realtimeProducts", async (req, res) => {
  const products = await req.products.getAll();
  res.render("realtimeProducts", { title: "tiempo real", products });
});

export default router;
