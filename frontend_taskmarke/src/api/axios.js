const token = localStorage.getItem('access_token');
if (token) {
  axios.put('http://127.0.0.1:8000/authentification/change-password/', {
    // Datos para cambiar la contraseña
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }).then(response => {
    // Manejar respuesta exitosa
  }).catch(error => {
    // Manejar error
    console.error(error);
  });
}