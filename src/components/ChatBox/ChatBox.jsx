import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const ChatBox = () => {
  const { userData, setMessages, messages, messageId, chatUser } =
    useContext(AppContext);
  const [input, setInput] = useState("");

  //sending messages and storing  in db firestore db


  // timing 4.20.00 
  const sendMessages = async () => {
    try {
      if(input && messageId){
        await updateDoc(doc(db,'messages',messageId),{
          messages:arrayUnion({
            sId:userData.id,
            text :input,
            createdAt : new Date()
          })
        })
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse());
      });

      return () => {
        unSub();
      };
    }
  }, [messageId]);

  return chatUser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          <img className="dot" src={assets.green_dot} alt="" />
        </p>
        <img src={assets.help_icon} alt="" />
      </div>
      <div className="chat-msg">
        {/*sender message  */}
        <div className="s-msg">
          <p className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2.30pm</p>
          </div>
        </div>
        <div className="s-msg">
          <img className="msg-img" src={assets.pic1} alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2.30pm</p>
          </div>
        </div>

        {/* reciever message */}
        <div className="r-msg">
          <p className="msg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>2.30pm</p>
          </div>
        </div>
      </div>
      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Send a message"
        />
        <input
          type="file"
          name=""
          accept="image/png image/jpeg"
          id="image"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime anywhere</p>
    </div>
  );
};

export default ChatBox;
