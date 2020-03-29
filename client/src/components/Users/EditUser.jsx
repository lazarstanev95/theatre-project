import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import notificationServices from '../../services/notification';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                lastName: '',
                email: '',
                isAdmin: false
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    getUser() {
        if (this.props.match.params.id) {
            axios.get('/user/users/' + this.props.match.params.id)
                .then(response => {
                    console.log('edit user reponse', response);
                    this.setState(state => {
                        state.user.name = response.data.user.name;
                        state.user.lastName = response.data.user.lastName;
                        state.user.email = response.data.user.email;
                        state.user.isAdmin = response.data.user.isAdmin;
                        return state;
                    })
                })
        }
    }

    handleChange(event) {
        this.handleFormChange.bind(this)(event, 'user');
    }

    handleFormChange(event, stateField) {
        const target = event.target;
        const field = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        const state = this.state[stateField];
        state[field] = value;

        this.setState({ [stateField]: state });
    }

    handleSave(event) {
        event.preventDefault();
        const data = this.state.user;
        if (this.props.match.params.id) {
            axios.patch('/user/users/' + this.props.match.params.id, data)
                .then(response => {
                    console.log('updated user...', response);
                    notificationServices.success(response.data.message)
                    this.props.history.push('/users');
                })
                .catch(err => {
                    notificationServices.error(err.response.data.message);
                    this.props.history.push('/editUser/' + this.props.match.params.id);
                });
        }
    }

    render() {
        const { classes } = this.props;
        const { user } = this.state;
        return (
            <div>
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <h1>Update User</h1>
                        <form className={classes.form} >
                            <TextField
                                name="name"
                                label="name"
                                placeholder="Name"
                                value={user.name}
                                onChange={this.handleChange}
                                margin="normal"
                                fullWidth
                            />
                            <br />
                            <TextField
                                name="lastName"
                                label="Last Name"
                                placeholder="Last Name"
                                value={user.lastName}
                                onChange={this.handleChange}
                                margin="normal"
                                fullWidth
                            />
                            <br />
                            <TextField
                                name="email"
                                label="email"
                                placeholder="Email"
                                value={user.email}
                                onChange={this.handleChange}
                                margin="normal"
                                fullWidth
                            />
                            <br />
                            <FormControlLabel
                                value={user.isAdmin}
                                control={<Checkbox color="primary"
                                            name="isAdmin" 
                                            checked={user.isAdmin} 
                                            onChange={this.handleChange} />
                                        }
                                label="Is Admin"
                                labelPlacement="start"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={this.handleSave}
                                className={classes.submit}
                            >
                                Update
                            </Button>
                        </form>
                    </div>
                </Container>
            </div>
        )
    }
}

export default withStyles(styles)(EditUser)