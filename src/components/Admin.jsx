import React from 'react'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import Registro from './Registro-libro'

const Admin = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (auth.currentUser) {
            setUser(auth.currentUser);
            if (props.firebaseRol !== "Admin") {
                navigate('/Reservas');
            } else {
                navigate('/admin');
            }
        } else {
            navigate('/login');
        }
    }, [props.firebaseRol, navigate]);

    React.useEffect(() => {
        setLoading(false); // Indica que la carga ha finalizado
    }, []);

    if (loading) {
        return <p>Loading...</p>; // Muestra un mensaje de carga mientras se obtiene la información del usuario y su rol
    }

    return (
        <div>
            {user && <Registro />}
        </div>
    );
};


export default Admin