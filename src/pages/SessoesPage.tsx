import { useEffect, useState } from "react";
import { api } from "../api";
import type { Filme, Sala, Sessao, Ingresso } from "../types";
import { useNavigate } from "react-router-dom";

export default function SessoesPage() {
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);

  const [form, setForm] = useState({
    filmeId: "",
    salaId: "",
    horarioExibicao: "",
  });
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);


  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    carregarDados();
  }, []);

async function carregarDados() {
  const filmesRes = await api.get("/filmes");
  const salasRes = await api.get("/salas");
  const sessoesRes = await api.get("/sessoes");
  const ingressosRes = await api.get("/ingressos"); 

  setFilmes(filmesRes.data);
  setSalas(salasRes.data);
  setSessoes(sessoesRes.data);
  setIngressos(ingressosRes.data);                  
}


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const novosErros: Record<string, string> = {};

    // Agora garantimos que NÃO envia "" nem null
    if (!form.filmeId || form.filmeId.trim() === "")
      novosErros.filmeId = "Selecione um filme";

    if (!form.salaId || form.salaId.trim() === "")
      novosErros.salaId = "Selecione uma sala";

    if (!form.horarioExibicao)
      novosErros.horarioExibicao = "Informe a data da sessão";

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      return;
    }

    // Como seus IDs no db.json são STRINGS, enviamos string mesmo
    const payload = {
      filmeId: form.filmeId,
      salaId: form.salaId,
      horarioExibicao: form.horarioExibicao,
    };

    await api.post("/sessoes", payload);

    setForm({
      filmeId: "",
      salaId: "",
      horarioExibicao: "",
    });

    setErrors({});
    carregarDados();
  }

  function getFilmeNome(id: string) {
    return filmes.find(f => f.id === id)?.titulo || "Filme não encontrado";
  }

  function getSalaNumero(id: string) {
    return salas.find(s => s.id === id)?.numero || "Sala não encontrada";
  }

  function getSalaCapacidade(id: string) {
  return salas.find(s => s.id === id)?.capacidade ?? 0;
}

function getIngressosVendidos(sessaoId: string) {
  return ingressos.filter(i => i.sessaoId === sessaoId).length;
}


  return (
    <div>
      <h2>Agendar Sessão</h2>

      <form className="row g-3" onSubmit={handleSubmit}>

        {/* Filme */}
        <div className="col-md-4">
          <label className="form-label">Filme</label>
          <select
            className={`form-control ${errors.filmeId ? "is-invalid" : ""}`}
            value={form.filmeId}
            onChange={(e) => setForm({ ...form, filmeId: e.target.value })}
          >
            <option value="">Selecione</option>
            {filmes.map((filme) => (
              <option key={filme.id} value={filme.id}>
                {filme.titulo}
              </option>
            ))}
          </select>
          {errors.filmeId && (
            <div className="invalid-feedback">{errors.filmeId}</div>
          )}
        </div>

        {/* Sala */}
        <div className="col-md-4">
          <label className="form-label">Sala</label>
          <select
            className={`form-control ${errors.salaId ? "is-invalid" : ""}`}
            value={form.salaId}
            onChange={(e) => setForm({ ...form, salaId: e.target.value })}
          >
            <option value="">Selecione</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.id}>
                Sala {sala.numero}
              </option>
            ))}
          </select>
          {errors.salaId && (
            <div className="invalid-feedback">{errors.salaId}</div>
          )}
        </div>

        {/* Data/Hora */}
        <div className="col-md-4">
          <label className="form-label">Data e Hora</label>
          <input
            type="datetime-local"
            className={`form-control ${errors.horarioExibicao ? "is-invalid" : ""}`}
            value={form.horarioExibicao}
            onChange={(e) =>
              setForm({ ...form, horarioExibicao: e.target.value })
            }
          />
          {errors.horarioExibicao && (
            <div className="invalid-feedback">{errors.horarioExibicao}</div>
          )}
        </div>

        <div className="col-12">
          <button className="btn btn-primary">Agendar Sessão</button>
        </div>
      </form>

      <hr />

      <h3>Sessões Agendadas</h3>

      <ul className="list-group mt-3">
        {sessoes.map((s) => {
const vendidos = getIngressosVendidos(s.id!);
const capacidade = getSalaCapacidade(s.salaId!);

  return (
    <li key={s.id} className="list-group-item d-flex justify-content-between">
      <div>
        <strong>{getFilmeNome(s.filmeId)}</strong> — Sala {getSalaNumero(s.salaId)}
        <br />
        <small>{new Date(s.horarioExibicao).toLocaleString()}</small>
        <br />
        <small>
          Ingressos vendidos: {vendidos} / {capacidade}
        </small>
      </div>

      <button
        className="btn btn-success btn-sm"
        onClick={() => navigate(`/vender/${s.id}`)}
      >
        <i className="bi bi-ticket-perforated"></i> Vender Ingresso
      </button>
    </li>
  );
})}

      </ul>
    </div>
  );
}
