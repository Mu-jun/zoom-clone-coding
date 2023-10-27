# Zoom Clone Coding

Learn WebSockets, WebRTC only with JS by Zoom clone coding

# Http VS WebSocket

| Http        | WebSocket                  |
| ----------- | -------------------------- |
| stateless   | stateful                   |
| half-duplex | full-duplex <br> real-time |

# [Socket.IO](https://socket.io/docs)

- socket.IO enables real-time, bidirectional and event-based communication.
- WebSocket이 없어도 사용가능하다.(Socket.IO is **NOT** a WebSocket implementation)
- [Features](https://socket.io/docs/#features)
  - **HTTP long-polling fallback** - The connection will fall back to HTTP long-polling in case the WebSocket connection cannot be established.
  - **Automatic reconnection** - when the client eventually gets disconnected, it automatically reconnects with an exponential back-off delay, in order not to overwhelm the server.
  - **Packet buffering** - The packets are automatically buffered when the client is disconnected, and will be sent upon reconnection.
  - **Acknowledgements** - Socket.IO provides a convenient way to send an event and receive a response
  - **Broadcasting** - On the server-side, you can send an event to all connected clients or to a subset of clients
  - **Multiplexing** - Namespaces allow you to split the logic of your application over a single shared connection.
