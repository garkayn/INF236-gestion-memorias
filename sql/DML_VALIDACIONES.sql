USE BD04_VALIDACIONES;

START TRANSACTION;

INSERT INTO usuario (id, nombre, correo, tipoUsuario) VALUES
    (1, 'Camila Rivas Morales', 'camila.rivas@example.org', 'ESTUDIANTE'),
    (2, 'Benjamín Soto Herrera', 'benjamin.soto@example.org', 'ESTUDIANTE'),
    (3, 'Valentina Pérez Rojas', 'valentina.perez@example.org', 'ESTUDIANTE'),
    (4, 'Diego Navarro Castillo', 'diego.navarro@example.org', 'ESTUDIANTE'),
    (5, 'Antonia Silva Fuentes', 'antonia.silva@example.org', 'ESTUDIANTE'),
    (6, 'Tomás Herrera Díaz', 'tomas.herrera@example.org', 'ESTUDIANTE'),
    (7, 'Patricia Muñoz Salinas', 'patricia.munoz@example.org', 'GUIA'),
    (8, 'Rodrigo Fuentes Araya', 'rodrigo.fuentes@example.org', 'GUIA'),
    (9, 'Verónica Paredes Soto', 'veronica.paredes@example.org', 'GUIA'),
    (10, 'Felipe Contreras Vidal', 'felipe.contreras@example.org', 'GUIA'),
    (11, 'Daniela Rojas Cárdenas', 'daniela.rojas@example.org', 'GUIA'),
    (12, 'Andrés Lagos Sepúlveda', 'andres.lagos@example.org', 'GUIA'),
    (13, 'Paula Medina Torres', 'paula.medina@example.org', 'GUIA');

COMMIT;
