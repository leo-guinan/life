import { Server, ServerOptions} from "socket.io"
import messageHandler from "../../utils/sockets/messageHandler"

export default function SocketHandler(_req: any, res: any) {
  console.log("handling websocket connection")
  // It means that socket server was already initialised
  if (res?.socket?.server?.io) {
    console.log("Already set up")
    res.end()
    return
  }

  const io = new Server(res?.socket?.server)
  res.socket.server.io = io

  const onConnection = (socket: any) => {
    messageHandler(io, socket)
  }

  // Define actions inside
  io.on("connection", onConnection)

  console.log("Setting up socket")
  res.end()
}
