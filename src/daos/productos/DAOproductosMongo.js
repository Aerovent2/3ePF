import Contenedor from "../../containers/containerMongo.js";

class DAOproductosMongo extends Contenedor{
    constructor(){
        super('productos',{
            nombre: { type: String, required: true },
            descripcion: { type: String, required: false },
            codigo: { type: String, required: true, unique: true },
            url:{type: String, required: true},
            precio:{type: Number, required: true},
            stock:{type: Number, required: true}
        })
    }

}

export default DAOproductosMongo