## Protocol de Comunicació WebSocket

Aquest document descriu els tipus de missatges intercanviats entre el client i el servidor a través de WebSockets. Tots els missatges són objectes JSON amb una estructura bàsica: `{ "type": "TIPUS_MISSATGE", "payload": { ...dades... } }`.

### 1. Gestió de Connexió i Usuaris

#### Missatges de Client a Servidor (C2S)

- **REGISTER_WEBSOCKET**: Registra la connexió WebSocket amb un ID d'usuari existent per associar la connexió amb un usuari autenticat.

  - `payload`: `{ userId: string }`

- **REGISTER_USER**: Sol·licitud per registrar un nou usuari al sistema.

  - `payload`: `{ username: string, email: string, password: string, pesoActual: number, altura: number }`

- **LOGIN_USER**: Sol·licitud per autenticar un usuari i iniciar la seva sessió.
  - `payload`: `{ username: string, password: string }`

#### Missatges de Servidor a Client (S2C)

- **REGISTER_SUCCESS**: Confirma que el registre de l'usuari ha estat exitós.

  - `payload`: `{ userId: string, username: string }`

- **REGISTER_FAIL**: Notifica que el registre de l'usuari ha fallat, amb un missatge d'error.

  - `payload`: `{ message: string }`

- **LOGIN_SUCCESS**: Confirma que l'inici de sessió ha estat exitós.

  - `payload`: `{ userId: string, username: string }`

- **LOGIN_FAIL**: Notifica que l'inici de sessió ha fallat, amb un missatge d'error.

  - `payload`: `{ message: string }`

- **ERROR**: Missatge genèric per indicar un error al client.
  - `payload`: `{ message: string }`

### 2. Gestió de Sales i Sessions

#### Missatges de Client a Servidor (C2S)

- **CREATE_SESSION**: Sol·licitud per crear una nova sala de joc.

  - `payload`: `{ name: string, description: string, duration: string, exercise_type: string, private: boolean, password?: string }`

- **JOIN_SESSION**: Sol·licitud per unir-se a una sala de joc existent.

  - `payload`: `{ sessionId: string, password?: string }`

- **DELETE_SESSION**: Sol·licitud per eliminar una sala de joc (normalment només pel Game Master).

  - `payload`: `{ sessionId: string }`

- **LEAVE_SESSION**: Sol·licitud per abandonar la sala de joc actual.

  - `payload`: `{ sessionId: string }`

- **SET_READY**: Indica que l'usuari que ha enviat el missatge està preparat per iniciar la sessió dins de la sala.

  - `payload`: `{}` (el servidor utilitza l'ID de l'usuari associat a la connexió WebSocket)

- **NEXT_EXERCISE**: Sol·licitud per avançar al següent exercici de la sessió (només el Game Master).
  - `payload`: `{}`

#### Missatges de Servidor a Client (S2C)

- **SESSIONS_UPDATE**: Envia la llista actualitzada de totes les sessions disponibles (públiques i privades a les quals l'usuari pot accedir).

  - `payload`: `array<object>` (llista de sessions amb les seves dades públiques)

- **SESSION_UPDATE**: Envia l'estat actualitzat d'una sessió específica als seus participants. Inclou l'estat de la partida, usuaris, puntuacions, exercici actual, etc.

  - `payload`: `object` (objecte de sessió complet)

- **CREATE_SUCCESS**: Confirma que la creació de la sala ha estat exitosa.

  - `payload`: `object` (detalls de la sessió creada)

- **JOIN_SUCCESS**: Confirma que el client s'ha unit correctament a una sessió.

  - `payload`: `object` (detalls de la sessió a la qual s'ha unit)

- **LEAVE_SUCCESS**: Confirma que el client ha abandonat la sessió.

  - `payload`: `{}`

- **GAME_EVENT**: Notifica esdeveniments importants del joc dins d'una sessió, com ara la unió d'un usuari, canvis de posició al rànquing, etc.
  - `payload`: `{ text: string, gif?: string, ... }`

### 3. Dades d'Entrenament i Interacció en Sessió

#### Missatges de Client a Servidor (C2S)

- **UPDATE_SCORE**: Notifica al servidor que s'ha detectat una repetició o una actualització de puntuació per part de l'usuari.

  - `payload`: `{}` (el servidor calcula la puntuació a partir de la detecció del client)

- **SEND_EMOJI_REACTION**: Envia una reacció d'emoji des d'un usuari cap a la sessió.
  - `payload`: `{ emoji: string }`

#### Missatges de Servidor a Client (S2C)

- **EMOJI_REACTION**: Difon una reacció d'emoji rebuda als altres participants de la sessió.
  - `payload`: `{ emoji: string, userId: string, sessionId: string }`

### 4. Estat de la Sessió (Server a Client)

- **SESSIO_INICIA**: Indica que l'entrenament ha començat dins d'una sessió. Aquest estat es comunica mitjançant el camp `status: "IN_PROGRESS"` dins del missatge `SESSION_UPDATE`.

  - `payload`: (implícit en `SESSION_UPDATE` amb `session.state.status = "IN_PROGRESS"`)

- **SESSIO_ACABA**: Indica que la sessió de joc ha finalitzat. Aquest estat es comunica mitjançant el camp `status: "FINISHED"` dins del missatge `SESSION_UPDATE`. El leaderboard final és part de l'objecte de sessió.
  - `payload`: (implícit en `SESSION_UPDATE` amb `session.state.status = "FINISHED"`)
