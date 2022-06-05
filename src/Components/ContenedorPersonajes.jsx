import React from 'react'

const ContenedorPersonajes = (nombrePersonaje, foto) => {
  return (
    <div>
        <img src={foto} alt="" />
        <h1>{nombrePersonaje}</h1>
    </div>
  )
} 
    
export default ContenedorPersonajes