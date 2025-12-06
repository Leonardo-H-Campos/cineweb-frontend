import { useEffect, useState } from "react";
import { api } from "../api";
import type { Sessao, Filme, Sala, Ingresso } from "../types";
import { useParams, useNavigate } from "react-router-dom";

export default function VendaIngressoPage() {
  const { id } = useParams(); // id da sessão
  const navigate = useNavigate();

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [tipo, setTipo] = useState<"inteira" | "meia">("inteira");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const sessaoRes = await api.get(`/sessoes/${id}`);
    setSessao(sessaoRes.data);

    const filmeRes = await api.get(`/filmes/${sessaoRes.data.filmeId}`);
    setFilme(filmeRes.data);

    const salaRes = await api.get(`/salas/${sessaoRes.data.salaId}`);
    setSala(salaRes.data);
  }

  async function handleSubmit() {
    const valorBase = 20;
    const valor = tipo === "inteira" ? valorBase : valorBase / 2;

    const ingresso: Ingresso = {
        sessaoId: String(id),
        tipo,
        valor,
        id: ""
    };

    await api.post("/ingressos", ingresso);
    alert("Ingresso vendido com sucesso!");
    navigate("/sessoes");
  }

  if (!sessao || !filme || !sala) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Venda de Ingressos</h2>

      <p><strong>Filme:</strong> {filme.titulo}</p>
      <p><strong>Sala:</strong> {sala.numero}</p>
      <p><strong>Horário:</strong> {new Date(sessao.horarioExibicao).toLocaleString()}</p>

      <div className="mt-3">
        <label className="form-label">Tipo de ingresso</label>
        <select
          className="form-control"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "inteira" | "meia")}
        >
          <option value="inteira">Inteira - R$ 20,00</option>
          <option value="meia">Meia - R$ 10,00</option>
        </select>
      </div>

      <button className="btn btn-success mt-3" onClick={handleSubmit}>
        Confirmar Venda
      </button>
    </div>
  );
}
