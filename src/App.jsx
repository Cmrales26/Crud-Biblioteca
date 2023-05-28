import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './components/Inicio';
import Login from './components/Login';
import Admin from './components/Admin';
import Navbar from './components/Navbar';
import Reservas from './components/Reservas';
import { auth, db } from './firebase';

function App() {
  const [firebaseUser, setFirebaseUser] = useState(false);
  const [firebaseRol, setFirebaseRol] = useState(null);

  const getRole = useCallback(async (Mail) => {
    try {
      const userSnapshot = await db.collection('Usuarios').doc(Mail).get();
      const userData = userSnapshot.data();
      if (userData && userData.Rol === 'Usuario') {
        return 'Usuario';
      } else if (userData && userData.Rol === 'Admin') {
        return 'Admin';
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      auth.onAuthStateChanged(async (user) => {
        console.log(user);
        if (user) {
          setFirebaseUser(user);
          const role = await getRole(user.email);
          setFirebaseRol(role);
        } else {
          setFirebaseUser(null);
        }
      });
    };

    checkUser();
  }, [getRole]);

  console.log('El rol es: ' + firebaseRol);

  return firebaseUser !== false ? (
    <Router>
      <div className='container'>
        <Navbar firebaseUser={firebaseUser} firebaseRol={firebaseRol} />
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='login' element={<Login />} />
          <Route path='admin' element={<Admin />} />
          <Route path='reservas' element={<Reservas />} />
        </Routes>
      </div>
    </Router>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
