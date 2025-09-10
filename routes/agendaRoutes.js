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
router.get('/', getAgendas);         
router.get('/:id', getAgendaById); 
router.post('/', createAgenda);     
router.put('/:id', updateAgenda);     
router.delete('/:id', deleteAgenda);  

module.exports = router;
