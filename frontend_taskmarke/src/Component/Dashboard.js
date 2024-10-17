import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from "./Menu";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import KanbanBoard from './KanbanBoard';


const Dashboard = ({ token }) => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const API_URL = 'http://127.0.0.1:8000/authentification/current-user/';

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, [token]);

    if (!userInfo) {
        return <div>Cargando información del usuario...</div>;
    }

    return (
        <div className="bg-white text-dark min-vh-100">
            <Menu userInfo={userInfo} />
            <div className="container mt-4">
               
                
                <KanbanBoard token={token} />
            </div>
        </div>
    );
};

export default Dashboard;