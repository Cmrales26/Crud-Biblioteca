import React from 'react'
import { auth } from '../firebase'
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
  return (
    <div>Reservas</div>
  )
}

export default Reservas