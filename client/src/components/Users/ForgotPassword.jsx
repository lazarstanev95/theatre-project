import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import notificationServices from '../../services/notification';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    handleChange(event) {
        this.setState({email: event.target.value});
    }

    sendEmail() {
        const { email} = this.state;
        const data = {
            email
        };
        axios.post('user/users/forgotPassword', data)
            .then(response => {
                console.log('forgotPassword ->', response);
                notificationServices.success(response.data.message)
            })
            .catch(err => {
                console.log(err);
                notificationServices.error(err.response.data.message)
            });
        this.props.handleClose();
    }

    render() {
        const { email } = this.state;
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Forgot password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter your email address here. We will send updates.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            name="email"
                            label="Email Address"
                            placeholder="Email"
                            type="email"
                            margin="dense"
                            fullWidth
                            value={email}
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.sendEmail} color="primary">
                            Send email
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default ForgotPassword