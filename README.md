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

## [Data Channel](https://webrtc.org/getting-started/data-channels?hl=ko)

## STUN 서버

- 서로 다른 네트워크에 있는 Peer를 연결해 주기 위해 필요함.
- NAT의 유형 및 NAT에 의해 특정 로컬 포트와 연결된 인터넷 측 포트를 찾을 수 있도록 해주는 역할

- STUN 은 Session Traversal Utilities for NAT 의 약자이다. STUN 은 IETF RFC 5389에 정의된 네트워크 프로토콜/패킷 포맷으로, 네트워크 환경에 대한 Discovery 를 위한 것이다. 메신저들끼리 통신하기 위하여 STUN 패킷을 이용한다. STUN은 IP 종단을 연결하기 위해서

  1.  어떤 종단이 NAT/Firewall 뒤에 있는지를 판단하게 해준다.

  2.  어떤 종단에 대한 Public IP Address를 결정하고 NAT/FIrewall의 유형에 대해서 알려준다.

  2)번의 정보를 가지고 P2P IP 연결을 위한 정보를 제공해주는 것이다. STUN은 P2P IP 연결을 위한 정보를 제공하주기만 할 뿐이며, 어떤 종단의 환경이 P2P IP 연결이 불가능할 경우에는 연결을 위해서 STUN이 해줄수 있는 것은 없다. 이럴 경우 TURN을 이용해야 한다.

  STUN은 Public 관점에서 종단에 Access 가능한 IP:Port를 발견하는 작업인 것이다.

## [TURN 서버](https://webrtc.org/getting-started/turn-server?hl=ko)

- TURN은 Traversal Using Relays around NAT의 약자이다. Peer간 직접 통신이 실패할 경우 종단점들 사이에 데이터 릴레이를 수행하는 TURN 서버들을 사용한다. TURN 은 Peer 들간의 미디어 스트리밍을 릴레이하기 위해 사용된다. TURN은 공용 주소들을 가지고 있으며 미디어를 릴레이 하기 때문에 네트워크와 컴퓨팅 자원이 소모될 수 있다.
- 오픈소스 COTURN 프로젝트 https://github.com/coturn/coturn

### [STUN, TURN, ICE](https://alnova2.tistory.com/1110)

## WebRTC를 사용하면 안 되는 환경

- peer 수가 매우 많아질 경우(고사양?고용량? 스트림의 경우) => 그물망 구조가 됨.
  - 해결법 : SFU(Selective Forwarding Unit) 사용 : 중요하지 않은 스트림을 압축하여 저사양의 스트림으로 전달

# localtunnel

- `npx localtunnel --port 3000`
- local 서버의 url을 생성해 줌.
