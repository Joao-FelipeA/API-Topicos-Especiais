import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importe os componentes de roteamento

// Importe suas páginas (ajuste os caminhos se necessário)
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Servicos } from "./pages/Servicos"; // Importe a nova página de Serviços
import Clientes from "./pages/Clientes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal/inicial (protegida) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rota de Serviços (protegida) */}
        <Route
          path="/servicos"
          element={
            <ProtectedRoute>
              <Servicos />
            </ProtectedRoute>
          }
        />

        {/* Rota de Clientes (protegida) */}
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
