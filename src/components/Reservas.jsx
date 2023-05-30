import React from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Reservas = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const [lista, setLista] = React.useState([]);
  const [busqueda, setBusqueda] = React.useState('');

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await db.collection('Libros').get();
        const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const librosDisponibles = arrayData.filter((libro) => libro.Disponibilidad === true);
        setLista(librosDisponibles);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerDatos();
  }, []);

  const ReservarLibro = async (elemento) => {
    try {
      const usuario = user.email;

      const datos = await db.collection(usuario).add({
        idlibro: elemento.id,
        Nombres: elemento.Nombre,
        año: elemento.año,
        Descripcion: elemento.Descripcion,
        Autor: elemento.Autor,
      });

      await db.collection('Libros').doc(elemento.id).update({
        Disponibilidad: false,
      });

      //! AQUI VA UNA ALERTA DE QUE EL LIBRO SE HA RESERVADO

      const listaFiltrada = lista.filter((nuevalista) => nuevalista.id !== elemento.id);
      setLista(listaFiltrada);
    } catch (error) {
      console.error(error);
    }
  };

  const BuscarLibro = (e) => {
    setBusqueda(e.target.value);
  };


  const listaFiltrada = lista.filter((elemento) =>
    elemento.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <div>
      <div className="titulo-seccion">
        <h3>Libros</h3>
      </div>

      <div className="busqueda">
        <input
          className='form-control'
          type="text"
          placeholder="Buscar libro"
          value={busqueda}
          onChange={BuscarLibro}
        />
      </div>

      <div className="contenedor-cards">
        <div className="card-grid">
          {listaFiltrada.length === 0 ? (
            <p>No se encontraron libros.</p>
          ) : (
            listaFiltrada.map((elemento) => (
              <div className="card" key={elemento.id}>
                <div className="card-body">
                  <h5 className="card-title">Nombre: {elemento.Nombre}</h5>
                  <p className="card-text">Autor: {elemento.Autor}</p>
                  <p className="card-text">Descripción: {elemento.Descripcion}</p>
                  <p className="card-text">Año: {elemento.año}</p>
                </div>
                <div className="card-footer">
                  <button
                    onClick={() => ReservarLibro(elemento)}
                    className="btn btn-primary me-2"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservas;
