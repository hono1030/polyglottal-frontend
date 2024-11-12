import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Chat</h1>
      <h2>Your client id: </h2>
      <div className="chat-container">
        <div className="chat">
          <div className="my-message-container">
            <div className="my-message">
              <p className="client">client id : </p>
              <p className="message">Hallo</p>
            </div>
          </div>
          {/* <div key={index} className="another-message-container"> */}
          <div className="another-message-container">
            <div className="another-message">
              <p className="client">client id : </p>
              <p className="message">Hay</p>
            </div>
          </div>
        </div>
        <div className="input-chat-container">
          <input
            className="input-chat"
            type="text"
            placeholder="Chat message ..."
          ></input>
          <button className="submit-chat">Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
