const socket = io();

const $list = document.getElementById("list");
const render = (products) => {
  $list.innerHTML = products.map(p => `
    <li data-id="${p.id}" style="margin-bottom:8px;">
      <b>#${p.id}</b> — ${p.title} ($${p.price})
      <button class="btn-delete" data-id="${p.id}"
        style="margin-left:8px;background:#e74c3c;color:white;
        border:none;border-radius:4px;padding:2px 6px;cursor:pointer;">
        Eliminar
      </button>
    </li>
  `).join("");

  // escuchamos clicks en los botones de eliminar
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    });
  });
};

socket.on("connect", () => {
  console.log("✅ Conectado a WS: ", socket.id);
});

socket.on("products:init", (list) => {
  console.log("📦 lista inicial recibida:", list);
  render(list);
});

socket.on("products:updated", (list) => {
  console.log("♻️ lista actualizada:", list);
  render(list);
});

// Crear via HTTP
document.getElementById("form-create")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const title = fd.get("title")?.trim();
  const price = Number(fd.get("price"));

  // validaciones básicas
  if (!title) return alert("⚠️ El nombre no puede estar vacío");
  if (isNaN(price) || price <= 0) return alert("⚠️ Precio inválido");

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, price })
  });

  if (res.ok) {
    alert("✅ Producto agregado correctamente");
    e.target.reset();
  } else {
    const { error } = await res.json();
    alert("❌ Error: " + error);
  }
});

// Eliminar via HTTP
document.getElementById("form-delete")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = new FormData(e.target).get("id");
  await fetch(`/api/products/${id}`, { method: "DELETE" });
  e.target.reset();
});