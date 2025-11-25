import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importe os componentes de roteamento

// Importe suas páginas (ajuste os caminhos se necessário)
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Servicos } from "./pages/Servicos"; // Importe a nova página de Serviços

function App() {
  return (
    // O BrowserRouter deve envolver todo o seu sistema de rotas
    <BrowserRouter>
      {/* Opcional: Adicionar um NavBar ou Header aqui, fora das Rotas */}
      
      <Routes>
        {/* Rota principal/inicial */}
        <Route path="/" element={<Home />} /> 
        
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota de Serviços (A NOVA TELA) */}
        <Route path="/servicos" element={<Servicos />} />

        {/* Adicione outras rotas conforme necessário (e.g., /servicos/:id para detalhes) */}
        
        {/* Opcional: Rota 404 para caminhos não encontrados */}
        {/* <Route path="*" element={<div>404: Página Não Encontrada</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;