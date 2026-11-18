SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS BD04_TRAMITACION
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE BD04_TRAMITACION;

CREATE TABLE IF NOT EXISTS guia (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS estudiante (
    rol INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    idGuia INT NOT NULL,
    PRIMARY KEY (rol),
    CONSTRAINT fk_estudiante_guia FOREIGN KEY (idGuia)
        REFERENCES guia (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS memoria (
    idMemoria INT NOT NULL AUTO_INCREMENT,
    rolAlumno INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    nota INT NULL,
    modalidad VARCHAR(100) NOT NULL,
    PRIMARY KEY (idMemoria),
    CONSTRAINT uq_memoria_alumno UNIQUE (rolAlumno),
    CONSTRAINT fk_memoria_estudiante FOREIGN KEY (rolAlumno)
        REFERENCES estudiante (rol)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS avance (
    numero INT NOT NULL,
    rolAlumno INT NOT NULL,
    rutaDocumento VARCHAR(500) NULL,
    objetivo TEXT NOT NULL,
    retroalimentacion TEXT NULL,
    nota INT NULL,
    fechaSubida DATE NOT NULL,
    fechaEvaluacion DATE NULL,
    comentarioAlumno TEXT NULL,
    estado ENUM('ENTREGADO', 'REPROBADO', 'APROBADO')
        NOT NULL DEFAULT 'ENTREGADO',
    PRIMARY KEY (numero, rolAlumno),
    CONSTRAINT chk_avance_numero CHECK (numero > 0),
    CONSTRAINT fk_avance_estudiante FOREIGN KEY (rolAlumno)
        REFERENCES estudiante (rol)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
