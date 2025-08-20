// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Change if backend is hosted elsewhere
export const socket = io(SOCKET_URL, { autoConnect: false });
