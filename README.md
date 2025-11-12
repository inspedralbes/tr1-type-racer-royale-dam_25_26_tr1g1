# MUVV | Aplicació d'exercici en temps real

MUVV és un joc web multijugador que et desafia a moure’t i competir. El seu nom ve de "Move" (moure’s), curt i fàcil de recordar. La doble “V” li dona un toc modern i simbolitza victòria, vigor i vitalitat —perfecte per a una app d’energia i moviment.

A MUVV, has d’escriure ràpid mentre fas exercicis físics que el sistema detecta amb la càmera i TensorFlow.js (Pose Detection). Pots crear partides, convidar amics i competir per demostrar qui és el més ràpid i en forma.
En resum: mou-te, juga i guanya!

## Membres de l'equip

- Martí Castaño Rodríguez
- Angel Cuadra Acosta
- Fiona Mondelo Giaramita
- Roberto Lotreanu

## Tecnologies Utilitzades (Tech Stack)

- **Frontend:** Vue.js, Vite, Pinia, Vue Router, Tailwind CSS
- **Backend:** Node.js, Express.js, WebSocket
- **Base de dades:** Adminer 
- **IA/ML:** TensorFlow.js (Pose Detection)
- **Contenidorització:** Docker

## Gestió del Projecte

- **Gestor de Tasques:** [Enllaç a Taiga](https://tree.taiga.io/project/kore29-dam_25_26_tr1g1/timeline) 
- **Documentació:** [Wiki](https://github.com/inspedralbes/tr1-type-racer-royale-dam_25_26_tr1g1/tree/main/doc)
- **URL de Producció:** (Encara no desplegat)

## Començant (Getting Started)

Per executar aquest projecte localment, necessites tenir Docker i Docker Compose instal·lats.

1.  **Clona el repositori:**

    ```bash
    git clone <url-del-repositori>
    cd tr1-type-racer-royale-dam_25_26_tr1g1
    ```

2.  **Executa l'aplicació:**

    ```bash
    docker-compose up -d --build
    ```

3.  **Accedeix als serveis:**
    - **Frontend:** [http://localhost:3000](http://localhost:3000)
    - **Backend:** [http://localhost:5000](http://localhost:5000)
    - **Adminer (Gestor de BD):** [http://localhost:8080](http://localhost:8080)

## Estat del Projecte

El projecte es troba actualment en fase de desenvolupament. S'estan implementant les funcionalitats principals com la creació de sessions, la comunicació en temps real i la detecció bàsica de postures.
