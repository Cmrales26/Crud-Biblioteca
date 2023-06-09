import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

const Navbar = (props) => {
  const navigate = useNavigate()
  const cerrarsesion = () => { auth.signOut().then(() => { navigate('/login') }) }

  // console.log("El rol es: " + props.firebaseRoles);

  return (
    <div className='navbar navbar-dark bg-dark'>
      {props.firebaseUser !== null ? (<Link className='navbar-brand' to="/">Unicosta - {props.firebaseUser.email} </Link>) : <Link className='navbar-brand' to="/">Unicosta </Link>}
      <div className='d-flex navbar-page' id='navbar-page'>


        <Link className='btn btn-dark' to="/">Inicio</Link>

        {props.firebaseUser !== null && props.firebaseRol === 'Admin' ? (
          <Link className='btn btn-dark' to="/admin">Admin</Link>
        ) : null}

        {props.firebaseUser !== null && props.firebaseRol === 'Usuario' ? (
          <Link className='btn btn-dark' to="/reservas">Reservar Libros</Link>
        ) : null}

        {props.firebaseUser !== null && props.firebaseRol === 'Usuario' ? (
          <Link className='btn btn-dark' to="/Misreservas">Mis Reservas</Link>
        ) : null}

        {
          props.firebaseUser !== null ? (
            <button className='btn btn-dark iniciar-cerrarsesion'
              onClick={cerrarsesion}
            >Cerrar Sesión</button>
          ) : (
            <Link className='btn btn-dark' to="/login">Login</Link>
          )
        }
      </div>
    </div>
  )
}

export default Navbar