const express = require('express');
const router = express.Router();
const {
  getAgendas,
  getAgendaById,
  createAgenda,
  updateAgenda,
  deleteAgenda
} = require('../controllers/agendaController');

// Routes
router.get('/', getAgendas);          // GET all agendas
router.get('/:id', getAgendaById);    // GET agenda by ID
router.post('/', createAgenda);       // CREATE new agenda
router.put('/:id', updateAgenda);     // UPDATE agenda by ID
router.delete('/:id', deleteAgenda);  // DELETE agenda by ID

module.exports = router;
