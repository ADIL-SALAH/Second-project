import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import userAxios from '../../../../axios/userAxios';



function ChatPage({ socket, handleMessage, restoId, chatList }) {
    const { phone, image, name, objId: userId } = useSelector((state) => state.client)
    const [message, setMessage] = useState('')
    const lastMessageRef = useRef(null);
    const [typingStatus, setTypingStatus] = useState('');
    // const [chatList, setChatList] = useState('')
    const [reload, setReload] = useState(true)


    useEffect(() => {

        userAxios.get('/chatRoomCreate', { params: { restoId: restoId, userId: userId } }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })

    }, [reload, socket])


    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatList]);

    // const handleTyping = () => { console.log('*********'), socket.emit('typing', `${name} is typing`) };

    // useEffect(() => {
    //     socket.on('typingResponse', (data) => { setTypingStatus(data) });
    // }, [socket]);
    return (
        <div className='w-full h-96'>

            <div className="flex flex-col items-center justify-center  min-h-full text-gray-800 p-10 ">

                <div className="flex flex-col flex-grow w-full max-w-xl bg-slate-100 shadow-2xl rounded-lg overflow-hidden">
                    <div className="flex flex-col flex-grow h-0 p-4 overflow-auto overflow-x-hidden">
                        {chatList && chatList?.map((msg, index) => (
                            msg.senderId != userId ? (
                                <div key={index}>
                                    {<div className='flex justify-center w-full'>
                                        <span className="text-xs text-gray-500 leading-none">{msg.date === new Date().toLocaleDateString() ? 'Today' : msg.date === new Date().toLocaleDateString() - 1 ? 'Yesterday' : msg.date}</span>
                                    </div>}
                                    < div className="flex w-full mt-2 space-x-3 max-w-xs" >

                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300"><img src={msg?.proPic} alt="" className='rounded-full flex-shrink-0 h-8 w-8' /></div>
                                        <div>
                                            <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                                <p className="text-sm texy-red-600">{msg.message}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 leading-none">{msg.time}</span>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div key={index}>
                                    <div className='text-center w-full'>
                                        <span className="text-xs text-gray-500 leading-none">{msg.date === new Date().toLocaleDateString() ? 'Today' : msg.date === new Date().toLocaleDateString() - 1 ? 'Yesterday' : msg.date}</span>
                                    </div>
                                    <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                                        <div>
                                            <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                                <p className="text-sm">{msg.message}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 leading-none">{msg.time}</span>
                                        </div>
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300"><img src={image} alt="" className='rounded-full flex-shrink-0 h-8 w-8' /></div>
                                    </div>
                                </div>
                            )
                        ))}
                        {/* <div className="message__status">
                            <small>{typingStatus}</small>
                        </div> */}
                        <div ref={lastMessageRef} />
                    </div>

                    <div className="bg-gray-300 p-4 flex">
                        {/* <form onSubmit={handleMessage}> */}
                        <input className="flex items-center h-10 w-full rounded px-3 text-sm" type="text" placeholder="Type your message…"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleMessage(message)
                                    setMessage('')
                                    // setReload(!reload)
                                } else {

                                    // handleTyping()
                                }
                            }} />
                        {/* <button type='button' className='ml-2 bg-green-500 px-4 py-2 text-sm rounded-md hover:bg-green-600 hover:text-white text-slate-900' onClick={handleMessage} >Send</button> */}
                        <div className="ml-4">
                            <button
                                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                                onClick={() => { handleMessage(message), setMessage('') }}
                            >
                                <span>Send</span>
                                <span className="ml-2">
                                    <svg
                                        className="w-4 h-4 transform rotate-45 -mt-px"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                        ></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                        {/* </form> */}
                    </div>

                </div>

            </div>
        </div >
    )
}

export default ChatPage