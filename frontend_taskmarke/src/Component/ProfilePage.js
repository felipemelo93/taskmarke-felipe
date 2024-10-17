import React from 'react';
import UserProfile from './UserProfile'; // Componente para editar perfil
import ChangePassword from './ChangePassword'; // Componente para cambiar contraseña

const ProfilePage = () => {
  return (
    <div>
      <h1>Mi Perfil</h1>
      <UserProfile />
      <ChangePassword />
    </div>
  );
};

export default ProfilePage;