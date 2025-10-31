import { registerUser, loginUser } from "./users.js";
import { getSessions } from "./sessions.js";

export const setupWebsocketHandlers = (ws) => {
  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case "REGISTER_USER":
          try {
            const result = await registerUser(
              data.payload.username,
              data.payload.email,
              data.payload.password
            );
            ws.send(
              JSON.stringify({ type: "REGISTER_SUCCESS", payload: result })
            );
            console.log(result);
          } catch (err) {
            if (err.message === "USERNAME_EXISTS") {
              ws.send(
                JSON.stringify({
                  type: "REGISTER_ERROR",
                  payload: "El nom d'usuari ja existeix",
                })
              );
            } else {
              ws.send(
                JSON.stringify({
                  type: "REGISTER_ERROR",
                  payload: "Error intern al registrar",
                })
              );
            }
          }
          break;

        case "LOGIN_USER":
          try {
            const user = loginUser(
              data.payload.username,
              data.payload.password
            );
            ws.send(JSON.stringify({ type: "LOGIN_SUCCESS", payload: user }));
          } catch (err) {
            ws.send(
              JSON.stringify({
                type: "LOGIN_ERROR",
                payload: "Credencials incorrectes",
              })
            );
          }
          break;

        case "GET_SESSIONS":
          try {
            const sessions = getSessions();

            ws.send(
              JSON.stringify({ type: "SESSIONS_LIST", payload: sessions })
            );
          } catch (err) {
            ws.send(
              JSON.stringify({
                type: "SESSIONS_ERROR",
                payload: "Error a l'obtenir les sessions",
              })
            );
          }
          break;

        default:
          console.log("Tipus de missatge desconegut:", data.type);
      }
    } catch (err) {
      console.error("Error al parsear JSON:", err);
      ws.send(JSON.stringify({ type: "ERROR", payload: "JSON invàlid" }));
    }
  });

  ws.on("close", () => {
    // aquí podrías limpiar recursos del socket si hace falta
  });
};
