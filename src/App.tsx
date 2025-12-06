import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";

import FilmesPage from "./pages/FilmesPage";
import SalasPage from "./pages/SalasPage";
import SessoesPage from "./pages/SessoesPage";
import VendaIngressoPage from "./pages/VendaIngressoPage";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<h3>Bem-vindo ao CineWeb!</h3>} />

          <Route path="/filmes" element={<FilmesPage />} />
          <Route path="/salas" element={<SalasPage />} />
          <Route path="/sessoes" element={<SessoesPage />} />
          <Route path="/vender/:id" element={<VendaIngressoPage />} />


          <Route path="*" element={<h4>Página não encontrada</h4>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
