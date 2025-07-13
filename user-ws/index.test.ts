import { test, describe } from "bun:test";

const BACKEND_URL = "ws://localhost:8080"

describe("Chat application", () => {
    
    test("Message sent from room 1 reaches another participant in room 1", async() => {
        const ws1 = new WebSocket(BACKEND_URL)
        const ws2 = new WebSocket(BACKEND_URL)

        // make sure the sockets are connected


    // Promise.all
       await new Promise<void>((resolve, reject) => {
            let count = 1;
            ws1.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    resolve()
                }
            }

            ws2.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    resolve()
                }
            }
       }) 

        console.log("hi hello both done")
        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        ws1.send(JSON.stringify({
            type: "chat",
            room: "hi there"
        }))


    })
})