import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Messenger.css";
import { Chat, IMessage, fetchChats, sendMessage } from "./MessengerHelper";
import io from "socket.io-client";

const Messenger = () => {
  const [uid, setUid] = useState("");
  const [newUid, setNewUid] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageBuffer, setBuffer] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [newChatUid, setNewChatUid] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Only initialize the socket if the uid is set
    if (uid) {
      // Get all the chats
      (async () => {
        let fetchedChats = await fetchChats(uid);
        setChats(fetchedChats!);
      })();

      // on socket connect, provide server with uid
      const newSocket = io("http://localhost:5000", {
        query: { uid },
      });

      // set the newly initialized socket
      setSocket(newSocket);

      // when server emits new messages, add them to the state
      newSocket.on("got_message", (messageData: IMessage) => {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      });

      return () => {
        // Disconnect the socket when the component unmounts or the uid changes
        newSocket.disconnect();
      };
    }
  }, [uid, messages]);

  // Send the currently typed message
  const sendCurrentBuffer = async (e: FormEvent) => {
    e.preventDefault();
    const message = messageBuffer.trim();
    if (message === "" || socket === null) return;

    const messageData: IMessage = {
      id: uuidv4(),
      text: message,
      fromUid: uid,
      toUid: selectedChat,
      timestamp: new Date().toISOString(),
    };
    socket.emit("new_message", messageData);
    setBuffer("");
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBuffer(e.target.value);
  };

  const handleChatSelect = (withUid: string) => {
    setSelectedChat(withUid);
  };

  const handleNewChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newChatUid.trim() === "") return;

    // Check if chat with this UID already exists
    const chatExists = chats.some((chat) => chat.withUid === newChatUid);
    if (!chatExists) {
      // If not, create a new chat object and add it to the state
      const newChat: Chat = {
        withUid: newChatUid,
        messages: [],
      };
      setChats([...chats, newChat]);
    }

    // Select the new chat
    setSelectedChat(newChatUid);
    setNewChatUid(""); // Reset the input field
  };

  //
  const handleNewChatUidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewChatUid(e.target.value);
  };

  const handleUidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUid(e.target.value);
  };

  const handleUidSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUid(newUid);
  };

  const selectedChatMessages =
    chats.find((chat) => chat.withUid === selectedChat)?.messages || [];

  return (
    <div className="messenger">
      <div className="sidebar">
        <form onSubmit={handleUidSubmit}>
          <input
            type="text"
            value={newUid}
            onChange={handleUidChange}
            placeholder="Enter your user ID"
          />
          <button type="submit">Set UID</button>
        </form>
        <form onSubmit={handleNewChatSubmit} className="new-chat-form">
          <input
            type="text"
            value={newChatUid}
            onChange={handleNewChatUidChange}
            className="new-chat-input"
            placeholder="Enter new user's UID"
          />
          <button type="submit" className="new-chat-button">
            +
          </button>
        </form>
        <h2>Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.withUid}
              className={selectedChat === chat.withUid ? "selected" : ""}
              onClick={() => handleChatSelect(chat.withUid)}
            >
              {chat.withUid}
            </li>
          ))}
        </ul>
      </div>
      <div className="main">
        {selectedChatMessages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.fromUid === uid ? "sent" : "received"
            }`}
          >
            <p>{message.text}</p>
            <span>{message.timestamp}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendCurrentBuffer}>
        <input
          type="text"
          value={messageBuffer}
          onChange={onInputChange}
          placeholder="Type your message here"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messenger;
