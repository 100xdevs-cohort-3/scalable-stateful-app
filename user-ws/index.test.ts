import { test, describe, expect } from "bun:test";

const BACKEND_URL1 = "ws://localhost:8080"
const BACKEND_URL2 = "ws://localhost:8081"

describe("Chat application", () => {
    
    test("Message sent from room 1 reaches another participant in room 1", async() => {
        const ws1 = new WebSocket(BACKEND_URL1)
        const ws2 = new WebSocket(BACKEND_URL2)

       await new Promise<void>((resolve, reject) => {
            let count = 0;
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
       });

        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        await new Promise<void>((resolve) => {
            ws2.onmessage = ({data}) => {
                const parsedData = JSON.parse(data);
                expect(parsedData.type == "chat")
                expect(parsedData.message == "Hi there")
                resolve()
            }
    
            ws1.send(JSON.stringify({
                type: "chat",
                room: "Room 1",
                message: "Hi there"
            }))
        })

    })
})