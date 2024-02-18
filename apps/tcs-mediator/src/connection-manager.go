package main

import (
    "encoding/json"
    "github.com/gorilla/websocket"
    "log"
    "sync"
)

type ConnectionManager struct {
    connections []*websocket.Conn
    lock        sync.Mutex
}

func NewConnectionManager() *ConnectionManager {
    return &ConnectionManager{
        connections: []*websocket.Conn{},
    }
}

func (m *ConnectionManager) AddConnection(conn *websocket.Conn) {
    m.lock.Lock()
    defer m.lock.Unlock()
    m.connections = append(m.connections, conn)
}

func (m *ConnectionManager) SendCodeSnippet(snippet CodeSnippet) {
    m.lock.Lock()
    defer m.lock.Unlock()
    snippetJSON, err := json.Marshal(snippet)
    if err != nil {
        log.Println("json marshal error:", err)
        return
    }

    for _, conn := range m.connections {
        if err := conn.WriteMessage(websocket.TextMessage, snippetJSON); err != nil {
            log.Println("write error:", err)
            // Optionally remove conn from m.connections if it's no longer valid
        }
    }
}
