export default class Data {
    static players = {}
    static chatMessages = {
        queue: [],
        lastMessage: 0,
        timeout: 400
    }
    static debug = {
        req: {
            fail: 0
        }
    }
    static selectedClass = null;

    // prevent multiple messages/commands being sent at once and being blocked for spam
    static staggerChatMessage(func) {
        this.chatMessages.queue.push(func)
        this.processNextChatMessage()
    }

    static processNextChatMessage() {
        if(!this.chatMessages.queue.length) {
            return
        }
        if(Date.now() - this.chatMessages.lastMessage >= this.chatMessages.timeout) {
            this.chatMessages.lastMessage = Date.now()
            const func = this.chatMessages.queue.shift()
			if(func) {
				func()
			}
        }
        setTimeout(() => this.processNextChatMessage(), this.chatMessages.timeout)
    }
}
