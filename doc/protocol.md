## Connexió i gestió sales:

Sol·licitud per unir-se: 
- type: `"UNIR_SALA", usuari: string, sala_id: string, exercici: string` 

Confirmació que el client s'ha unit correctament:
- type:  `"UNIO_CORRECTA", sala_id: string, initial_state: object`

Notificació a tots els membres de la sala que un nou usuari s'ha unit:
- type: `"USUARI_CONECTAT", usuari: string, timestamp: number`

Sol·licitud per abandonar la sala.
- type: `"SORTIR_SALA", sala_id: string, usuari: string`

Notificació que un usuari ha abandonat la sessió.
- type: `"USUARI_DESCONECTAT", usuari: string, timestamp: number`

Missatge d'error general:
- type: `"ERROR", missatge: string, codi: number`

## Dades entrenament:  

Usuari envia la seva última actualització de nivell
- type: `"ACT_NIVELL", usuari: string, repeticions: numero, punts_tecnica: number, nivell: string` 

El servidor recalcula i envia el leaderboard actualitzat a tots els participants
- type: `"LEADERBOARD_ACT", data: array<object>` (usuaris +dades) 

El servidor envia un missatge de feedback tècnic a l'usuari 
- type: `"FEEDBACK", feedback: string`

## Estat de la sala: 

Indica que l'entrenament comença.
- type: `"SESSIO_INICIA", timestamp: number`

Indica que la sessió ha finalitzat (per temps, repeticions objectiu, etc.).
- type: `"SESSIO_ACABA", final_leaderboard: object`
