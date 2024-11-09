import React, { useContext, useEffect, useState } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db,logout } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    messageId,
    setMessageId,
    messages,
    setMessages,
    chatUser,
    setChatUser,chatVisible,setChatVisible
  } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // handling the input for user search
  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        
        if (!querySnap.empty) {
          const userDoc = querySnap.docs[0].data();
          if (userDoc.id !== userData.id) {
            const userExist = chatData.some((user) => user.rId === userDoc.id);
            if (!userExist) {
              setUser(userDoc); // Successfully set the user data
            }
          } else {
            setUser(false); // Handle the case where the user is the same as the current user
          }
        } else {
          setUser(false); // No user found in the database
        }
      } else {
        setShowSearch(false); // Clear the search results
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  //adding chat to the users
  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      //user
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      // userData
      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const  uSnap = await getDoc(doc(db,"users",user.id));
      const uData = uSnap.data();
      setChat({
        messageId:newMessageRef.id,
        lastMessage:"",
        rId:user.id,
        updatedAt:Date.now(),
        messageSeen:true,
        userData:uData
      });
      setShowSearch(false);
      setChatVisible(true);

    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  //creating a chat for user ....
  const setChat = async (item) => {
    try {
       setMessageId(item.messageId);
    setChatUser(item);
    const userChatRef = doc(db,'chats',userData.id);
    const userChatsSnapShot = await getDoc(userChatRef);
    const userChatsData = userChatsSnapShot.data();
    const chatIndex = userChatsData.chatsData.findIndex((c)=>c.messageId == item.messageId)
    userChatsData.chatsData[chatIndex].messageSeen = true;
    await updateDoc(userChatRef,{
      chatsData:userChatsData.chatsData
    })
    setChatVisible(true)
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
   
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      if(chatUser){
        const userRef = doc(db,"users",chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser(prev=>({...prev,userData:userData}))
      }
      
    }
  
   updateChatUserData();
  }, [chatData])
  
  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img className="logo" src={assets.logo} alt="Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit profile</p>
              <hr />
              <p onClick={()=>logout()}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="Search" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
            
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt={user.name} />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData.map((item, index) => (
            <div onClick={() => setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messageId ? "" : "border"}  `}>
              <img src={item.userData.avatar} alt="Profile" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
