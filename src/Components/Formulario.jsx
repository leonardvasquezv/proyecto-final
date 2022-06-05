import React from "react";
import { nanoid } from "nanoid";
import swal from "sweetalert"
import { firebase } from './firebase'
import { concat } from "../helpers/concat";

const Formulario = () => {
  const [id, setId] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [name, setName] = React.useState("");
  const [url, setURL] = React.useState("")
  const [listaRegistros, setListaRegistros] = React.useState([])
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [error, setError] = React.useState(null)



  React.useEffect(() => {


    const getDatos = async () => {
      try {
        const db = firebase.firestore()
        const data = await db.collection('Registros').get()
        const arrayData = data.docs.map(doc => (
          { id: doc.id, ...doc.data() }
        ))
        //console.log(arrayData)
        setListaRegistros(arrayData)
      } catch (error) {

      }
    }
    getDatos();

  })

  const guardarEmpleado = async (e) => {

    e.preventDefault()

    if (!nombre.trim()) {
      setError('Digite el nombre')
      return
    }


    try {
      let primerasLetras = nombre.substring(0, 2)
      const res = await fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${primerasLetras}&limit=1&ts=1&apikey=cb7c28990d8884e6ca02450a41e15d21&hash=4fdbae294266806887a915fc7717ace9`)
      const { data } = await res.json();
      const results = data.results
      const idobtenido = (results[0].id)
      const nameobtenido = (results[0].name)
      const path = (results[0].thumbnail.path)
      const extension = (results[0].thumbnail.extension)
      const urlobtenida = concat(path, extension)
      setId(idobtenido)
      setName(nameobtenido)
      setURL(urlobtenida)
      console.log(id)
      console.log(nombre)
      console.log(name)
      console.log(url)
    } catch (error) {

    }



    try {
      swal({
        position: 'top-end',
        icon: 'success',
        title: 'Agregado',
        showConfirmButton: false,
        timer: 700
      })
      const db = firebase.firestore()
      const nuevoRegistro = {
        id: id, Nombre: nombre, Personaje: name, Foto: url
      }
      await db.collection('Registros').add(nuevoRegistro)

      setListaRegistros([
        ...listaRegistros,
        { id: id, Nombre: nombre, Personaje: name, Foto: url }
      ])



      setError(null)

    } catch (error) {
      console.log(error)
    }

    e.target.reset()

    setNombre('')

  }


  const editar = item => {
    setNombre(item.Nombre)
    setModoEdicion(true)
    setError(null)
  }

  const editarEmpleado = async e => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError('Digite el nombre')
      return
    }

    try {
      const db = firebase.firestore()
      await db.collection('Registros').doc(id).update({
        id: id, Nombre: nombre, Personaje: name, Foto: url
      })
      const arrayEditado = listaRegistros.map(
        item => item.id === id ? { id: id, Nombre: nombre, Personaje: name, Foto: url } : item
      )
      setListaRegistros(arrayEditado)
      setId('')
      setNombre('')
      setModoEdicion(false)
    } catch (error) {
      console.log(error)
    }
  }

  const eliminar = id => {
    swal({
      title: '¿Estás seguro?',
      text: "No podrás deshacer esta acción.",
      icon: 'warning',
      buttons: ["No", "Sí"]
    }).then(async (result) => {
      if (result) {
        try {
          const db = firebase.firestore()
          await db.collection('Registros').doc(id).delete()
          const aux = listaRegistros.filter(item => item.id !== id)
          setListaRegistros(aux)
        } catch (error) {
          console.log(error)
        }
        swal({
          position: 'top-end',
          icon: 'success',
          title: 'Eliminado',
          showConfirmButton: false,
          timer: 700
        })
      }
    })
  }

  const cancelar = () => {
    setModoEdicion(false)
    setId('')
    setNombre('')
    setError(null)
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center row justify-content-center mb-5 colortexto">Personajes MARVEL</h1>

      <div className="formularioEmpleados row">
        <h5>Bienvenido. Mira cuál es el personaje cuyo nombre es parecido al tuyo!</h5>
        <h6>Para conocer tu personaje digita tu nombre.</h6>
        <div className="col-12 justify-content-end ladoCajas">
          <form onSubmit={modoEdicion ? editarEmpleado : guardarEmpleado} className="text-center">
            {
              error ? <span className="text-danger">{error}</span> : null
            }
            <input className="txt mb-2" type="text" placeholder=""
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
            />
            {
              modoEdicion ?
                (
                  <>
                    <button className="btn btn-warning btn-block" type="submit">Editar</button>
                    <button className="btn btn-dark btn-block" onClick={() => cancelar}>Cancelar</button>
                  </>
                )
                :
                <>
                  <button className="boton-agregar" type="submit">Obtener mi personaje</button>
                </>

            }
          </form>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <h4 className="text-center mb-3 colortexto">Registros</h4>
          <ul className="list-group">
            {
              listaRegistros.map(item => (
                <li className="list-group-item listadoEmpleados row" key={item.id}>
                  <span className="lead col-8">{item.Nombre} - {item.Personaje}</span>
                  <div className="col-1"><img id="img-registro" src={item.Foto} alt="" /></div>
                  <button className="btn btn-danger btn-sm float-end mx-2 col-1" onClick={() => eliminar(item.id)}>Eliminar</button>
                  <button className="btn btn-warning btn-sm float-end mx-2 col-1" onClick={() => editar(item)}>Editar</button>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Formulario;