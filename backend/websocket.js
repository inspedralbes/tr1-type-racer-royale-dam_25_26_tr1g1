const sendError = (ws, type, message) => {
  ws.send(JSON.stringify({ type, payload: message }));
};

const handleRegisterWebsocket = (ws, payload) => {
  if (payload.userId) {
    ws.userId = payload.userId;
    console.log(`WebSocket registered for user ${ws.userId}`);
  }
};

export const setupWebsocketHandlers = (ws, wss) => {
  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      switch (data.type) {
        case "REGISTER_WEBSOCKET":
          handleRegisterWebsocket(ws, data.payload);
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
    if (ws.userId) {
      console.log(`User ${ws.userId} disconnected. Removing from session.`);
    }
  });
};
