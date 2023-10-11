import React, { useState } from 'react'
import styled from 'styled-components'
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import EmojiPicker, {
  EmojiStyle
} from "emoji-picker-react";

const ChatInput = ({ handleSendMsg }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [msg, setMsg] = useState("")

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };



  const handleEmojiClick = (emojiData, event) => {
    setMsg(
      (msg) =>
        msg + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );

  }

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className='button-container'>
        <div className='emoji'>
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {
            showEmojiPicker && <EmojiPicker
              onEmojiClick={handleEmojiClick}
              autoFocusSearch={false}
              emojiStyle={EmojiStyle.NATIVE} />
          }
        </div>
      </div>
      <form className='input-container' onSubmit={(event) => sendChat(event)}>
        <input type='text' placeholder='type your message here' value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button className='submit'>
          <IoMdSend />
        </button>
      </form>
    </Container>
  )
}

export default ChatInput

const Container = styled.div`
display: grid;
grid-template-columns: 5% 95%;
align-items: center;
background-color: #080420;

padding: 0 2rem;
padding-bottom:0.3rem;
.button-container{
  display: flex;
  align-items: center;
  color: white;
  gap:1rem;
  .emoji{
    position: relative;
    svg{
      font-size: 1.5rem;
      color: #ffff00c8;
      cursor: pointer;
    }
    .EmojiPickerReact{
      position: absolute;
      top:-460px;
    }
  }
}
.input-container{
  width:100%;
  border-radius:2rem;
  display:flex;
  gap: 2rem;
  background-color: #ffffff24;
  input{
    width: 90%;
   
    background-color:transparent;
    color:white;
    border: none;
    outline: none;
    padding-left: 1rem;
    font-size:1.2rem;
    &::selection{
      background-color:#9186f3;
    }
    &:focus{
      outline: none;
    }
  }
  button{
    padding: 0.3rem 2rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #9a86f3;
    border: none;
    svg{
      font-size: 2rem;
      color: white;
    }
  }

}
`
