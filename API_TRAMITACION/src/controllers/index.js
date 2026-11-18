const database = require('../db');

//Esta tabla es solo un ejemplo para que puedan ver como se hacen querys a la bdd, después puede ser eliminada
const createTable = (req, res) => {
    const query =  'CREATE TABLE IF NOT EXISTS user(id int AUTO_INCREMENT, firstname VARCHAR(50), lastname VARCHAR(50), email VARCHAR(50), PRIMARY KEY(id))';

    database.query(query, (err) => {
        if (err) throw err;
        res.send('Tabla creada')
    });
};


// Endpoint para agregar la nota final de una memoria a un alumno
const putNotaFinalByProfesor = (req, res) =>{
    const { alumnoId } = req.params;
    const { notaFinal } = req.body;
    
    const numero = Number(notaFinal);
    if(!Number.isInteger(numero)){
        return res.status(400).json({
            error : 'Se debe proporcionar un numero a la nota final.'
        })
    }
    if(numero <0 || numero >100){
        return res.status(400).json({
            error : 'La nota debe estar entre 0 y 100'
        })
    }
    const query = `
    UPDATE memoria
    SET nota = ?
    WHERE rolAlumno = ?
    `;
    database.query(query, [numero, alumnoId], (err, result) => {
        if (err) {
            console.error('Error actualizando nota final:', err);
            return res.status(500).json({
                error: 'No se pudo actualizar la nota final.'
            });
        }
        if(result.affectedRows === 0 ){
            return res.status(404).json({
                error : 'No existe el alumno'
            })
        }
        return res.status(200).json({
            mensaje: 'Nota final actualizada.'
        });
    });
};

// Se sube el avance hecho por el alumno al sistema
const postAvanceByAlumno = (req, res) => {
    const{alumnoId} = req.params;
    const{num ,rutaDoc, obj, comentarioA} = req.body;
    const query = ` 
    INSERT INTO avance (numero, rolAlumno, rutaDocumento, objetivo, retroalimentacion, nota, fechaSubida,fechaEvaluacion,comentarioAlumno)    
    VALUES (?,?, ?, ?, '', 0, NOW(), NULL, ?)
    `;
    database.query(query, [num,alumnoId, rutaDoc, obj, comentarioA], (err, avances) => {
        if(err) {
            console.error('Error subiendo avance:', err);
            return res.status(500).json({
                error: 'No se pudo subir el avance.'
            });
        }
        return res.status(201).json({
            mensaje:'Avance subido.'
        });
    });
}

// Escala de notas de 0 a 100, aprueba con 55 o más
const NOTA_MAXIMA = 100;
const NOTA_APROBACION = 55;

// El profesor guía evalúa un avance: guarda retroalimentación y nota, y cambia el estado
const putEvaluacionAvance = (req, res) => {
    const { alumnoId, numero } = req.params;
    const { retroalimentacion, nota } = req.body;

    if (!retroalimentacion || !retroalimentacion.trim()) {
        return res.status(400).json({
            error: 'La retroalimentación es obligatoria.'
        });
    }

    const notaNum = Number(nota);
    if (!Number.isInteger(notaNum) || notaNum < 0 || notaNum > NOTA_MAXIMA) {
        return res.status(400).json({
            error: `La nota debe ser un número entero entre 0 y ${NOTA_MAXIMA}.`
        });
    }

    const nuevoEstado = notaNum >= NOTA_APROBACION ? 'APROBADO' : 'REPROBADO';

    const query = `
    UPDATE avance
    SET retroalimentacion = ?,
        nota = ?,
        fechaEvaluacion = CURDATE(),
        estado = ?
    WHERE rolAlumno = ? AND numero = ?
    `;

    database.query(query, [retroalimentacion.trim(), notaNum, nuevoEstado, alumnoId, numero], (err, result) => {
        if (err) {
            console.error('Error evaluando avance:', err);
            return res.status(500).json({
                error: 'No se pudo guardar la evaluación.'
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'El avance no existe.'
            });
        }
        return res.status(200).json({
            mensaje: 'Avance evaluado.',
            estado: nuevoEstado
        });
    });
};
// ========= HU-2 ==========
// Devuelve todos los estudiantes guiados por cierto profesor
const getAlumnosByProfesor = (req,res) => {
    const { guiaId } = req.params;

    if (!/^\d+$/.test(guiaId) || Number(guiaId) <= 0) { 
        return res.status(400).json({
            error: 'guiaId debe ser un número entero positivo.'
        });
    }

    const query = 'SELECT * FROM estudiante WHERE idGuia = ?'; 

    database.query(query, [guiaId], (err, alumnos) => {

        if (err) {
            console.error('Error consultando los estudiantes asignados:', err);
            return res.status(500).json({
                error: 'No se pudo consultar los estudiantes por profesor guia.'
            });
        }

        return res.status(200).json({
            alumnos
        });
    });
};

// Devuelve el historial completo de avances para un alumno.
const getAvancesByAlumno = (req, res) => {
    const { alumnoId } = req.params;

    if (!/^\d+$/.test(alumnoId) || Number(alumnoId) <= 0) {
        return res.status(400).json({
            error: 'alumnoId debe ser un número entero positivo.'
        });
    }

    const query = `
        SELECT
            numero,
            rolAlumno,
            rutaDocumento,
            objetivo,
            retroalimentacion,
            nota,
            fechaSubida,
            fechaEvaluacion,
            comentarioAlumno,
            estado
        FROM avance
        WHERE rolAlumno = ?
        ORDER BY fechaSubida DESC, numero DESC
    `;

    database.query(query, [alumnoId], (err, avances) => {
        if (err) {
            console.error('Error consultando avances del alumno:', err);
            return res.status(500).json({
                error: 'No se pudo consultar el historial de avances.'
            });
        }

        return res.status(200).json({
            alumnoId,
            cantidad: avances.length,
            avances
        });
    });
};

// ========= HU-09 ==========
// Consulta los datos generales de la memoria de un alumno
const getMemoriaByAlumno = (req, res) => {
    const { alumnoId } = req.params;

    if (!/^\d+$/.test(alumnoId) || Number(alumnoId) <= 0) {
        return res.status(400).json({
            error: 'alumnoId debe ser un número entero positivo.'
        });
    }

    const query = `
        SELECT idMemoria, rolAlumno, titulo, nota, modalidad
        FROM memoria
        WHERE rolAlumno = ?
    `;

    database.query(query, [alumnoId], (err, filas) => {
        if (err) {
            console.error('Error consultando los datos de la memoria:', err);
            return res.status(500).json({
                error: 'No se pudo consultar los datos de la memoria.'
            });
        }
        if (filas.length === 0) {
            return res.status(404).json({
                error: 'El alumno no tiene memoria registrada.'
            });
        }
        return res.status(200).json(filas[0]);
    });
};

// Devuelve los estudiantes de un profesor guía junto con los datos de su memoria
const getMemoriasByProfesor = (req, res) => {
    const { guiaId } = req.params;

    if (!/^\d+$/.test(guiaId) || Number(guiaId) <= 0) {
        return res.status(400).json({
            error: 'guiaId debe ser un número entero positivo.'
        });
    }

    const query = `
        SELECT
            e.rol,
            e.nombre,
            m.idMemoria,
            m.titulo,
            m.modalidad,
            m.nota
        FROM estudiante e
        LEFT JOIN memoria m ON m.rolAlumno = e.rol
        WHERE e.idGuia = ?
    `;

    database.query(query, [guiaId], (err, alumnos) => {
        if (err) {
            console.error('Error consultando las memorias del profesor guía:', err);
            return res.status(500).json({
                error: 'No se pudo consultar las memorias por profesor guía.'
            });
        }

        return res.status(200).json({
            guiaId,
            cantidad: alumnos.length,
            alumnos
        });
    });
};


module.exports = {
    postAvanceByAlumno,
    putEvaluacionAvance,
    getAlumnosByProfesor,
    getAvancesByAlumno,
    putNotaFinalByProfesor,
    getMemoriaByAlumno,
    getMemoriasByProfesor,
};