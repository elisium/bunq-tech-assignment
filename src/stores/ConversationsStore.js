import { observable, action } from "mobx";
import UsersStore from "./UsersStore";

const { REACT_APP_API_URL } = process.env;

class ConversationsStore {
    @observable list = [];
    @observable currentThread = null;
    @observable currentThreadUsers = null;

    @action.bound async getConversations() {
        const request = await fetch(`${REACT_APP_API_URL}/conversation/user/${UsersStore.currentUser}`);
        const response = await request.json();
        // there are like a lot of conversations, let's at least filter empty ones
        this.list = response.filter(conv => !!conv.conversation.name);
    }

    @action.bound selectCurrentThread(conversation, users) {
        this.currentThread = conversation;
        this.currentThreadUsers = users;
    }
}

export default new ConversationsStore();