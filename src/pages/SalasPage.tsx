import { useEffect, useState } from "react";
import { api } from "../api";
import type { Sala } from "../types";
import { z } from "zod";

const salaSchema = z.object({
  numero: z.number().positive("O número da sala deve ser positivo"),
  capacidade: z.number().positive("A capacidade deve ser maior que 0"),
});

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [form, setForm] = useState<Sala>({
    numero: 0,
    capacidade: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    carregarSalas();
  }, []);

  async function carregarSalas() {
    const { data } = await api.get("/salas");
    setSalas(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const dados = {
      numero: Number(form.numero),
      capacidade: Number(form.capacidade),
    };

    const result = salaSchema.safeParse(dados);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      if (result.error instanceof z.ZodError) {
        result.error.issues.forEach((err) => {
          const field = err.path[0] as string;
          if (field) fieldErrors[field] = err.message;
        });
      }

      setErrors(fieldErrors);
      return;
    }

    await api.post("/salas", dados);

    setForm({ numero: 0, capacidade: 0 });
    setErrors({});

    carregarSalas();
  }

  return (
    <div>
      <h2>Cadastrar Sala</h2>

      <form className="row g-3" onSubmit={handleSubmit}>
        {/* Número da sala */}
        <div className="col-md-4">
          <label className="form-label">Número da Sala</label>
          <input
            type="number"
            className={`form-control ${errors.numero ? "is-invalid" : ""}`}
            value={form.numero}
            onChange={(e) => setForm({ ...form, numero: Number(e.target.value) })}
          />
          {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
        </div>

        {/* Capacidade */}
        <div className="col-md-4">
          <label className="form-label">Capacidade</label>
          <input
            type="number"
            className={`form-control ${errors.capacidade ? "is-invalid" : ""}`}
            value={form.capacidade}
            onChange={(e) => setForm({ ...form, capacidade: Number(e.target.value) })}
          />
          {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
        </div>

        <div className="col-12">
          <button className="btn btn-primary">Cadastrar Sala</button>
        </div>
      </form>

      <hr />

      <h3>Salas Cadastradas</h3>

      <ul className="list-group mt-3">
        {salas.map((sala) => (
          <li key={sala.id} className="list-group-item">
            Sala <strong>{sala.numero}</strong> — Capacidade: {sala.capacidade}
          </li>
        ))}
      </ul>
    </div>
  );
}
