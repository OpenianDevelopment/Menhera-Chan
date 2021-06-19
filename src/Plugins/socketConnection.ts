import { io } from "socket.io-client";
const socketConnection = io("http://localhost:3000/");
export default socketConnection;
