import { useEffect, useState } from "react";
import { api } from "../api";
import type { Filme } from "../types";
import { z } from "zod";

// Schema de validação
const filmeSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  sinopse: z.string().min(10, "Sinopse deve ter pelo menos 10 caracteres"),
  classificacao: z.string().min(1, "Informe a classificação"),
  duracao: z.number().positive("A duração deve ser maior que 0"),
  genero: z.string().min(1, "Informe o gênero"),
  dataInicioExibicao: z.string().min(1, "Data inicial obrigatória"),
  dataFinalExibicao: z.string().min(1, "Data final obrigatória"),
});

export default function FilmesPage() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [form, setForm] = useState<Filme>({
    titulo: "",
    sinopse: "",
    classificacao: "",
    duracao: 0,
    genero: "",
    dataInicioExibicao: "",
    dataFinalExibicao: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carregar filmes ao iniciar
  useEffect(() => {
    carregarFilmes();
  }, []);

  async function carregarFilmes() {
    const { data } = await api.get("/filmes");
    setFilmes(data);
  }

  // Enviar formulário
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Converter duração para number
    const dados = {
      ...form,
      duracao: Number(form.duracao),
    };

    const result = filmeSchema.safeParse(dados);

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



    // Sem erros 👉 enviar para API
    await api.post("/filmes", dados);
    setForm({
      titulo: "",
      sinopse: "",
      classificacao: "",
      duracao: 0,
      genero: "",
      dataInicioExibicao: "",
      dataFinalExibicao: "",
    });
    setErrors({});
    carregarFilmes();
  }

  async function excluirFilme(id: string) {
    await api.delete(`/filmes/${id}`);
    carregarFilmes();
  }

  return (
    <div>
      <h2>Cadastrar Filme</h2>

      {/* FORMULÁRIO */}
      <form className="row g-3" onSubmit={handleSubmit}>
        {/* Título */}
        <div className="col-md-6">
          <label className="form-label">Título</label>
          <input
            type="text"
            className={`form-control ${errors.titulo ? "is-invalid" : ""}`}
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
          {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
        </div>

        {/* Classificação */}
        <div className="col-md-3">
          <label className="form-label">Classificação</label>
          <input
            type="text"
            className={`form-control ${errors.classificacao ? "is-invalid" : ""}`}
            value={form.classificacao}
            onChange={(e) => setForm({ ...form, classificacao: e.target.value })}
          />
          {errors.classificacao && <div className="invalid-feedback">{errors.classificacao}</div>}
        </div>

        {/* Duração */}
        <div className="col-md-3">
          <label className="form-label">Duração (min)</label>
          <input
            type="number"
            className={`form-control ${errors.duracao ? "is-invalid" : ""}`}
            value={form.duracao}
            onChange={(e) => setForm({ ...form, duracao: Number(e.target.value) })}
          />
          {errors.duracao && <div className="invalid-feedback">{errors.duracao}</div>}
        </div>

        {/* Gênero */}
        <div className="col-md-4">
          <label className="form-label">Gênero</label>
          <input
            type="text"
            className={`form-control ${errors.genero ? "is-invalid" : ""}`}
            value={form.genero}
            onChange={(e) => setForm({ ...form, genero: e.target.value })}
          />
          {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
        </div>

        {/* Datas */}
        <div className="col-md-4">
          <label className="form-label">Início da Exibição</label>
          <input
            type="date"
            className={`form-control ${errors.dataInicioExibicao ? "is-invalid" : ""}`}
            value={form.dataInicioExibicao}
            onChange={(e) => setForm({ ...form, dataInicioExibicao: e.target.value })}
          />
          {errors.dataInicioExibicao && (
            <div className="invalid-feedback">{errors.dataInicioExibicao}</div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label">Fim da Exibição</label>
          <input
            type="date"
            className={`form-control ${errors.dataFinalExibicao ? "is-invalid" : ""}`}
            value={form.dataFinalExibicao}
            onChange={(e) => setForm({ ...form, dataFinalExibicao: e.target.value })}
          />
          {errors.dataFinalExibicao && (
            <div className="invalid-feedback">{errors.dataFinalExibicao}</div>
          )}
        </div>

        {/* Sinopse */}
        <div className="col-12">
          <label className="form-label">Sinopse</label>
          <textarea
            className={`form-control ${errors.sinopse ? "is-invalid" : ""}`}
            value={form.sinopse}
            onChange={(e) => setForm({ ...form, sinopse: e.target.value })}
          />
          {errors.sinopse && <div className="invalid-feedback">{errors.sinopse}</div>}
        </div>

        <div className="col-12">
          <button className="btn btn-primary">Cadastrar Filme</button>
        </div>
      </form>

      <hr />

      {/* LISTAGEM */}
      <h3>Filmes Cadastrados</h3>

      {filmes.length === 0 && <p>Nenhum filme cadastrado ainda.</p>}

      <ul className="list-group mt-3">
        {filmes.map((filme) => (
          <li key={filme.id} className="list-group-item d-flex justify-content-between">
            <div>
              <strong>{filme.titulo}</strong> — {filme.genero} ({filme.duracao} min)
            </div>

            <button className="btn btn-danger btn-sm"
              onClick={() => excluirFilme(filme.id!)}>
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
