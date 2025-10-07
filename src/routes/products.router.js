import { Router } from "express";

const router = Router();

//Creamos el producto
router.post("/", async(req,res) => {
    try {
        const created = await req.products.create(req.body);
        const all = await req.products.getAll();
        req.app.get("io").emit("products:updated", all);
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const ok = await req.products.delete(req.params.id);
    if (!ok) return res.status(404).json({ error: "No existe ese id" });
    const all = await req.products.getAll();
    req.app.get("io").emit("products:updated", all); // <- push a todos
    res.json({ status: "deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

