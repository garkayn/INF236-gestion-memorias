const express = require('express');
const router = new express.Router();

const index = require('../controllers/index');

//==========================endpoints(Routes)============================//
router.get('/api/guias/:guiaId/alumnos', index.getAlumnosByProfesor);
router.post('/api/alumnos/:alumnoId/avances', index.postAvanceByAlumno);
router.put('/api/alumnos/:alumnoId/avances/:numero/evaluacion', index.putEvaluacionAvance);
router.get('/api/alumnos/:alumnoId/avances', index.getAvancesByAlumno);
router.get('/api/alumnos/:alumnoId/memorias', index.getMemoriaByAlumno);
router.get('/api/guias/:guiaId/memorias', index.getMemoriasByProfesor);

router.put('/api/alumnos/:alumnoId/memorias', index.putNotaFinalByProfesor);

module.exports = router;