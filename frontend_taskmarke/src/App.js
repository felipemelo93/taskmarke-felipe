import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import PrivateRoute from './Component/PrivateRoute';
import RecuperarContrasena from './Component/RecuperarContrasena'; // Asegúrate de que el archivo esté bien nombrado
import Register from './Component/Register'; // Asegúrate de que el archivo esté bien nombrado
import EtiquetaCRUD from "./Component/Etiqueta/EtiquetaCRUD";
import TareaCRUD from "./Component/Tarea/TareaCRUD";
import PasswordResetConfirm from "./Component/password-reset-confirm";
import UserProfile from "./Component/UserProfile";
import ChangePassword from "./Component/ChangePassword";


function App() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard token={token} /></PrivateRoute>} />
        <Route path="/recuperar-contraseña" element={<RecuperarContrasena />} />
        <Route path="/password-reset-confirm/:uidb64/:token" element={<PasswordResetConfirm />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/etiqueta" element={<PrivateRoute><EtiquetaCRUD token={token}  /></PrivateRoute>} />
        <Route path="/tarea" element={<PrivateRoute><TareaCRUD token={token}  /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;