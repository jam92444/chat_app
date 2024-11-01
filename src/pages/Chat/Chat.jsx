import React from 'react'
import './Chat.css'
import LeftSideBar from '../../components/LeftSidebar/LeftSideBar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSidebar from '../../components/RIghtSidebar/RightSidebar'

const Chat = () => {
  return (
    <div className='chat'>
      <div className="chat-container">
        <LeftSideBar/>
        <ChatBox/>
        <RightSidebar />
      </div>
    </div>
  )
}

export default Chat