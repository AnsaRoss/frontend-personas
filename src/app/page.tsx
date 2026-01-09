'use client';
import { useEffect, useState } from 'react';

interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
}

const API_URL = 'http://localhost:3000/personas';

export default function Home() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [form, setForm] = useState<Persona>({
    nombre: '',
    apellido: '',
    edad: 0,
    email: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = async () => {
    const res = await fetch(API_URL);
    setPersonas(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'edad' ? Number(value) : value });
  };

  const save = async () => {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    resetForm();
    load();
  };

  const edit = (p: Persona) => {
    setForm(p);
    setEditingId(p.id!);
  };

  const remove = async (id?: number) => {
    if (!id || !confirm('¿Eliminar persona?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    load();
  };

  const resetForm = () => {
    setForm({ nombre: '', apellido: '', edad: 0, email: '' });
    setEditingId(null);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HEADER */}
        <h1 className="text-3xl font-bold">CRUD Personas</h1>

        {/* FORM */}
        <div className="bg-white text-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Editar Persona' : 'Nueva Persona'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre"
              className="input" />
            <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido"
              className="input" />
            <input name="edad" type="number" value={form.edad} onChange={handleChange} placeholder="Edad"
              className="input" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email"
              className="input" />
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={save}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editingId ? 'Actualizar' : 'Guardar'}
            </button>

            {editingId && (
              <button onClick={resetForm}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="th">Nombre</th>
                <th className="th">Apellido</th>
                <th className="th">Edad</th>
                <th className="th">Email</th>
                <th className="th text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personas.map(p => (
                <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="td">{p.nombre}</td>
                  <td className="td">{p.apellido}</td>
                  <td className="td">{p.edad}</td>
                  <td className="td">{p.email}</td>
                  <td className="td text-center space-x-2">
                    <button onClick={() => edit(p)} className="text-yellow-400">✏️</button>
                    <button onClick={() => remove(p.id)} className="text-red-500">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* helpers */}
      <style jsx>{`
        .input {
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 6px;
          width: 100%;
        }
        .th {
          padding: 12px;
          text-align: left;
        }
        .td {
          padding: 12px;
        }
      `}</style>
    </main>
  );
}
