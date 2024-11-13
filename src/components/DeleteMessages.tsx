import React, { useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import "../App.css";
const apiUrl: string = import.meta.env.VITE_API_URL;

type Props = {
  setMessage: (message: []) => void;
  setMessages: (message: []) => void;
};

const DeleteMessages: React.FC<Props> = ({ setMessage, setMessages }) => {
  const [delTask, setDelTask] = useState<boolean>(false);

  const handleDeleteMessages = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/database`);

      if (response.status == 200) {
        setMessage([]);
        setMessages([]);
        setDelTask(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConfirmationBox = () => {
    setDelTask(!delTask);
    // if (!delTask) {
    //     document.querySelector(".confirm-bg").style.display = "flex";
    //     document.querySelector(".confirmation-container").style.display = "flex";

    //   setDelTask(true);
    // } else {
    //     document.querySelector(".confirm-bg").style.display = "none";
    //     document.querySelector(".confirmation-container").style.display = "none";

    //   setDelTask(false);
    // }
  };

  return (
    <div>
      <button className="delete-button" onClick={handleConfirmationBox}>
        Delete all the messages
      </button>

      {delTask && (
        <>
          <div className="confirm-bg" onClick={handleConfirmationBox}>
            <div className="confirmation-container">
              <div className="confirmation-text">
                Do you really want to delete all the messages?
              </div>
              <div className="button-container">
                <button
                  className="cancel-button"
                  onClick={handleConfirmationBox}
                >
                  Cancel
                </button>
                <button
                  className="confirmation-button"
                  onClick={handleDeleteMessages}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteMessages;
