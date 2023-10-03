import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ChatPage from './pages/userPages/restaurantView/ChatPage'
import ChatRoom from './pages/restoPages/ChatRoom/ChatRoom'
import socketIO from 'socket.io-client';
import userAxios from '../axios/userAxios';
import { restoApi } from '../constants/server';
import restoAxios from '../axios/restoAxios';
import { ErrorBoundary } from 'react-error-boundary'
import FallbackComp from './FallbackComp';

// const socket = socketIO.connect('http://localhost:3000');

function ChatComponent({ user, restoId, userId }) {

    // const [chatRoomId, setChatRoomId] = useState(null)
    const { phone: clientPhone, image, name, objId: userObjId } = useSelector((state) => state.client);
    const { phone: restoPhone, logo, restoName, objId: restoObjId } = useSelector((state) => state.resto);
    const [allMessages, setAllMessages] = useState([])
    const lastMessageRef = useRef(null);
    const [typingStatus, setTypingStatus] = useState('');
    const [chatList, setChatList] = useState([])
    const [chatRoomId, setChatRoomId] = useState('')
    const [userChatRoomId, setUserChatRoomId] = useState(null)
    const [state, setState] = useState('')
    const [socket, setSocket] = useState('')

    useEffect(() => {
        const newSocket = socketIO.connect('http://localhost:3000');
        setSocket(newSocket)
        newSocket.on('error', (err) => {
            console.log(err)
        })
        // return () => {
        //     if (newSocket)
        //         newSocket.disconnect()
        // }

    }, [chatRoomId])

    useEffect(() => {
        if (user == 'user') {
            userAxios.get('/chatList', { params: { restoId: restoId, userId: userId } }).then((res) => {
                setChatList(res.data.chatList)
                setUserChatRoomId(res.data.chatRoomId)
            }).catch((err) => {
                console.log(err)
            })
        } else {
            restoAxios.get('/chatList', { params: { chatRoomId: chatRoomId } }).then((res) => {
                setChatList(res.data.chatList)

            }).catch((err) => {
                console.log(err)
            })
        }

    }, [chatRoomId, userChatRoomId])



    useEffect(() => {
        if (socket) {
            socket.emit("setup", userChatRoomId ? userChatRoomId : chatRoomId);

            socket.on('messageResponse', (data) => {
                // if (data?.chatRoomId === userChatRoomId) {
                setChatList((prevMsg) => [...prevMsg, data])
                // }
            });
        }

    }, [socket]);

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatList]);





    const handleMessage = (message) => {
        localStorage.setItem('userObjId', userObjId);

        const date = new Date().toLocaleDateString()
        const time = new Date().toLocaleTimeString()
        if (message.trim()) {
            socket.emit('message', {
                chatRoomId: user === 'user' ? userChatRoomId : chatRoomId,
                message: message,
                senderId: user === 'user' ? userObjId : restoObjId,
                date: date,
                time: time,
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
            });
        }
    }

    return (
        user === 'user' ? (
            <ErrorBoundary FallbackComponent={FallbackComp} onError={() => console.log('error boundary')}>
                <ChatPage socket={socket} handleMessage={handleMessage} restoId={restoId} chatList={chatList} />
            </ErrorBoundary>
        ) : (
            <>
                <ChatRoom socket={socket} handleMessage={handleMessage} chatListProp={chatList} chatRoomIdProp={setChatRoomId} />
            </>
        )


    )
}

export default ChatComponent