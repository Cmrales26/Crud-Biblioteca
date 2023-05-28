import React from 'react'
import { auth, db } from '../firebase'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    //hooks
    const [email, setEmail] = React.useState('')
    const [pass, setPass] = React.useState('')
    const [error, setError] = React.useState(null)
    const [modoRegistro, setModoRegistro] = React.useState(true)

    const guardarDatos = (e) => {
        e.preventDefault()
        if (!email.trim()) {
            setError('Ingrese el email')
            return
        }
        if (!pass.trim()) {
            setError('Ingrese el Password')
            return
        }
        if (pass.length < 6) {
            setError('Password debe ser mayor a 6 caracteres')
            return
        }
        setError(null)
        if (modoRegistro) {
            registrar()
        } else {
            login()
        }

    }


    const login = React.useCallback(async () => {
        try {

            const res = await auth.signInWithEmailAndPassword(email, pass)

            const userSnapshot = await db.collection('Usuarios').doc(res.user.email).get();
            const userData = userSnapshot.data();

            if (userData && userData.Rol === 'Usuario') {
                navigate('/reservas');
            } else if (userData && userData.Rol === 'Admin') {
                navigate('/admin');
            }

            console.log(res.user);
            setEmail('')
            setPass('')
            setError('')


        } catch (error) {
            console.log(error.code);
            if (error.code === 'auth/wrong-password') {
                setError('Pass no coincide')
            }
            if (error.code === 'auth/user-not-found') {
                setError('usuario no registrado')
            }
        }
    }, [email, pass, navigate])


    const registrar = React.useCallback(async () => {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            await db.collection('Usuarios').doc(res.user.email).set(
                {
                    email: res.user.email,
                    id: res.user.uid,
                    Rol: "Usuario"
                }
            )
            console.log(res.user);
            setEmail('')
            setPass('')
            setError('')
        } catch (error) {
            console.log(error.code);
            if (error.code === 'auth/invalid-email') {
                setError('Email inválido')
            }
            if (error.code === 'auth/email-already-in-use') {
                setError('Email ya registrado')
            }
        }
    }, [email, pass])


    return (
        <div>
            <h3 className='text-center text-primary'>
                {modoRegistro ? 'Registro de Usuarios' : 'Login'}
            </h3>
            <div className='row justify-content-center'>
                <div className='col-12 col-sm-8 col-md-6 col-xl-4'>
                    <form onSubmit={guardarDatos}>
                        {
                            error && (
                                <div className='alert alert-danger'>
                                    {error}
                                </div>
                            )
                        }
                        <input type="email"
                            className='form-control mb-2'
                            placeholder='Ingrese su email'
                            onChange={e => setEmail(e.target.value.trim())}
                        />
                        <input type="password"
                            className='form-control mb-2'
                            placeholder='Ingrese su Password'
                            onChange={e => setPass(e.target.value.trim())}
                        />
                        <div className='d-grid gap-2'>
                            <button className='btn btn-outline-dark'>
                                {
                                    modoRegistro ? 'Registrarse' : 'Acceder'
                                }
                            </button>
                            <button className='btn btn-outline-primary'
                                onClick={() => { setModoRegistro(!modoRegistro) }}
                                type='button'
                            >
                                {
                                    modoRegistro ? 'Ya estas registrado?' : 'No tienes cuenta?'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login