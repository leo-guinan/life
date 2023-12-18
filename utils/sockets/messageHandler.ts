export default (io: any, socket: any) => {
  const createdMessage = (msg: any) => {
    console.log("createdMessage", msg)
    socket.broadcast.emit("newIncomingMessage", msg)
  }

  socket.on("createdMessage", createdMessage)
}
