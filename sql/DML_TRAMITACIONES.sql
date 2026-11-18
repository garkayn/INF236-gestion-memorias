SET NAMES utf8mb4;
USE BD04_TRAMITACION;

START TRANSACTION;

INSERT INTO guia (id, nombre) VALUES
    (1, 'Patricia Muñoz Salinas'),
    (2, 'Rodrigo Fuentes Araya'),
    (3, 'Verónica Paredes Soto'),
    (4, 'Felipe Contreras Vidal'),
    (5, 'Daniela Rojas Cárdenas'),
    (6, 'Andrés Lagos Sepúlveda');

INSERT INTO estudiante (rol, nombre, idGuia) VALUES
    (202173001, 'Camila Rivas Morales', 1),
    (202173002, 'Benjamín Soto Herrera', 2),
    (202173003, 'Valentina Pérez Rojas', 3),
    (202173004, 'Diego Navarro Castillo', 4),
    (202173005, 'Antonia Silva Fuentes', 5),
    (202173006, 'Tomás Herrera Díaz', 6);

INSERT INTO memoria (idMemoria, rolAlumno, titulo, nota, modalidad) VALUES
    (1001, 202173001,
     'Plataforma web para el seguimiento de memorias de titulación',
     NULL, 'Proyecto de software'),
    (1002, 202173002,
     'Sistema de trazabilidad de inventario para una distribuidora regional',
     88, 'Proyecto de software'),
    (1003, 202173003,
     'Predicción de demanda de transporte público mediante aprendizaje automático',
     NULL, 'Investigación aplicada'),
    (1004, 202173004,
     'Evaluación de accesibilidad en plataformas de servicios municipales',
     NULL, 'Investigación aplicada'),
    (1005, 202173005,
     'Monitoreo de consumo energético en salas de un campus universitario',
     NULL, 'Prototipo tecnológico'),
    (1006, 202173006,
     'Sistema de reserva de equipamiento para laboratorios de informática',
     NULL, 'Proyecto de software');

INSERT INTO avance (
    numero, rolAlumno, rutaDocumento, objetivo, retroalimentacion,
    nota, fechaSubida, fechaEvaluacion, comentarioAlumno, estado
) VALUES
    (1, 202173001, '/documentos/memorias/202173001/avance-01.pdf',
     'Levantar el proceso actual de titulación y definir los requisitos de estudiantes y docentes.',
     'El diagnóstico es claro. Se aprueba el alcance y se solicita priorizar los requisitos para la siguiente entrega.',
     82, '2026-08-24', '2026-08-27',
     'Se entrevistó a cuatro estudiantes y dos docentes para validar los requisitos.',
     'APROBADO'),
    (2, 202173001, '/documentos/memorias/202173001/avance-02.pdf',
     'Diseñar el modelo de datos y un prototipo navegable del seguimiento de avances.',
     NULL, NULL, '2026-09-21', NULL,
     'Las observaciones se incorporarán en la implementación del módulo de avances.',
     'ENTREGADO'),
    (3, 202173001, '/documentos/memorias/202173001/avance-03.pdf',
     'Implementar el registro de avances y las transiciones de estado observadas en la revisión anterior.',
     NULL, NULL, '2026-10-09', NULL,
     'Se adjuntó una demostración del flujo de entrega y retroalimentación.',
     'ENTREGADO'),

    (1, 202173002, '/documentos/memorias/202173002/avance-01.pdf',
     'Caracterizar el proceso de inventario y definir indicadores de trazabilidad.',
     'Se identificaron correctamente los puntos de pérdida de información y los indicadores de control.',
     82, '2026-03-23', '2026-03-27', NULL, 'APROBADO'),
    (2, 202173002, '/documentos/memorias/202173002/avance-02.pdf',
     'Implementar el registro de movimientos y la consulta de existencias por bodega.',
     'Las pruebas funcionales cubren los flujos principales. Agregar una prueba de movimientos simultáneos.',
     88, '2026-05-25', '2026-05-29',
     'Se documentaron las pruebas de concurrencia en el anexo técnico.',
     'APROBADO'),
    (3, 202173002, '/documentos/memorias/202173002/avance-03.pdf',
     'Validar el sistema en una bodega piloto y presentar los resultados y conclusiones.',
     'La validación respalda la reducción de diferencias de inventario. El informe está listo para su entrega final.',
     91, '2026-08-10', '2026-08-14',
     'Se incorporaron los resultados del piloto y el manual de operación.',
     'APROBADO'),

    (1, 202173003, '/documentos/memorias/202173003/avance-01.pdf',
     'Revisar antecedentes y analizar la calidad de los datos de viajes disponibles.',
     'La revisión y el análisis exploratorio son adecuados. Justificar el tratamiento de los valores faltantes.',
     86, '2026-08-18', '2026-08-21',
     'Los datos se anonimizaron antes de realizar el análisis exploratorio.',
     'APROBADO'),
    (2, 202173003, '/documentos/memorias/202173003/avance-02.pdf',
     'Definir una línea base y el protocolo de validación temporal de los modelos predictivos.',
     NULL, NULL, '2026-09-25', NULL,
     'Se compararán los modelos con una línea base estacional y se reportará el error por franja horaria.',
     'ENTREGADO'),
    (3, 202173003, NULL,
     'Entrenar los modelos seleccionados y comparar su desempeño en semanas de alta demanda.',
     NULL, NULL, '2026-10-12', NULL, NULL, 'ENTREGADO'),

    (1, 202173004, '/documentos/memorias/202173004/avance-01.pdf',
     'Definir la muestra de portales municipales y el protocolo de evaluación de accesibilidad.',
     'La muestra requiere criterios de selección explícitos y el protocolo debe incluir pruebas con teclado.',
     58, '2026-08-24', '2026-08-28',
     'Se ajustará la muestra para incluir comunas de distinto tamaño.',
     'ENTREGADO'),
    (2, 202173004, '/documentos/memorias/202173004/avance-02.pdf',
     'Aplicar el protocolo corregido a los portales seleccionados y registrar las barreras detectadas.',
     NULL, NULL, '2026-09-30', NULL, NULL, 'ENTREGADO'),

    (1, 202173005, '/documentos/memorias/202173005/avance-01.pdf',
     'Definir los requisitos de medición y diseñar la arquitectura del prototipo de monitoreo.',
     'La arquitectura es viable y contempla almacenamiento ante interrupciones de conectividad.',
     90, '2026-08-25', '2026-08-28', NULL, 'APROBADO'),
    (2, 202173005, '/documentos/memorias/202173005/avance-02.pdf',
     'Construir el prototipo de sensores y verificar la precisión de las mediciones en laboratorio.',
     'El prototipo cumple la tolerancia definida. Registrar la calibración antes del piloto en salas.',
     94, '2026-09-22', '2026-09-25',
     'Se adjuntó la bitácora de calibración y las mediciones de referencia.',
     'APROBADO'),
    (3, 202173005, NULL,
     'Ejecutar un piloto en dos salas y analizar oportunidades de reducción del consumo energético.',
     NULL, NULL, '2026-10-13', NULL,
     'El piloto comenzará una vez coordinado el acceso a las salas.',
     'ENTREGADO');

COMMIT;
