import fs from "fs/promises";
import path from "path";

export default class ProductManager {
  constructor(filePath) {
    //Guardamos la ruta absoluta
    this.path = path.resolve(filePath);
  }
  //Helpers privados

  async #read() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      //Si el archivo esta vacio
      return data.trim() ? JSON.parse(data) : [];
    } catch (err) {
      //Si no existe devolvemos [] objeto vacio
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  async #write(list) {
    await fs.writeFile(this.path, JSON.stringify(list, null, 2));
  }

  //API Publica

  async getAll() {
    const list = await this.#read();
    return list;
  }

  async create({ title, price }) {
    //validaciones
    if (!title || typeof title !== "string") {
      throw new Error("titulo requerido (string)");
    }
    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice < 0) {
      throw new Error("price invalido (numero >= 0)");
    }

    const list = await this.#read();

    //creamos el id autoincremental
    const nextId = list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;

    const product = {
      id: nextId,
      title: title.trim(),
      price: numPrice,
    };
    list.push(product);
    await this.#write(list);
    return product;
  }

  async delete(id) {
    const numId = Number(id);
    if (Number.isNaN(numId)) throw new Error("Id invalido");

    const list = await this.#read();
    const before = list.length;
    const after = list.filter((u) => u.id !== numId);

    if (after.length === before) {
      //no existe ese id
      return false;
    }
    await this.#write(after);
    return true;
  }
}
