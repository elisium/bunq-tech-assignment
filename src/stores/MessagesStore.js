import { observable, action } from "mobx";
import UsersStore from "./UsersStore";
import ConversationsStore from "./ConversationsStore";
import moment from "moment";

const { REACT_APP_API_URL } = process.env;

class MessagesStore {
    @observable list = [];
    // pagination cursor
    @observable cursor = 0;

    @action.bound async getMessages() {
        this.cursor = 0;
        this.list = [];
        // fetch first 20 messages in a thread
        const request = await fetch(
            `${REACT_APP_API_URL}/conversation/${ConversationsStore.currentThread.conversationId}/message/limited?limit=20&offset=${this.cursor}`
        );
        const response = await request.json();
        // old messages should go to top
        this.list = response.sort((msg1, msg2) => (msg1.timestamp > msg2.timestamp ? 1 : -1));
        this.cursor = 20;
    }

    @action.bound async loadMoreMessages() {
        this.cursor += 20;
        const request = await fetch(
            `${REACT_APP_API_URL}/conversation/${ConversationsStore.currentThread.conversationId}/message/limited?limit=20&offset=${this.cursor}`
        );
        const response = await request.json();
        this.list = [
            ...response.sort((msg1, msg2) => (msg1.timestamp > msg2.timestamp ? 1 : -1)),
            ...this.list
        ];
    }

    @action.bound async postMessage(message) {
        const request = await fetch(
            `${REACT_APP_API_URL}/conversation/${ConversationsStore.currentThread.conversationId}/message/send`,
            {
                method: 'POST',
                body: JSON.stringify({
                    message,
                    senderId: UsersStore.currentUser
                })
            }
        );
        const response = await request.json();
        this.cursor = this.cursor + 1;
        this.list.push({
            id: response.id,
            message,
            senderId: UsersStore.currentUser,
            timestamp: moment().format("YYYY-MM-DD hh:mm:ss")
        })
    }
}

export default new MessagesStore();