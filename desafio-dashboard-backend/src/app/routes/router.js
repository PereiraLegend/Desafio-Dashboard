const router = require("express").Router()
const sRouter = require("./FuncionarioService")
router.use("/", sRouter)
module.exports = router