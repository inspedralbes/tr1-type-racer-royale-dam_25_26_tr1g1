
import { useWebSocketStore } from '@/stores/websocket';

export function registerWebSocket(app) {
  const websocketStore = useWebSocketStore();
  app.config.globalProperties.$websocket = websocketStore;
}
