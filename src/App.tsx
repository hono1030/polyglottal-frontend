import React, { useState, useEffect, useRef, ReactNode } from "react";
import "./App.css";
import "./components/Login";
import Login from "./components/Login";
import DeleteMessages from "./components/DeleteMessages";
import axios from "axios";
const apiUrl: string = import.meta.env.VITE_API_URL;
const wsUrl: string = import.meta.env.VITE_WS_URL;

type MessageType = {
  time: string;
  clientId: number;
  username: string;
  message: string;
};

function App() {
  const [clientId, setClientId] = useState<number>(
    Math.floor(new Date().getTime() / 1000)
  );
  const [user, setUser] = useState<string | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket>();
  const [message, setMessage] = useState<MessageType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    const url = `${wsUrl}/ws/${user}/${clientId}`;
    const ws = new WebSocket(url);

    getAllMessages();
    ws.onopen = () => {
      setWebsocket(ws);
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

    // clean up function when we close page
    return () => {
      ws.close();
    };
  }, [user]);

  const sendMessages = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(message);
      setMessage([]);
    } else {
      console.error("WebSocket is not open");
      setTimeout(sendMessages, 100); // Retry after a short delay
    }
  };

  const getAllMessages = async () => {
    if (user) {
      try {
        const response = await axios.get(`${apiUrl}/database`);
        const messages = response.data;
        setMessages(messages);
        console.log(messages);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      getAllMessages();
    }
  }, [user]);

  return (
    <div className="container">
      <h1>CC36 Secret Chat Room</h1>

      {!user ? (
        <Login setUser={setUser}></Login>
      ) : (
        <>
          <h2>Your username: {user}</h2>
          <DeleteMessages
            setMessage={setMessage}
            setMessages={setMessages}
          ></DeleteMessages>
          <div className="chat-container">
            <div className="chat" ref={chatContainerRef}>
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
