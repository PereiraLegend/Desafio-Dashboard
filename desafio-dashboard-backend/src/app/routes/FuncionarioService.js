const router = require("express").Router()
const FuncionarioController = require("../controllers/FuncionarioController")

router.route("/employees").get((req,res) => FuncionarioController.getAll(req,res))
router.route("/employees/:id").get((req,res) => FuncionarioController.getId(req,res))
router.route("/employees").post((req,res) => FuncionarioController.create(req,res))
router.route("/employees/:id").put((req,res) => FuncionarioController.update(req,res))
router.route("/employees/:id").delete((req,res) => FuncionarioController.delete(req,res))

module.exports = router