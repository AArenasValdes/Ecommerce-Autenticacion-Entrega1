export default function errorHandler(err, req, res, next) {
  console.error("❌ Error no manejado:", err);
  res.status(500).json({ status: "error", error: "internal server error" });
}
