const {Funcionarios: FuncionarioModel} = require("../models/FuncionarioModel")

const FuncionarioController = {
    getId: async(req,res) => {
        try {
            const id = req.params.id
            const funcionarios = await FuncionarioModel.findById(id)

            if(!funcionarios){
                res.status(404).json({msg:"Funcionario não encontrado!"})
                return;
            }
            
            res.status(200).json(funcionarios)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    getAll: async(req,res) => {
        try {
            const funcionarios = await FuncionarioModel.find()
            res.status(200).json(funcionarios)
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    create: async(req,res) => {
        try{
            const funcionarios = {
                nome: req.body.nome,
                cargo: req.body.cargo,
                departamento: req.body.departamento,
                acoes: req.body.acoes
            }

            const response = await FuncionarioModel.create(funcionarios)

            res.status(201).json({response, msg: "Funcionario cadastrado com sucesso!"})
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    },

    update: async(req,res) => {
        try {
            const id = req.params.id

            const funcionario = {
                nome: req.body.nome,
                cargo: req.body.cargo,
                departamento: req.body.departamento,
                acoes: req.body.acoes
            }

            const updateFuncionario = await FuncionarioModel.findByIdAndUpdate(id, funcionario)

            if (!updateFuncionario) {
                res.status(404).json({msg:"Funcionário não encontrado"})
                return;
            }

            res.status(200).json({funcionario, msg:"Funcionário atualizado com sucesso!"})
        } catch (error) {
            
        }
    },

    delete: async(req,res) => {
        try {
            const id = req.params.id
            const funcionario = await FuncionarioModel.findById(id)
            if (!funcionario) {
                res.status(404).json({msg:"Funcionario não encontrado"})
                return;
            }
            const deleteFuncionario = await FuncionarioModel.findByIdAndDelete(id)
            res.status(200).json({deleteFuncionario, msg: "Funcionario deletado com sucesso!"})
        } catch (error) {
            console.log(`Deu erro em: ${error}`)
        }
    }
}

module.exports = FuncionarioController