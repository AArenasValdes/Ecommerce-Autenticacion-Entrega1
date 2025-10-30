import { UserModel } from '../models/user.model.js';
import { createHash } from '../utils/bcrypt.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, '-password').lean(); // excluye password
    res.json({ status: 'ok', users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.uid, '-password').lean();
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ status: 'ok', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email ya registrado' });

    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role: role ?? 'user',
    });

    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json({ status: 'ok', user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = { ...req.body };
    if (data.password) data.password = createHash(data.password);

    const updated = await UserModel.findByIdAndUpdate(uid, data, { new: true, projection: '-password' });
    if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ status: 'ok', user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const deleted = await UserModel.findByIdAndDelete(uid);
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ status: 'ok', message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};