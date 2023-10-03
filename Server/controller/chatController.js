const chatSchema = require('../model/chatModel')

const storeMessages = async (req, res, next) => {
    try {
        const { message, senderId, chatRoomId, date, time } = req
        const messages = { message: message, date: date, time: time, senderId: senderId }
        console.log(messages, '///////////////////////', chatRoomId)
        const update = await chatSchema.updateOne({ _id: chatRoomId },
            {
                $push: {
                    messages: messages
                }
            })
        console.log(update, 'ppppppppppppp')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    storeMessages
}