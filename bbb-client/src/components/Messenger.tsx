import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Messenger.css";
import { Chat, IMessage, fetchChats, sendMessage } from "./MessengerHelper";

// const socket = io("http://localhost:5000");

const Messenger = () => {
  const uid = "000";

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageBuffer, setBuffer] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [newChatUid, setNewChatUid] = useState<string>("");

  useEffect(() => {
    // Get all the chats
    (async () => {
      let fetchedChats = await fetchChats(uid);
      setChats(fetchedChats!);
    })();

    // Websockets init
    // socket.on("new_message", (messageData: IMessage) => {
    //   setMessages((prevMessages) => [...prevMessages, messageData]);
    // });

    // return () => {
    //   // Websockets disconnect
    //   socket.disconnect();
    // };
  }, [uid]);

  useEffect(() => {}, []);

  // Send the currently typed message
  const sendCurrentBuffer = async (e: FormEvent) => {
    e.preventDefault();

    const message = messageBuffer.trim();
    if (message === "") return;

    const messageData: IMessage = {
      id: uuidv4(),
      text: message,
      fromUid: uid,
      toUid: selectedChat,
      timestamp: new Date().toISOString(),
    };
    await sendMessage(messageData);
    setMessages([...messages, messageData]);
    setBuffer("");

    // Send message thru socket
    // socket.emit("new_message", messageData);
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

  const handleNewChatUidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewChatUid(e.target.value);
  };

  const selectedChatMessages =
    chats.find((chat) => chat.withUid === selectedChat)?.messages || [];

  return (
    <div className="messenger">
      <div className="sidebar">
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
