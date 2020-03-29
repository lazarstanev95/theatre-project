import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { registerUser } from '../../actions/authentication';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

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

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                email: '',
                password: ''
            },
            error: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
    }

    handleChange(event) {
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

    handleSave(e) {
        e.preventDefault();
        const data = this.state.user;
        this.props.registerUser(data, this.props.history);
    }

    goToLogin() {
        this.props.history.push('/login');
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <h1>Sign up</h1>
                        <form className={classes.form} >
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                name="name"
                                label="name"
                                placeholder="Name"
                                value={this.state.user.name}
                                onChange={this.handleChange}
                            />
                            <br />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                name="email"
                                label="Email"
                                placeholder="Email"
                                value={this.state.user.email}
                                onChange={this.handleChange}
                            />
                            <br />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                name="password"
                                label="Password"
                                placeholder="password"
                                value={this.state.user.passowrd}
                                onChange={this.handleChange}
                                type="password"
                                autoComplete="current-password"
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
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link onClick={this.goToLogin} style={{cursor: 'pointer'}} variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </div>
        )
    }
}
Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withStyles(styles)(withRouter(Register)))
//export default Register