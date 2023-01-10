import Contenedor from "../../containers/containerFs.js"

class DAOproductosFs extends Contenedor{
    constructor(){
        super('productos.json')
    }

}

export default DAOproductosFs