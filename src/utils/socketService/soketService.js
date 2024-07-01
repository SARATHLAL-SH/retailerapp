import { io } from "socket.io-client";
import { WAPI } from "../ApiUtils";

const SOKET_URL = WAPI

class WService {
    initializeSocket = async () =>{
        try{
            this.socket = io(SOKET_URL,{
                transports: ['websocket','polling', 'flashsocket'],
                
            });
            console.log("initialized socket",this.socket);

            this.socket.on("connect",()=>{
                console.log("==>connected to socket<===");
            })
            this.socket.on("disconnect",()=>{
                console.log("==>disconnected to socket<===");
            })
            this.socket.on("connect_error",()=>{
                console.log("==>error to socket<===");
            })
        }catch(error){
            console.log("socket is not initialized",error);
        }
    }
    emit(event,data ={}){
        this.socket.emit(event,data);
    }
    emitTo(event,cb ={}){
        this.socket.on(event,cb);
    }
    removeListener(event){
        this.socket.removeListener(event);
    }
}
const socketService = new WService();
export default socketService;