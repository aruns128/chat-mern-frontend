import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Messages } from './Messages';
import { sendMessageRoute, receiveMessageRoute } from '../utils/APIRoutes';

export const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const getAllMessages = async () => {
    const response = await axios.post(receiveMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
    })
    setMessages(response.data)
  }


  useEffect(() => {
    getAllMessages()
  }, [currentChat])

  useEffect(() => {

    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        console.log("msg-receive", msg)
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      messages: msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      messages: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  }

  return (

    <Container>
      <div className='chat-header'>
        <div className='user-details'>
          <div className='avatar'>
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className='username'>
            <h3>{currentChat.username}</h3>
          </div>

        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "received"
                  }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  )
}

const Container = styled.div`
padding-top: 1rem;
display: grid;
grid-template-rows: 10% 78% 12%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-auto-rows: 15% 70% 15%;
    }
  .chat-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details{
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar{
        img{
          height: 3rem;
        }
      }
      .username{
        h3{
          color: black;
        }
      }
    }
   
  }
  .chat-messages{
      padding: 1rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: auto;
      .message{
        display: flex;
        align-items: center;
        .content{
          max-width: 40%;
          overflow-wrap: break-word;
          padding: 1rem;
          font-size: 1.1rem;
          border-radius: 1rem;
        }
      }
      .sended{
        justify-content: flex-end;
        .content{
          background-color: #ECE5DD;
        }
      }
      .received{
        justify-content: flex-start;
        .content{
          background-color: #ECE5DD;
        }
      }
    }
`
