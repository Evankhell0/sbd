export default class Data {
    static players = {}
    static requests = []
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

    // only allow 2 simultaneous calls to SkyCrypt API
    static staggerRequest(request) {
        this.requests.push({
            request: request,
            active: false
        })
        this.processNextRequest()
    }

    static processNextRequest() {
        if(this.requests.some(x => !x.active) && this.requests.filter(x => x.active).length <= 1) {
            const index = this.requests.findIndex(x => !x.active)
            this.requests[index].active = true
            this.requests[index].request().then(() => {
                this.requests.splice(index, 1)
                this.processNextRequest()
            }).catch(e => console.log(JSON.stringify(e)))
        }
    }

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
