import React, { useState, useEffect, useRef, ReactNode } from "react";
import "./App.css";
import "./components/Login";
import Login from "./components/Login";
const wsUrl: string = import.meta.env.VITE_WS_URL;

function App() {
  const [clientId, setClientId] = useState<ReactNode>(
    Math.floor(new Date().getTime() / 1000)
  );
  const [user, setUser] = useState<string | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket>();
  const [message, setMessage] = useState<object[]>([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const url = `${wsUrl}/ws/${user}/${clientId}`;
    const ws = new WebSocket(url);

    if (user) {
      ws.onopen = () => {
        // ws.send("Connect");
        ws.send(`${user} joined the chat`);
        console.log("WebScoket connection established");
      };

      // recieve message every start page
      ws.onmessage = (e) => {
        const message = JSON.parse(e.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setWebsocket(ws);
      // clean up function when we close page
      return () => {
        ws.close();
      };
    }
  }, [user, clientId]);

  const sendMessages = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(message);
      setMessage([]);
    } else {
      console.error("WebSocket is not open");
    }
  };

  return (
    <div className="container">
      <h1>Chat</h1>

      {!user ? (
        <Login setUser={setUser}></Login>
      ) : (
        <>
          <h2>Your username: {user}</h2>
          <div className="chat-container">
            <div className="chat">
              {messages.map((value, index) => {
                if (value.clientId === clientId) {
                  return (
                    <div key={index} className="my-message-container">
                      <div className="my-message">
                        <p className="client">{user}</p>
                        <p className="message">{value.message}</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="another-message-container">
                      <div className="another-message">
                        <p className="client">{value.username}</p>
                        <p className="message">{value.message}</p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            <div className="input-chat-container">
              <input
                className="input-chat"
                type="text"
                placeholder="Chat message ..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              ></input>
              <button className="submit-chat" onClick={sendMessages}>
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
