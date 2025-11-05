-- 🧍‍♂️ Tabla: USUARI

CREATE TABLE Usuari (
    id_usuari INT AUTO_INCREMENT PRIMARY KEY,
    nom_usuari VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasenya VARCHAR(255) NOT NULL,
    estadistiques JSON DEFAULT NULL,
    data_registre DATETIME DEFAULT CURRENT_TIMESTAMP,
    pes_actual DECIMAL(5,2) DEFAULT NULL,
    pes_objectiu DECIMAL(5,2) DEFAULT NULL,
    altura DECIMAL(5,2) DEFAULT NULL,
    biografia TEXT DEFAULT NULL
);

-- 🧭 Tabla: SESSIONS

CREATE TABLE Sessions (
    id_sessio INT AUTO_INCREMENT PRIMARY KEY,
    creador_id INT NOT NULL,
    nom_sessio VARCHAR(100) NOT NULL,
    estat VARCHAR(50),
    max_participants INT DEFAULT 10,
    configuracio JSON DEFAULT NULL,
    data_inici DATETIME DEFAULT NULL,
    data_finalitzacio DATETIME DEFAULT NULL,
    FOREIGN KEY (creador_id) REFERENCES Usuari(id_usuari)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 🏋️ Tabla: EXERCICIS

CREATE TABLE Exercicis (
    id_exercici INT AUTO_INCREMENT PRIMARY KEY,
    id_sessio INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    parametres JSON DEFAULT NULL,
    repeticions INT DEFAULT 0,
    durada INT DEFAULT 0,
    FOREIGN KEY (id_sessio) REFERENCES Sessions(id_sessio)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- 👥 Tabla: PARTICIPANTS

CREATE TABLE Participants (
    id_sessio INT NOT NULL,
    id_usuari INT NOT NULL,
    resultats TEXT DEFAULT NULL,
    posicio_final INT DEFAULT NULL,
    data_unio DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_sessio, id_usuari),
    FOREIGN KEY (id_sessio) REFERENCES Sessions(id_sessio)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_usuari) REFERENCES Usuari(id_usuari)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 🏆 Tabla: LEADERBOARD
CREATE TABLE Leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sessio INT NOT NULL,
    id_usuari INT NOT NULL,
    puntuacio_actual INT DEFAULT 0,
    ultim_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sessio) REFERENCES Sessions(id_sessio)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_usuari) REFERENCES Usuari(id_usuari)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
-- 📊 Tabla: RESULTATS

CREATE TABLE Resultats (
    id_sessio INT NOT NULL,
    id_usuari INT NOT NULL,
    id_exercici INT NOT NULL,
    repeticions INT DEFAULT 0,
    PRIMARY KEY (id_sessio, id_usuari, id_exercici),
    FOREIGN KEY (id_sessio) REFERENCES Sessions(id_sessio)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_usuari) REFERENCES Usuari(id_usuari)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_exercici) REFERENCES Exercicis(id_exercici)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


