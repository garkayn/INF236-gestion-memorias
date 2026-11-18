# Gestor de avances de memorias — proyecto INF236

Plataforma web académica para registrar entregas de avances, revisar su historial y apoyar la evaluación entre estudiantes y profesores guía. El repositorio agrupa APIs, interfaz web, esquema de datos y configuración Docker.

Este es el repositorio del grupo 4, cuyos integrantes son:

- Matías Jorquera - ROL: 202310127-3
- Juan Carlos San Martín - ROL: 202473047-9
- Daniel Prieto - ROL: 202473087-8
- Iván Órdenes - ROL: 202473063-0
    - **Tutor**: Carolina Sire

# INF236-2026-2-Proyecto Base

[Wiki del proyecto](https://gitlab.inf.utfsm.cl/inf236-cc-2026-2/grupo04-2026-proyinf/-/wikis/home)

[Video del prototipo (Hito 3)](https://youtu.be/J_YCQkuG4R8)

[Prototipo en Figma](https://www.figma.com/design/2KB9PgGHrECECIdecWbeBO/Prototipo-Analisis?node-id=0-1&t=GOtv4e8psDXnxopU-1)

## Aspectos técnicos relevantes

El sistema se compone de dos APIs en Node.js con Express, cada una con su propia base de datos MySQL. Todo corre en contenedores de Docker.

| Componente | Puerto | Base de datos | Responsabilidad |
| --- | --- | --- | --- |
| `API_TRAMITACION` | 8080 | `BD04_TRAMITACION` | Avances de memoria: entrega, historial y evaluación |
| `API_VALIDACIONES` | 8081 | `BD04_VALIDACIONES` | Usuarios y roles (en desarrollo) |
| MySQL | 3306 | — | Motor de base de datos |

Los scripts de las bases de datos están en la carpeta `sql`:

- `DDL_*.sql` crean las bases y sus tablas.
- `DML_*.sql` cargan datos de prueba.

## Requerimientos

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) (recomendado), para probar los endpoints.
- npm para descargar las dependencias del frontend y levantar la página.

No es necesario instalar Node.js ni MySQL: Docker descarga las imágenes e instala las dependencias de cada API (`npm install`) al construir los contenedores.

## Cómo levantar el proyecto

Todos los comandos se ejecutan en una terminal (PowerShell, CMD o la terminal de VS Code).

### 1. Clonar el repositorio

```
git clone https://github.com/garkayn/Proyecto_INF236.git
cd Proyecto_INF236
```

### 2. Levantar MySQL

Abrir Docker Desktop y esperar a que indique que está en ejecución. Si no está abierto, los comandos de docker fallan con el error failed to connect to the docker API.
Luego, desde la carpeta principal del repositorio:

Copiar los ejemplos de configuración y reemplazar la contraseña por una local. En PowerShell:

```
Copy-Item API_TRAMITACION/.env.example API_TRAMITACION/.env
Copy-Item API_VALIDACIONES/.env.example API_VALIDACIONES/.env
```

En macOS o Linux, usa `cp` con esas mismas rutas.

```
docker compose up --build -d
```

Puede verificar con `docker compose logs mysql`: debe aparecer el mensaje `ready for connections`.
Este comando crea las bases de datos, carga datos de prueba y levanta ambas APIs automaticamente

### 3. Verificar

Con `docker ps` deben aparecer los contenedores de MySQL, `api_tramitacion` y `api_validaciones` con estado `Up`. Además, al abrir en el navegador:

### 4. Descargar dependencias frontend

Desde la carpeta frontend:

```
npm install
```

Se van a empezar a descargar todos los paquetes de package.json

### 5. Levantar página

En la misma carpeta del punto anterior:

```
npm run dev
```

Esto levanta la página web en el puerto designado.

## Endpoints disponibles

### API_TRAMITACION (`http://localhost:8080`)

| Método | Endpoint | Descripción | HU |
| --- | --- | --- | --- |
| `GET` | `/api/guias/:guiaId/alumnos` | Lista los estudiantes asignados a un profesor guía | HU-02 (#2) |
| `GET` | `/api/alumnos/:alumnoId/memorias` | Datos de la memoria asociada a un estudiante | — |
| `GET` | `/api/alumnos/:alumnoId/avances` | Historial de avances de un estudiante, del más reciente al más antiguo | HU-02 (#2) |
| `PUT` | `/api/alumnos/:alumnoId/memorias` | Actualiza la nota final de la memoria | — |
| `POST` | `/api/alumnos/:alumnoId/avances` | El estudiante registra un nuevo avance | HU-03 (#9) |
| `PUT` | `/api/alumnos/:alumnoId/avances/:numero/evaluacion` | El profesor guía registra la nota y la retroalimentación de un avance | HU-04 (#10) |

**Body de `POST /api/alumnos/:alumnoId/avances`** (Postman: *Body → raw → JSON*):

```json
{
  "num": 4,
  "rutaDoc": "/documentos/memorias/202173001/avance-04.pdf",
  "obj": "Probar el sistema con usuarios reales.",
  "comentarioA": "Primera versión."
}
```

**Body de `PUT /api/alumnos/:alumnoId/avances/:numero/evaluacion`:**

```json
{
  "retroalimentacion": "Buen avance.",
  "nota": 75
}
```

La nota es un entero entre 0 y 100. Con 55 o más, el avance queda `APROBADO`; con menos, `REPROBADO`.

### API_VALIDACIONES (`http://localhost:8081`)

Sin endpoints propios por ahora.

## Datos de prueba

Los scripts `DML_*.sql` cargan 6 profesores guía, 6 estudiantes y 14 avances. Algunos valores para probar:

| Para probar | Valor |
| --- | --- |
| Estudiante con 3 avances | `202173001` (Camila Rivas Morales, guía 1) |
| Profesor guía | `1` a `6` |
| Avance sin evaluar | estudiante `202173001`, avance `3` |

Por ejemplo, `GET http://localhost:8080/api/alumnos/202173001/avances` devuelve los 3 avances de Camila Rivas.

## Guía de prueba
Por temas de alcance, no agregamos el login que se muestra en el prototipo, por lo que se incluyen accesos directos a un memorista y profesor guía predeterminados.
- Memorista: 20217300-1 , Camila Rivas Morales, Su profesor guía es el número 1.
- Profesor Guía: 1.

Se adjuntaron dos botones con el acceso a cada uno de estos usuarios para los casos de prueba. 
El flujo está ideado para que se vayan probando las HU de forma secuencial, de la manera en la que 
se están documentando.

### HU-02  Refs #2
- Rol asociado: Profesor guía
- Paso 1: Seleccionar en el sistema "Profesor guía", de esta manera se accederá a la página.
- Paso 2: Seleccionar un memorista de la lista de memoristas mostradas en la página de inicio.
De esta manera se consultará el historial de avances de cada alumno, pueden aparecer varios 
avances entregados por partes del alumno con su fecha correspondiente o el memorista puede no poseer
avances por lo que, se tendría un aviso de esto (Criterios de aceptación 1 y 3). El criterio de
aceptación 2, que impide al profesor guía acceder al historial de un alumno que no tiene asignado,
quedó pendiente, ya que requiere identificar al usuario mediante autenticación. 

### HU-03   Refs #9
- Rol asociado: Memorista
- Paso 1: Seleccionar en el sistema "Memorista", para acceder como memorista.
- Paso 2: Seleccionar "Subir avance", en la parte superior de la página.
- Paso 3: Rellenar los bloques solicitados para cumplir con los datos necesarios del avance.
- Paso 4: Seleccionar "Enviar avance"
- Paso 5: Seleccionar "Volver a mis avances" para visualizar el registro completado
y el historial de los avances (Criterio aceptación 1 y 3).
- Paso 6: Seleccionar "Volver al inicio".
- Paso 7: Seleccionar "Profesor guía".
- Paso 8: Seleccionar el memorista (Camila Rivas Morales) para visualizar el avance 
registrado (Criterio aceptación 2).

### HU-04 Refs #10
- Rol asociado: Profesor guía
- Paso 1: Seleccionar en el sistema "Profesor guía".
- Paso 2: Seleccionar un memorista (Camila Rivas Morales).
- Paso 3: Seleccionar "Evaluar" en el avance que se desee retroalimentar.
- Paso 4: Rellenar los campos "Nota" y "Retroalimentación".
- Paso 5: Seleccionar "Guardar evaluación" (Criterio aceptación 1 y 2).
- Paso 6: Seleccionar "Volver al historial del alumno".
- Paso 7: Seleccionar "Volver a los alumnos".
- Paso 8: Seleccionar "Volver al inicio".
- Paso 9: Seleccionar "Memorista".
- Paso 10: Seleccionar el avance del cual se quiere revisar la evaluación (Criterio aceptación 3).

### HU-05 Refs #11
- Rol asociado: Memorista
- Paso 1: Seleccionar "Memorista"
- Paso 2: Seleccionar un avance, con esto aparece su respectiva nota y retroalimentación en el caso de
que esté evaluado, en caso contrario se avisa que no ha sido evaluado(Criterio aceptación 1,2 y 3).

### HU-14 Refs #14
- Rol asociado: Memorista
- Paso 1: Seleccionar "Memorista"
- Paso 2: Seleccionar "Subir avance".
- Paso 3: Rellenar el campo "Comentario" y guardar avance.
- Paso 4: Seleccionar "Volver a mis avances", donde aparecerán los respectivos avances y sus 
comentarios (Criterios de aceptación 1,2 y 3).
- Paso 5: Seleccionar "Volver al inicio".
- Paso 6: Seleccionar "Profesor guía".
- Paso 7: Seleccionar el memorista con el cual se subió el avance con el comentario, con lo cual 
aparecerán sus avances y con ellos sus respectivos comentarios (Criterio aceptación 4).

### HU-09 Refs #4
- Rol asociado: Profesor guía
- Paso 1: Seleccionar "Profesor guía".
- Paso 2: Seleccionar un memorista de los asignados.
- Paso 3: Seleccionar "Evaluar memoria".
- Paso 4: Rellenar el campo "Nota" (Criterio aceptación 1).
- Paso 5: Revisar el registro de la nota proporcionada (Criterio aceptación 3).



## Video final
Cabe aclarar que los criterios de aceptación ya cubren los cursos alternativos, por lo que no se mencionan directamente en el vídeo, pero si son considerados.
[Link al video](https://youtu.be/gMnXowk0bBg)

