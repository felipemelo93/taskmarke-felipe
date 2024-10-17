import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const Menu = ({ userInfo }) => {
    const [showTaskList, setShowTaskList] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    const taskListRef = useRef(null);
    const userDropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/', { replace: true });
    };

    const toggleTaskList = () => {
        setShowTaskList(!showTaskList);
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
    };

    const handleDashboardRedirect = () => {
        navigate('/dashboard');
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('YOUR_API_ENDPOINT', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error al subir la imagen');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setProfileImage(null);
        }
    };

    // Cerrar dropdowns al hacer clic fuera de ellos
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (taskListRef.current && !taskListRef.current.contains(event.target)) {
                setShowTaskList(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div className="container-fluid">
                {/* Logo estilo tareas */}
                <div className="logo-container" onClick={handleDashboardRedirect} style={{ cursor: 'pointer' }}>
                    <div className="task-icon">
                        <div className="checkbox"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                    <span className="logo-text">Taskmarke</span>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown" ref={taskListRef}>
                            <span className="nav-link dropdown-toggle" onClick={toggleTaskList} style={{ cursor: "pointer" }}>
                                Gestión Tarea
                            </span>
                            {showTaskList && (
                                <ul className="dropdown-menu show">
                                    <li><Link className="dropdown-item" to="/etiqueta">Etiqueta</Link></li>
                                    <li><Link className="dropdown-item" to="/tarea">Tarea</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Reportes">Reportes</Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto" style={{ display: "flex", alignItems: "center" }}>
                        <li className="nav-item dropdown" style={{ display: "flex", alignItems: "center" }} ref={userDropdownRef}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                id="profileImageInput"
                            />
                            <label htmlFor="profileImageInput" style={{ cursor: "pointer", marginRight: "5px" }}>
                                <img 
                                    src={profileImage || "https://via.placeholder.com/30"} 
                                    alt="Perfil"
                                    style={{ width: "30px", height: "30px", borderRadius: "50%" }} 
                                />
                            </label>
                            <div className="dropdown" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <span className="nav-link dropdown-toggle" onClick={toggleUserDropdown} style={{ cursor: "pointer" }}>
                                    {userInfo?.nombre} {userInfo?.apellido}
                                </span>
                                {showUserDropdown && (
                                    <ul className="dropdown-menu dropdown-menu-right show" style={{ marginTop: '40px' }}>
                                        <li><Link className="dropdown-item" to="/userprofile">Datos de Usuario</Link></li>
                                        <li><Link className="dropdown-item" to="/changepassword">Cambiar Contraseña</Link></li>
                                        <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
                                    </ul>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Menu;
