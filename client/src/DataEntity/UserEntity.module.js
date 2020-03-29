class User {
    constructor(data) {
        this.id = data._id;
        this.firstName = data.name;
        this.lastName = data.lastName;
        this.email = data.email;
        this.isAdmin = data.isAdmin;
    }
};

export default User;