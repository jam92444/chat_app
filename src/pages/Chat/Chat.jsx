import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import LeftSideBar from "../../components/LeftSidebar/LeftSideBar";
import ChatBox from "../../components/ChatBox/ChatBox";
import RightSidebar from "../../components/RIghtSidebar/RightSidebar";
import { AppContext } from "../../context/AppContext";

const Chat = () => {
  const { chatData, userData, } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(chatData && userData){
      setLoading(false)
    }

  },[chatData,userData])
  return (
    <div className="chat">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="chat-container">
          <LeftSideBar />
          <ChatBox />
          <RightSidebar />
        </div>
      )}  
    </div>
  );
};

export default Chat;
