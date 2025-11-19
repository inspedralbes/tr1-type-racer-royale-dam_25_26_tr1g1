<div align="center">
  <img src="frontend/src/assets/logo.png" alt="MUVV Logo" width="200"/>
  <h1>MUVV | Aplicació d'exercici en temps real</h1>
</div>

<div align="center">
  <a href="https://github.com/inspedralbes/tr1-type-racer-royale-dam_25_26_tr1g1/actions/workflows/deploy.yml">
    <img src="https://github.com/inspedralbes/tr1-type-racer-royale-dam_25_26_tr1g1/actions/workflows/deploy.yml/badge.svg" alt="Build Status">
  </a>
  <a href="https://github.com/inspedralbes/tr1-type-racer-royale-dam_25_26_tr1g1/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/inspedralbes/tr1-type-racer-royale-dam_25_26_tr1g1" alt="Contributors">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
</div>

**MUVV** és un joc web social i multijugador que et desafia a moure’t, competir i connectar. El seu nom ve de "Move" (moure’s), curt i fàcil de recordar. La doble “V” li dona un toc modern i simbolitza victòria, vigor i vitalitat —perfecte per a una app d’energia i moviment.

A MUVV, has de fer exercicis físics que el sistema detecta amb la teva càmera i **TensorFlow.js (Pose Detection)**. Pots crear partides, convidar amics i competir per demostrar qui és el més en forma. A més, pots compartir el teu progrés, seguir altres usuaris i interactuar en una comunitat activa. En resum: **mou-te, connecta, juga i guanya!**

<table align="center">
  <tr>
    <td align="center">
      <img src="content/761shots_so.png" alt="MUVV screenshots" style="max-width: 100%; height: auto;"/>
    </td>
    <td align="center">
      <img src="content/648shots_so.png" alt="MUVV screenshots" style="max-width: 100%; height: auto;"/>
    </td>
  </tr>
</table>

## 📜 Taula de Continguts

- [📜 Taula de Continguts](#-taula-de-continguts)
- [✨ Característiques Principals](#-característiques-principals)
- [📱 Seccions de l'Aplicació](#-seccions-de-laplicació)
- [🛠️ Tecnologies Utilitzades](#️-tecnologies-utilitzades)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [DevOps i Eines](#devops-i-eines)
- [📚 Documentació Tècnica](#-documentació-tècnica)
- [🚀 Començant](#-començant)
  - [📋 Prerequisits](#-prerequisits)
  - [⚙️ Instal·lació](#️-installació)
- [🐳 Ús amb Docker](#-ús-amb-docker)
- [📁 Estructura del Projecte](#-estructura-del-projecte)
- [🚢 Desplegament](#-desplegament)
- [🧑‍💻 Membres de l'Equip](#-membres-de-lequip)

## ✨ Característiques Principals

- **Detecció de Moviment per IA:** Utilitza TensorFlow.js per analitzar la postura corporal en temps real a través de la càmera web.
- **Sessions Multijugador:** Crea sales privades o uneix-te a sessions públiques per competir amb amics o altres jugadors.
- **Component Social:** Segueix altres usuaris, comenta a les seves publicacions i comparteix els teus assoliments.
- **Sistema de Puntuació i Rànquing:** Guanya punts per cada repetició correcta i puja en el rànquing global i de cada sessió.
- **Perfils d'Usuari:** Gestiona el teu perfil, mira les teves estadístiques, el teu progrés i la teva activitat social.
- **Notificacions en Temps Real:** Rep alertes de nous seguidors, comentaris a les teves publicacions i invitacions a sessions.
- **Rutines d'Exercicis Personalitzades:** Tria entre diferents rutines d'exercicis segons el teu nivell i objectius.

## 📱 Seccions de l'Aplicació

- **Social:** Un _feed_ d'activitats on pots veure les publicacions dels usuaris que segueixes, comentar i reaccionar.
- **Sessions:** Explora i uneix-te a sessions públiques o crea les teves pròpies partides, personalitzant la durada, la dificultat i els exercicis.
- **Rutines:** Descobreix diferents rutines d'entrenament predissenyades per treballar zones específiques del cos.
- **Perfil:** Visualitza les teves estadístiques, progrés, publicacions i gestiona els teus seguidors i usuaris seguits.
- **Rànquing:** Consulta la classificació global d'usuaris per veure qui acumula més punts.

## 🛠️ Tecnologies Utilitzades

A continuació es detallen les tecnologies, llibreries i eines principals que fan possible **MUVV**.

### Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize"/>
  <img src="https://img.shields.io/badge/WebSockets-000000?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSockets"/>
</p>

- **Node.js**: Entorn d'execució per a JavaScript al servidor.
- **Express.js**: Framework per construir l'API REST i la lògica de negoci.
- **MySQL**: Sistema de gestió de bases de dades relacional.
- **Sequelize**: ORM (Object-Relational Mapper) per interactuar amb la base de dades.
- **WebSockets (`ws`)**: Per a la comunicació bidireccional en temps real.

### Frontend

<p>
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Pinia-FFB300?style=for-the-badge" alt="Pinia"/>
  <img src="https://img.shields.io/badge/Vue_Router-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue Router"/>
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
</p>

- **Vue.js 3**: Framework progressiu per construir la interfície d'usuari.
- **Vite**: Eina de desenvolupament i empaquetat ultra ràpida.
- **Tailwind CSS**: Framework de CSS "utility-first" per a un disseny ràpid i personalitzat.
- **Pinia**: Gestor d'estats per a Vue.js.
- **Vue Router**: Llibreria de routing oficial per a Vue.js.
- **TensorFlow.js (`Pose-Detection`)**: Per a la detecció de postures corporals en temps real.

### DevOps i Eines

<p>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"/>
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions"/>
  <img src="https://img.shields.io/badge/Certbot-004488?style=for-the-badge&logo=certbot&logoColor=white" alt="Certbot"/>
  <img src="https://img.shields.io/badge/Adminer-333333?style=for-the-badge" alt="Adminer"/>
</p>

- **Docker & Docker Compose**: Per a la containerització i orquestració de l'aplicació.
- **Nginx**: Servidor web utilitzat com a reverse proxy en producció.
- **GitHub Actions**: Per a la integració i desplegament continus (CI/CD).
- **Certbot**: Per a la gestió de certificats SSL/TLS (HTTPS).
- **Adminer**: Eina lleugera per a la gestió de la base de dades.

## 📚 Documentació Tècnica

[Link de DeepWiki](https://deepwiki.com/search/hazme-un-diagrama-sobre-todos_7e0521d2-70a5-496a-89c5-bf86051adec0)

Accedeix als detalls tècnics, diagrames d'arquitectura i especificacions de protocols a través dels següents enllaços:

| Document / Diagrama                                        | Tipus        | Descripció                                                                     |
| :--------------------------------------------------------- | :----------- | :----------------------------------------------------------------------------- |
| [**📄 Protocols WebSocket**](docs/Protocolos_websocket.md) | Documentació | Especificació completa d'esdeveniments, missatges i comunicació en temps real. |
| [**📊 Components Vue**](docs/Diagrama_Components_Vue.png)  | Diagrama     | Arbre de components i jerarquia de la interfície d'usuari.                     |
| [**📊 Docker Dev**](docs/Diagrama_Docker_Dev.png)          | Diagrama     | Arquitectura de contenidors i volums per a l'entorn de desenvolupament.        |
| [**📊 Docker Prod**](docs/Diagrama_Docker_Prod.png)        | Diagrama     | Arquitectura de producció amb Nginx, SSL i Proxy Invers.                       |
| [**📊 Lògica IA**](docs/Diagrama_Lògica_AI.png)            | Diagrama     | Flux de dades de TensorFlow.js per a la detecció d'exercicis.                  |
| [**📊 Pinia Stores**](docs/Diagrama_Dades_Pinia.png)       | Diagrama     | Gestió de l'estat global i flux de dades al frontend.                          |

## 🚀 Començant

Per executar aquest projecte localment, segueix els passos següents.

### 📋 Prerequisits

Assegura't de tenir instal·lat el següent programari:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### ⚙️ Instal·lació

1.  **Clona el repositori:**

    ```bash
    git clone [https://github.com/inspedralbes/tr1-type-racer-royale-dam_25_26_tr1g1.git](https://github.com/inspedralbes/tr1-type-racer-royale-dam_25_26_tr1g1.git)
    cd tr1-type-racer-royale-dam_25_26_tr1g1
    ```

2.  **Configura les variables d'entorn:**
    El projecte utilitza diferents arxius `.env` per a la configuració. Hauràs de crear-los manualment a partir dels exemples.

    - **Backend:** Crea un arxiu anomenat `.env.development` dins de la carpeta `backend/` amb el següent contingut:

      ```env
      PORT=5000
      CORS_ORIGIN=http://localhost:3000
      DB_HOST=tr1-mysql
      DB_DATABASE=muvv-database
      DB_USER=user
      DB_PASSWORD=password
      DB_PORT=3306
      ```

    - **Frontend:** Crea un arxiu anomenat `.env.development` dins de la carpeta `frontend/` amb el següent contingut:
      ```env
      VITE_API_URL=http://localhost:5000
      VITE_WS_URL=ws://localhost:5000
      ```
      > **Nota:** Les variables del frontend a `docker-compose.yml` sobreescriuen les de l'arxiu `.env.development` quan s'executa amb Docker.

## 🐳 Ús amb Docker

La forma més senzilla d'executar l'aplicació completa (frontend, backend i base de dades) és amb Docker Compose.

1.  **Aixeca els contenidors:**
    Aquest comandament construirà les imatges i iniciarà els serveis en segon pla.

    ```bash
    docker-compose up -d --build
    ```

2.  **Accedeix als serveis:**

    - **Frontend:** [http://localhost:3000](http://localhost:3000)
    - **Backend:** [http://localhost:5000](http://localhost:5000)
    - **Adminer (Gestor de BD):** [http://localhost:8080](http://localhost:8080)

3.  **Atura els contenidors:**
    ```bash
    docker-compose down
    ```

## 📁 Estructura del Projecte

```
.
├── backend/        \# Codi del servidor (Node.js, Express, Sequelize)
├── data/           \# Dades persistents (certificats SSL de Certbot, etc.)
├── docs/           \# Documentació tècnica i diagrames
├── frontend/       \# Codi del client (Vue.js, Vite, Pinia, Tailwind CSS)
├── nginx/          \# Configuració de Nginx per a producció
├── docker-compose.yml      \# Orquestració de contenidors per a desenvolupament
├── docker-compose.prod.yml \# Orquestració de contenidors per a producció
└── README.md
```

## 🚢 Desplegament

Per a producció, s'utilitza el fitxer `docker-compose.prod.yml`, que inclou un contenidor de Nginx com a reverse proxy i gestiona els certificats SSL amb Certbot.

El desplegament està automatitzat amb **GitHub Actions** a través del workflow definit a `.github/workflows/deploy.yml`. Cada vegada que es fa un _push_ a la branca `main`, s'executa un procés que actualitza l'aplicació al servidor de producció.

## 🧑‍💻 Membres de l'Equip

- Martí Castaño Rodríguez
- Angel Cuadra Acosta
- Fiona Mondelo Giaramita
- Roberto Lotreanu
