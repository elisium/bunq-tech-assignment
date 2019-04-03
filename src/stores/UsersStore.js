import { observable, action } from "mobx";

const { REACT_APP_API_URL } = process.env;

class UserStore {
    @observable list = [];
    @observable currentUser = null;

    @action.bound async getUsers() {
        const request = await fetch(`${REACT_APP_API_URL}/users`);
        const response = await request.json();
        this.list = response;
    }

    @action.bound login(user) {
        // here can be login logic like
        /*
            const request = await fetch(`${REACT_APP_API_URL}/login`, {
                method: 'POST',
                body: JSON.stringify({ userid: user, password })
            });
        */
        this.currentUser = user;
    }

    getUserByID(uid) {
        return this.list.find(usr => usr.id === uid);
    }
}

export default new UserStore();