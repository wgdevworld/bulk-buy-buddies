export interface IMessage {
  id: string;
  text: string;
  fromUid: string;
  toUid: string;
  timestamp: string;
  liked: boolean;
  isBuddyRequest: boolean;
}

export interface Chat {
  // Opponent user's Uid
  withUser: UserInfo;
  messages: IMessage[];
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface UserInfo {
  address: Address;
  dateJoined: string;
  email: string;
  firstname: string;
  idToken: string;
  lastname: string;
  refreshToken: string;
  uid: string;
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
          liked: message.liked,
          isBuddyRequest: message.isBuddyRequest,
        })
      );
      let withUser = await getUserAcctInfo(withUid);
      fetchedChats.push({
        withUser: withUser!,
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
    const response = await fetch("http://localhost:5000/save_message", {
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

export async function getUserAcctInfo(uid: string) {
  try {
    const response = await fetch("http://localhost:5000/get_user_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: uid }),
    });
    const user_acct = await response.json();
    let user_acct_info: UserInfo = {
      address: { address: "", city: "", state: "", zipcode: "" },
      dateJoined: "",
      email: "",
      firstname: "",
      idToken: "",
      lastname: "",
      uid: "",
      refreshToken: "",
    };
    Object.assign(user_acct_info, user_acct);

    if (user_acct == null) {
    } else {
      return user_acct_info;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteMessage(messageId: string): Promise<any> {
  const response = await fetch("http://localhost:5000/delete_message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message_id: messageId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function likeUnlikeMessage(
  messageId: string,
  action: "like" | "unlike"
): Promise<any> {
  const response = await fetch("http://localhost:5000/like_unlike_message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message_id: messageId, action: action }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
