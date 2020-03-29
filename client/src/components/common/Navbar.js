import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authentication';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
});

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
        this.handleClose();
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    render() {

        const { isAuthenticated, user } = this.props.auth;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const { classes } = this.props;
        const authLinks = (
            <div>
                <MenuItem onClick={this.handleClose} component={Link} to='/'>Home</MenuItem>
                <MenuItem onClick={this.handleClose}>{user.name}</MenuItem>
                <MenuItem onClick={this.onLogout.bind(this)} component={Link} to='/'>Logout</MenuItem>
            </div>
        )

        const guestLinks = (
            <div>
                <MenuItem onClick={this.handleClose} component={Link} to='/'>Home</MenuItem>
                <MenuItem onClick={this.handleClose} component={Link} to='/login'>Login</MenuItem>
                <MenuItem onClick={this.handleClose} component={Link} to='/register'>Register</MenuItem>
            </div>
        )
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Theatre Project
                        </Typography>
                        <div>
                            <IconButton
                                aria-label="Account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                            >
                                <div>
                                    {isAuthenticated ? authLinks : guestLinks}
                                </div>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(withStyles(styles)(withRouter(Navbar)));