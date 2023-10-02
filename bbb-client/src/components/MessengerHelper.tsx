export interface IMessage {
  id: string;
  text: string;
  fromUid: string;
  toUid: string;
  timestamp: string;
}

export interface Chat {
  // Opponent user's Uid
  withUid: string;
  messages: IMessage[];
}

export async function fetchChats(uid: string): Promise<Chat[] | undefined> {
  // variable that stores the chats
  var fetchedChats: Chat[] = [];

  // try fetching chats
  try {
    const response = await fetch(`http://localhost:5000/get_chats?user=${uid}`);

    if (!response.ok) {
      throw new Error("Failed to fetch chat messages");
    }

    // data from the response
    const data = await response.json();

    for (const [withUid, chatData] of Object.entries(data.chats)) {
      const messages: IMessage[] = Object.values(chatData as any).map(
        (message: any) => ({
          id: message._id,
          text: message.text,
          fromUid: message.fromUid,
          toUid: message.toUid,
          timestamp: message.timestamp,
        })
      );
      fetchedChats.push({
        withUid,
        messages,
      });
    }
  } catch (error) {
    throw error;
  }
  return fetchedChats;
}

export async function sendMessage(messageData: IMessage) {
  try {
    const response = await fetch("http://localhost:5000/api/save_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }
  } catch (error) {
    console.error(error);
  }
}
