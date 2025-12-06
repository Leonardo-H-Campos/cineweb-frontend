import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">CineWeb</Link>

        <div className="navbar-nav">
          <NavLink className="nav-link" to="/filmes">Filmes</NavLink>
          <NavLink className="nav-link" to="/salas">Salas</NavLink>
          <NavLink className="nav-link" to="/sessoes">Sessões</NavLink>
        </div>
      </div>
    </nav>
  );
}
