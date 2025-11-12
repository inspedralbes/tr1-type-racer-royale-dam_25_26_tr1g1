CREATE TABLE IF NOT EXISTS Usuaris (
    id CHAR(36) BINARY PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    biografia TEXT,
    pesoActual FLOAT,
    altura INTEGER,
    nivel FLOAT DEFAULT 0,
    foto_perfil VARCHAR(255),
    date_created DATETIME
);

CREATE TABLE IF NOT EXISTS Sessions (
    id CHAR(36) BINARY PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha DATETIME NOT NULL,
    tipo_ejercicio VARCHAR(50) NOT NULL, 
    duracion VARCHAR(50) NOT NULL,      
    password VARCHAR(255),           
    max_usuarios INT NOT NULL,          
    creador_id CHAR(36) BINARY,
    CONSTRAINT fk_creador FOREIGN KEY (creador_id) REFERENCES Usuaris(id) ON DELETE CASCADE
);

-- Crear tabla Participa
CREATE TABLE IF NOT EXISTS Participa (
    id CHAR(36) BINARY PRIMARY KEY,
    session_id CHAR(36) BINARY NOT NULL,
    user_id CHAR(36) BINARY NOT NULL,
    puntuacion INT DEFAULT 0,
    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES Sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Usuaris(id) ON DELETE CASCADE
);