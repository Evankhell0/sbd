export default class Data {
    static players = {}
    static invalidKey = false

    static reset() {
        this.players = {}
        this.invalidKey = false
    }
}
