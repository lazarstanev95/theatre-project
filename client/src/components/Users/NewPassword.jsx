import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import notificationServices from '../../services/notification';

class NewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            passwordToken: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendNewPassword = this.sendNewPassword.bind(this);
    }

    componentDidMount() {
        this.getNewPassword();
    }

    getNewPassword() {
        axios.get('/user/users/getNewPassword/' + this.props.match.params.token)
            .then(response => {
                console.log('getNewPassword', response);
                this.setState({userId: response.data.userId, passwordToken: response.data.passwordToken})
            })
            .catch(error => {
                console.log(error);
            });
    }

    sendNewPassword() {
        const {userId, passwordToken, password} = this.state;
        const data = {
            userId,
            passwordToken,
            password
        }
        axios.post('/user/users/postNewPassword', data)
            .then(response => {
                console.log('postNewPassword', response);
                notificationServices.success(response.data.message);
                this.props.history.push('/');
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleChange(event) {
        this.setState({password: event.target.value});
    }

    render() {
        const { password } = this.state;
        return (
            <div style={{ width: 440, margin: 'auto' }}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                    autoFocus
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handleChange}
                />
                <Button onClick={this.sendNewPassword} color="primary" variant="contained">
                    Update Password
                </Button>
            </div>
        )
    }
}

export default NewPassword