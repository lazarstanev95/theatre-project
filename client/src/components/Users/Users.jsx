import React, { Component } from 'react';
import User from './User';
import axios from 'axios';
import notificationServices from '../../services/notification';
import Loader from '../common/Loader/Loader';
import TextField from '@material-ui/core/TextField';
import UserEntity from '../../DataEntity/UserEntity.module';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searchString: '',
            isLoaded: false
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    handleChange(event) {
        this.setState({ searchString: event.target.value });
    }

    getUsers() {
        const { searchString } = this.state
        const data = {
            searchString
        };
        axios.post('/user/users', data)
            .then(response => {
                console.log('users -> ', response);
                setTimeout(() => {
                    this.setState({
                        isLoaded: true
                    })
                }, 1000);
                const userEntity = response.data.users.map(user => {
                    const entity = new UserEntity(user);
                    return entity;
                });
                this.setState({
                    users: userEntity,
                    isLoaded: false
                })
            })
            .catch(function (error) {
                console.log(error);
                notificationServices.error(error.response.data.error.message);
            });
    }

    mapUsers() {
        let { isLoaded, users } = this.state;
        if (!isLoaded) {
            return <Loader />
        }
        if (users.length !== 0) {
            return users.map((user, i) => {
                return <User users={user} key={i} />
            })
        }
        return <div style={{ textAlign: 'center', marginTop: 20, fontSize: 20 }}>No Users found!</div>
    }

    render() {
        return (
            <div>
                <div style={{ textAlign: 'center' }}>
                    <TextField
                        name="searchString"
                        label="Search for user"
                        placeholder="Search for user"
                        value={this.state.searchString}
                        onChange={this.handleChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                console.log('Enter key pressed');
                                // write your functionality here
                                this.getUsers();
                            }
                        }}
                        margin="normal"
                    />
                </div>
                <h1 style={{ textAlign: 'center' }}>Users information</h1>
                <div style={{ display: 'flex', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.26)', height: 40, alignItems: 'center', maxWidth: 1000, margin: 'auto', marginTop: 20 }}>
                    <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>First Name</div>
                    <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>Last Name</div>
                    <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>Email</div>
                    <div style={{ marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 500 }}>Is Admin</div>
                </div>
                {this.mapUsers()}
            </div>
        )
    }
}

export default Users;