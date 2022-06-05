import { concat } from "./concat";


export const getDatos = () => {

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

        const datos = [idobtenido, nameobtenido, urlobtenida]
        
        
        return datos
}
}


