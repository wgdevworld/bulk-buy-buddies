"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { HeartIcon } from "@heroicons/react/24/solid"; // for filled heart
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline"; // for outlined heart
import { v4 as uuidv4 } from "uuid";
import "./Messenger.css";
import {
  Chat,
  IMessage,
  fetchChats,
  sendMessage,
  getUserAcctInfo,
  UserInfo,
  deleteMessage,
  likeUnlikeMessage,
} from "./MessengerHelper";
import io from "socket.io-client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const Messenger = () => {
  const [newUid, setNewUid] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageBuffer, setBuffer] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [newChatUid, setNewChatUid] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);
  const [userdata, setUserdata] = useState<UserInfo>();

  // Data from previous screen
  const searchParams = useSearchParams();
  const [uid, setUid] = useState(searchParams.get("currentUserID")!);
  const [selectedChat, setSelectedChat] = useState<string>(
    searchParams.get("buddyUserID")!
  );

  useEffect(() => {
    // Only initialize the socket if the uid is set
    if (uid) {
      // Get the user data
      (async () => {
        let userInfo = await getUserAcctInfo(uid);
        setUserdata(userInfo);
      })();

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
      liked: false,
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

  const handleNewChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newChatUid.trim() === "") return;

    // Check if chat with this UID already exists
    const chatExists = chats.some((chat) => chat.withUser.uid === newChatUid);
    if (!chatExists) {
      // If not, create a new chat object and add it to the state
      let opponent = await getUserAcctInfo(newChatUid);
      const newChat: Chat = {
        withUser: opponent!,
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

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await deleteMessage(messageId);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );

      console.log(response);
      // Optionally, refresh the messages or update the state to reflect the deletion
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeUnlike = async (
    messageId: string,
    action: "like" | "unlike"
  ) => {
    try {
      const response = await likeUnlikeMessage(messageId, action);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, liked: action === "like" } : msg
        )
      );
      // Optionally, refresh the messages or update the state to reflect the change
    } catch (error) {
      console.error(error);
    }
  };

  const selectedChatMessages =
    chats.find((chat) => chat.withUser.uid === selectedChat)?.messages || [];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 p-5 bg-white border-r">
        {userdata == null ? (
          <h1 className="text-xl font-semibold text-gray-600">Loading</h1>
        ) : (
          <h1 className="text-xl font-semibold text-gray-700">
            Hello, {userdata.firstname}
          </h1>
        )}

        <form onSubmit={handleUidSubmit} className="my-4">
          <input
            type="text"
            value={newUid}
            onChange={handleUidChange}
            placeholder="Enter your user ID"
            className="w-full p-2 mb-2 border rounded shadow-sm"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Set UID
          </button>
        </form>

        <form onSubmit={handleNewChatSubmit} className="mb-4">
          <input
            type="text"
            value={newChatUid}
            onChange={handleNewChatUidChange}
            className="w-full p-2 mb-2 border rounded shadow-sm"
            placeholder="Enter new user's UID"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            +
          </button>
        </form>

        <h2 className="text-lg font-semibold text-gray-700">Chats</h2>
        <ul className="mt-3">
          {chats.map((chat) => (
            <li
              key={chat.withUser.uid}
              className={`p-2 my-1 rounded cursor-pointer ${
                selectedChat === chat.withUser.uid
                  ? "bg-blue-200"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleChatSelect(chat.withUser.uid)}
            >
              {chat.withUser.firstname}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 flex flex-col">
        <div className="p-5 overflow-y-auto flex-grow">
          {selectedChatMessages.map((message) => (
            <div
              key={message.id}
              className={`my-2 p-3 rounded shadow max-w-xs ${
                message.fromUid === uid
                  ? "bg-blue-100 ml-auto"
                  : "bg-white mr-auto"
              }`}
            >
              <p className="text-gray-800">{message.text}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {message.timestamp}
                  <button
                    className="text-xs text-red-500 ml-2"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    Delete
                  </button>
                </span>
                <button
                  onClick={() =>
                    handleLikeUnlike(
                      message.id,
                      message.liked ? "unlike" : "like"
                    )
                  }
                  className="text-red-500 hover:text-red-600"
                >
                  {message.liked ? (
                    <HeartIcon className="h-6 w-6" />
                  ) : (
                    <OutlineHeartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={sendCurrentBuffer}
          className="flex p-5 bg-white border-t"
        >
          <input
            type="text"
            value={messageBuffer}
            onChange={onInputChange}
            placeholder="Type your message here"
            className="flex-grow p-3 mr-2 border rounded-l shadow-sm"
          />
          <button
            type="submit"
            className="px-4 text-white bg-blue-500 rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messenger;
