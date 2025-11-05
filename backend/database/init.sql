CREATE TABLE Usuari (
    nom_usuari VARCHAR(100) PRIMARY KEY,
    contrasenya VARCHAR(255) NOT NULL,
    correu VARCHAR(150) NOT NULL UNIQUE,
    data_registre DATETIME DEFAULT CURRENT_TIMESTAMP,
    pes_actual DECIMAL(5,2) DEFAULT NULL,
    altura DECIMAL(5,2) DEFAULT NULL,
    biografia TEXT DEFAULT NULL
);

CREATE TABLE Sessions (
    id_sessio INT AUTO_INCREMENT PRIMARY KEY,
    nom_usuari VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    estat ENUM('publica', 'privada') DEFAULT 'publica',
    max_usuaris INT DEFAULT 10,
    FOREIGN KEY (nom_usuari) REFERENCES Usuari(nom_usuari)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Participa (
    id_sessio INT NOT NULL,
    nom_usuari VARCHAR(100) NOT NULL,
    posicio INT DEFAULT NULL,
    puntuacio INT DEFAULT 0,
    PRIMARY KEY (id_sessio, nom_usuari),
    FOREIGN KEY (id_sessio) REFERENCES Sessions(id_sessio)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (nom_usuari) REFERENCES Usuari(nom_usuari)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
