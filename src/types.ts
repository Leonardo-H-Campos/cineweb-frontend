export interface Filme {
  id?: string;
  titulo: string;
  sinopse: string;
  classificacao: string;
  duracao: number;
  genero: string;
  dataInicioExibicao: string;
  dataFinalExibicao: string;
}

export interface Sala {
  id?: string;
  numero: number;
  capacidade: number;
}

export interface Sessao {
  id?: string;
  filmeId: string;
  salaId: string;
  horarioExibicao: string; // datetime
}

export interface SessaoForm {
  filmeId: string;
  salaId: string;
  horarioExibicao: string;
}

export interface Ingresso {
  id: string;
  sessaoId: string; 
  tipo: "inteira" | "meia";
  valor: number;
}
