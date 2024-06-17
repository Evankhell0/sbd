export default class Data {
    static players = {}
    static requests = []

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
            }).catch(e => console.log(e))
        }
    }
}
