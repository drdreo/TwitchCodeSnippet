package main

import (
	"flag"
    "log"
    "net/http"
    "github.com/gorilla/websocket"
)

type CodeSnippet struct {
    Code     string `json:"code"`
    User     string `json:"user"`
}


var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true // TODO: Adjust this to a more secure setting for production
    },
}

var addr = flag.String("addr", "localhost:8088", "http service address")

func handleConnections(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Print("upgrade:", err)
        return
    }
    defer ws.Close()

    // Mock code snippet
    codeSnippet := `{ "code": "fmt.Println(\"Hello, Twitch!\")", "user": "DrDreo" }`

    // Send the mock code snippet to the connected WebSocket client (JetBrains plugin)
    if err := ws.WriteMessage(websocket.TextMessage, []byte(codeSnippet)); err != nil {
        log.Println("write error:", err)
    }
}

func main() {
	flag.Parse()
	log.SetFlags(0)

    http.HandleFunc("/ws", handleConnections)

    log.Printf("Server starting on %s", *addr)
   	log.Fatal(http.ListenAndServe(*addr, nil))
}
