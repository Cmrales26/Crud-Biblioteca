import React from 'react'
import { db } from '../firebase'

const Registro = () => {
  //hooks
  const [lista, setLista] = React.useState([])
  const [nombre, setNombre] = React.useState('')
  const [Descripcion, setDescripcion] = React.useState('');
  const [año, setAño] = React.useState();
  const [Autor, setAutor] = React.useState('');
  const [id, setId] = React.useState('');

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
      //const db=firebase.firestore()
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
      setNombre('')
      setAutor('')
      setDescripcion('')
      setAño('')
      setError(null)
    } catch (error) {
      console.error(error);
    }
  }


  //eliminar

  const eliminarDato = async (id) => {
    if (modoedicion) {
      setError('No puede eliminar mientras edita el usuario.')
      return
    }
    try {
      //const db=firebase.firestore()
      await db.collection('Libros').doc(id).delete()
      const listaFiltrada = lista.filter(elemento => elemento.id !== id)
      setLista(listaFiltrada)
    } catch (error) {
      console.error(error);
    }
  }


  // //editar
  const editar = (elemento) => {
    setModoEdicion(true)//activamos el modo edición
    setNombre(elemento.Nombre);
    setAutor(elemento.Autor);
    setDescripcion(elemento.Descripcion);
    setAño(elemento.año);
    setId(elemento.id)
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
      //const db=firebase.firestore()
      await db.collection('Libros').doc(id).update({
        Nombre: nombre,
        Disponibilidad: true,
        Descripcion: Descripcion,
        año: año,
        Autor: Autor,
      })

      window.location.reload() // MIENTRAS VEO QUE SUCEDE CON EL NOMBRE XD

      const listaEditada = lista.map(elemento => elemento.id === id ? { id, nombre, Autor, Descripcion, año } :
        elemento
      )

      setLista(listaEditada)//listamos nuevos valores
      setModoEdicion(false)
      setNombre('')
      setAutor('')
      setDescripcion('')
      setAño('')
      setError(null)
    } catch (error) {
      console.error(error);
    }
  }




  return (
    <div className=''>
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
      <h2 className='text-center text-primary'>Listado de Libros Registrados</h2>
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
  )
}

export default Registro