const express = require('express');
const crewController = require('../controllers/crewController');

const router = express.Router();

//routes
router.get('/', crewController.getCrews);
router.get('/:id', crewController.getCrewsById);
router.post(
    '/',
    crewController.upload.single('image'),
    crewController.createCrew
);
router.put(
    '/:id',
    crewController.upload.single('image'),
    crewController.updateCrew
);
router.delete('/:id', crewController.deleteCrew);

module.exports = router;