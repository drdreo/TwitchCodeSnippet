package main

import (
    "encoding/json"
    "os"
    "flag"
    "fmt"
    "github.com/gorilla/websocket"
    "log"
    "net/http"
    "time"
)

type CodeSnippet struct {
    Code     string `json:"code"`
    TwitchId string `json:"twitchId"`
}

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true // TODO: Adjust this to a more secure setting for production
    },
}

var addr = flag.String("addr", "localhost:8088", "http service address")

var manager = NewConnectionManager()

func handleConnections(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Print("upgrade:", err)
        return
    }
    defer ws.Close()

    fmt.Println("handling connections")

    manager.AddConnection(ws)

    // Define a slice of code snippets to simulate changes.
    test := `
const test = 123;
test++;
if (test === 123){
    exit();
}

`
    codeSnippets := []CodeSnippet{
        {Code: "fmt.Println(\"Hello, Twitch!\")", TwitchId: "DrDreo"},
        {Code: "let me go", TwitchId: "DrDreo"},
        {Code: test, TwitchId: "DrDreo"},
    }

    // Iterate through code snippets and send them at 2-second intervals.
    for _, snippet := range codeSnippets {
        // Serialize the CodeSnippet struct to JSON.
        snippetJSON, err := json.Marshal(snippet)
        if err != nil {
            log.Println("json marshal error:", err)
            continue
        }

        if err := ws.WriteMessage(websocket.TextMessage, snippetJSON); err != nil {
            log.Println("write error:", err)
            continue
        }

        time.Sleep(2 * time.Second)
    }

    // Keep the connection alive (e.g., read messages in a loop)
    for {
        if _, _, err := ws.ReadMessage(); err != nil {
            log.Println("read error:", err)
            break
        }
    }
}

func checkDir(dir string) {
    _, err := os.ReadDir(dir)
    if err != nil {
        log.Fatalf("Error reading directory: %s", err)
    }
    //    log.Printf("Files in directory %s:\n", dir)
    //    for _, file := range files {
    //        log.Println(file.Name())
    //    }
}

func main() {
    flag.Parse()
    log.SetFlags(0)

    // JUST FOR DEVING PURPOSE
    checkDir("./src/assets")
    fs := http.FileServer(http.Dir("./src/assets"))
    //     http.Handle("/", fs)
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s %s\n", r.RemoteAddr, r.Method, r.URL)
        fs.ServeHTTP(w, r)
    })

    http.HandleFunc("/ws", handleConnections)
    http.HandleFunc("POST /suggestion", handleSuggestion)
    http.HandleFunc("OPTIONS /suggestion", enableCors)

    log.Printf("TCS Mediator starting on %s", *addr)
    log.Fatal(http.ListenAndServe(*addr, nil))
}

func handleSuggestion(w http.ResponseWriter, req *http.Request) {
    log.Printf("handling suggestion %s\n", req.URL.Path)
    enableCors(w, req)

    if req.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var snippet CodeSnippet
    if err := json.NewDecoder(req.Body).Decode(&snippet); err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        return
    }

    manager.SendCodeSnippet(snippet)
}

func enableCors(w http.ResponseWriter, req *http.Request) {
    (w).Header().Set("Access-Control-Allow-Origin", "*")
    (w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    (w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
}
