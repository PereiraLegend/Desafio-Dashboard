const mongoose = require("mongoose")
const { Schema } = mongoose
const funcionarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    departamento: {
        type: String,
        required: true
    },
    acoes: {
        type: String,
        required: true
    }
}, { timestamps:true })

const Funcionarios = mongoose.model("Funcionarios", funcionarioSchema)

module.exports = {
    Funcionarios,
    funcionarioSchema,
}