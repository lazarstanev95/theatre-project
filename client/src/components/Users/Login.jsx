import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authentication';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ForgotPassword from '../Users/ForgotPassword';

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
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    }
});



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                email: '',
                password: ''
            },
            errorEmail: '',
            errorPassword: '',
            open: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.goToRegister = this.goToRegister.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleChange(event) {
        /* const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        }); */
        this.handleFormChange.bind(this)(event, 'user');
    }

    handleFormChange(event, stateField) {
        const target = event.target;
        const field = target.name;
        const value = target.value;

        const state = this.state[stateField];
        state[field] = value;

        this.setState({ [stateField]: state });
    }

    handleSave(event) {
        event.preventDefault();
        const data = this.state.user;
        if (!this.validateForm()) {
            return;
        }
        this.props.loginUser(data, this.props.history);
    }

    validateForm() {
        const user = this.state.user;
        let { errorEmail, errorPassword } = this.state;
        let formIsValid = true;
        if (user.email === '') {
            errorEmail = "email is empty!";
            formIsValid = false;
        }
        if (user.password === '') {
            errorPassword = "password is empty!";
            formIsValid = false;
        }
        this.setState({ errorEmail, errorPassword });
        return formIsValid;
    }

    goToRegister() {
        this.props.history.push('/register')
    }

    handleClickOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    render() {
        console.log(this.props);
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">

                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <h1>Sign in</h1>
                    <form className={classes.form} >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            required
                            autoFocus
                            name="email"
                            label="Email"
                            placeholder="Email"
                            value={this.state.user.email}
                            onChange={this.handleChange}
                            error={Boolean(this.state.errorEmail)}
                            helperText={this.state.errorEmail}
                        />
                        <br />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="password"
                            fullWidth
                            value={this.state.user.passowrd}
                            onChange={this.handleChange}
                            autoComplete="current-password"
                            error={Boolean(this.state.errorPassword)}
                            helperText={this.state.errorPassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleSave}
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link onClick={this.handleClickOpen} variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link onClick={this.goToRegister} style={{ cursor: 'pointer' }} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <ForgotPassword
                        open={this.state.open}
                        handleClose={this.handleClose}
                    />
                </div>
            </Container>
        )
    }
}

Login.propTypes = {
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    errors: state.errors
})

export default connect(mapStateToProps, { loginUser })(withStyles(styles)(Login))