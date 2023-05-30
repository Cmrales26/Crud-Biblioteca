import React from 'react'
import { db } from '../firebase'

const Registro = () => {
  //hooks
  const [lista, setLista] = React.useState([])
  const [nombre, setNombre] = React.useState('')
  const [Descripcion, setDescripcion] = React.useState('');
  const [Disponibilidad, setDisponibilidad] = React.useState(true);
  const [año, setAño] = React.useState('');
  const [Autor, setAutor] = React.useState('');
  const [id, setId] = React.useState('');
  const [busqueda, setBusqueda] = React.useState('');

  const [modoedicion, setModoEdicion] = React.useState(false)

  const [error, setError] = React.useState(null)

  //leer datos
  React.useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const data = await db.collection('Libros').get()
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setLista(arrayData)
      } catch (error) {
        console.error(error);
      }
    }
    obtenerDatos()
  }, [])

  //guardar
  const guardarDatos = async (e) => {
    e.preventDefault()
    if (!nombre) {
      setError("Ingrese el Nombre")
      return
    }
    if (!Autor) {
      setError("Ingrese el Autor")
      return
    }
    if (!Descripcion) {
      setError("Ingrese la Descripcion")
      return
    }
    if (!año) {
      setError("Ingrese el año")
      return
    }

    //registrar en firebase
    try {
      const dato = await db.collection('Libros').add({
        Nombre: nombre,
        Disponibilidad: true,
        Descripcion: Descripcion,
        año: año,
        Autor: Autor,
      })
      setLista([
        ...lista,
        {
          Nombre: nombre,
          Disponibilidad: true,
          Descripcion: Descripcion,
          año: año,
          Autor: Autor,
          id: dato.id
        }
      ])

      //! ALERTA QUE EL LIBRO SE HA REGISTRADO CON EXITO
      setNombre('')
      setAutor('')
      setDescripcion('')
      setAño('')
      setError(null)
    } catch (error) {
      console.error(error);
    }
  }


  const eliminarDato = async (id) => {
    if (modoedicion) {
      setError('No puede eliminar mientras edita el usuario.')
      return
    }
    try {
      //const db=firebase.firestore()
      await db.collection('Libros').doc(id).delete()
      const listaFiltrada = lista.filter(elemento => elemento.id !== id)
      //!ALERTA DE QUE EL LIBRO SE HA ELIMINADO CON EXITO
      setLista(listaFiltrada)
    } catch (error) {
      console.error(error);
    }
  }


  //editar


  const editar = (elemento) => {
    setModoEdicion(true)//activamos el modo edición
    setNombre(elemento.Nombre);
    setAutor(elemento.Autor);
    setDescripcion(elemento.Descripcion);
    setAño(elemento.año);
    setId(elemento.id);
    setDisponibilidad(elemento.Disponibilidad);
  }

  //editar datos

  const editarDatos = async (e) => {
    e.preventDefault()
    if (!nombre) {
      setError("Ingrese el Nombre")
      return
    }
    if (!Autor) {
      setError("Ingrese el Autor")
      return
    }
    if (!Descripcion) {
      setError("Ingrese la Descripcion")
      return
    }
    if (!año) {
      setError("Ingrese el año")
      return
    }
    try {

      await db.collection('Libros').doc(id).update({
        Nombre: nombre,
        Disponibilidad: Disponibilidad,
        Descripcion: Descripcion,
        año: año,
        Autor: Autor,
      })
      //! ALERTA DE QUE EL LIBRO SE HA EDITADO.
      const listaEditada = lista.map(elemento => elemento.id === id ? { id, Nombre: nombre, Disponibilidad, Autor, Descripcion, año } : elemento
      )

      setLista(listaEditada); //listamos nuevos valores
      setModoEdicion(false);
      setAutor('');
      setDescripcion('');
      setAño('');
      setId('');
      setNombre('');
      setError(null);
    } catch (error) {
      console.error(error);
    }
  }

  const BuscarLibro = (e) => {
    setBusqueda(e.target.value);
  };

  
  const listaFiltrada = lista.filter((elemento) =>
  elemento.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className='Registro-libro'>
      {
        modoedicion ? <h2 className='text-center text-success'>Editando Libro</h2> :
          <h2 className='text-center text-primary'>Registro Libros</h2>
      }

      <form onSubmit={modoedicion ? editarDatos : guardarDatos}>
        {
          error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) :
            null
        }
        <input type="text"
          placeholder='Ingrese el Nombre'
          className='form-control mb-2'
          onChange={(e) => { setNombre(e.target.value) }}
          value={nombre}
        />


        <input type="text"
          placeholder='Ingrese el autor'
          className='form-control mb-2'
          onChange={(e) => { setAutor(e.target.value) }}
          value={Autor}
        />

        <input type="text"
          placeholder='Ingrese la Descripción'
          className='form-control mb-2'
          onChange={(e) => { setDescripcion(e.target.value) }}
          value={Descripcion}
        />

        <input type="number"
          placeholder='Ingrese el año'
          className='form-control mb-2'
          onChange={(e) => { setAño(e.target.value.trim()) }}
          value={año}
        />

        <div className='d-grid gap-2'>
          {
            modoedicion ? <button type='submit' className='btn btn-outline-success'>Editar</button> :
              <button type='submit' className='btn btn-outline-info'>Registrar</button>
          }

        </div>
      </form>

      <h2 className='text-center'>Listado de Libros Registrados</h2>

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
          {listaFiltrada.map((elemento) => (
            <div className="card" key={elemento.id}>
              <div className="card-body">
                <h5 className="card-title">Nombre: {elemento.Nombre}</h5>
                <p className="card-text">Autor: {elemento.Autor}</p>
                <p className="card-text">Descripción: {elemento.Descripcion}</p>
                <p className="card-text">Año: {elemento.año}</p>
                <p className="card-text">Estado: {elemento.Disponibilidad ? "Disponible" : "Reservado"}</p>
              </div>
              <div className="card-footer">
                <button onClick={() => eliminarDato(elemento.id)} className="btn btn-danger me-2">
                  Eliminar
                </button>
                <button onClick={() => editar(elemento)} className="btn btn-warning me-2">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>




    </div>
  )
}

export default Registro