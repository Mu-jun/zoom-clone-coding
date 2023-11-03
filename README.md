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

## Recap

- 이벤트 명을 커스텀하기 쉽다.
- object, number, string 상관없이 보낼 수 있다.
- 매개변수를 여러개 보낼 수 있다.
- 완료되었을 때 client에서 실행될 callback 함수를 보낼 수 있다.(<U>callback 함수는 꼭 마지막 매개변수에 넣어야함.</U>)
  - 흐름제어? 제어의 역전?

# Video Tag (\<video />)

- IOS에서 자동재생 되기 위해서는 playsinline 속성이 추가적으로 필요함.

# WebRTC

- 사용자끼리 peer-to-peer(P2P)로 연결하여 텍스트, 영상, 오디오 등을 전송할 수 있게 브라우저 간에 서로 통신할 수 있도록 설계된 API
- 사용자끼리 연결되기 위해 서버가 Signaling 해주어야 함.

## [피어 연결](https://webrtc.org/getting-started/peer-connections?hl=ko)

## [스트림 전송](https://webrtc.org/getting-started/remote-streams?hl=ko)

## [Sender](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender)

## STUN Server

- 서로 다른 네트워크에 있는 Peer를 연결해 주기 위해 필요함.
- NAT의 유형 및 NAT에 의해 특정 로컬 포트와 연결된 인터넷 측 포트를 찾을 수 있도록 해주는 역할

# localtunnel

- `npx localtunnel --port 3000`
- local 서버의 url을 생성해 줌.
