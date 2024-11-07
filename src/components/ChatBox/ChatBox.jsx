import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import upload from "../../lib/upload";
import { toast } from "react-toastify";

const ChatBox = () => {
  const {
    userData,
    setMessages,
    messages,
    messageId,
    chatUser,
    chatVisible,
    setChatVisible,
  } = useContext(AppContext);
  const [input, setInput] = useState("");

  //sending messages and storing  in db firestore db

  const sendMessages = async () => {
    try {
      if (input && messageId) {
        // Update the message in the messages collection
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        // Use for...of to await async operations
        for (const id of userIDs) {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatsIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId
            );

            if (chatsIndex !== -1) {
              // Update the last message, timestamp, and message seen status
              userChatData.chatsData[chatsIndex].lastMessage = input.slice(
                0,
                30
              ); // Limit message length to 30
              userChatData.chatsData[chatsIndex].updatedAt = Date.now();
              if (userChatData.chatsData[chatsIndex].rId === userData.id) {
                userChatData.chatsData[chatsIndex].messageSeen = false;
              }

              // Update the user chat data in Firestore
              await updateDoc(userChatsRef, {
                chatsData: userChatData.chatsData,
              });
            }
          }
        }
      }
      setInput("");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);
      if (fileUrl && messageId) {
        await updateDoc(doc(db, "messages", messageId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];

        // Use for...of to await async operations
        for (const id of userIDs) {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatsIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messageId
            );

            if (chatsIndex !== -1) {
              // Update the last message, timestamp, and message seen status
              userChatData.chatsData[chatsIndex].lastMessage = "Image"; // Limit message length to 30
              userChatData.chatsData[chatsIndex].updatedAt = Date.now();
              if (userChatData.chatsData[chatsIndex].rId === userData.id) {
                userChatData.chatsData[chatsIndex].messageSeen = false;
              }

              // Update the user chat data in Firestore
              await updateDoc(userChatsRef, {
                chatsData: userChatData.chatsData,
              });
            }
          }
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + " PM";
    } else {
      return hour + ":" + minute + " AM";
    }
  };

  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
        setMessages(res.data().messages.reverse());
      });

      return () => {
        unSub();
      };
    }
  }, [messageId]);

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
        </p>
        <img src={assets.help_icon} className="help" alt="" />
        <img onClick={()=>setChatVisible(false)} src={assets.arrow_icon} className="arrow" alt="" />
      </div>
      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg["image"] ? (
              <img className="msg-img" src={msg.image} alt="" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}

            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Send a message"
          value={input}
        />
        <input
          onChange={sendImage}
          type="file"
          name=""
          accept="image/png image/jpeg"
          id="image"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessages} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? " " : "hidden "}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime anywhere</p>
    </div>
  );
};

export default ChatBox;
