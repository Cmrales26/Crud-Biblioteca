import React from 'react'
import { auth, db } from '../firebase'
import { useNavigate } from 'react-router-dom'

const Reservas = () => {

  const navigate = useNavigate()
  const [user, setUser] = React.useState(null)
  React.useEffect(() => {
    if (auth.currentUser) {
      console.log('Existe un usuario');
      setUser(auth.currentUser)
      console.log(user)
    } else {
      console.log('No existe un usuario');
      navigate('/login')
    }
  }, [navigate])

  const [lista, setLista] = React.useState([]);
  const [id, setId] = React.useState('');

  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await db.collection('Libros').get();
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const librosDisponibles = arrayData.filter(libro => libro.Disponibilidad === true);
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
        Disponibilidad: false
      });


      window.location.reload();

      // const listaEditada = lista.map(libro => {
      //   if (libro.id === elemento.id) {
      //     return { ...libro, Disponibilidad: false };
      //   }
      //   return libro;
      // });

      setLista(listaEditada);

      alert("Se ha reservado este libro");
    } catch (error) {
      console.error(error);
    }
  };

  
  return (
    <div>

      <h3>Libros</h3>

      <div className="card-grid">
        {lista.map((elemento) => (
          <div className="card" key={elemento.id}>
            <div className="card-body">
              <h5 className="card-title">Nombre: {elemento.Nombre}</h5>
              <p className="card-text">Autor: {elemento.Autor}</p>
              <p className="card-text">Descripción: {elemento.Descripcion}</p>
              <p className="card-text">Año: {elemento.año}</p>
            </div>
            <div className="card-footer">
              <button onClick={() => ReservarLibro(elemento)} className="btn btn-primary me-2">
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>



    </div>
  )
}

export default Reservas