import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class User extends Component {

    onEdit() {
        this.props.history.push('/editUser/' + this.props.users.id)
    }

    render() {
        const disabledUser = this.props.users.id === this.props.auth.user.id;
        return (
            <div style={{display: 'flex', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.26)', height: 40, alignItems: 'center', maxWidth: 1000, margin: 'auto', marginTop: 20}}>
                <div style={{marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 400}}>{this.props.users.firstName}</div>
                <div style={{marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 400}}>{this.props.users.lastName}</div>
                <div style={{marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 400}}>{this.props.users.email}</div>
                <div style={{marginLeft: 20, width: 200, textAlign: 'center', fontSize: 20, fontWeight: 400}}>{this.props.users.isAdmin ? 'yes' : 'no'}</div>
                <Tooltip arrow disableHoverListener={!disabledUser} title="Cannot edit the current user">
                    <span>
                        <Button variant="contained" size="small" disabled={disabledUser} color="secondary" onClick={this.onEdit.bind(this)}>
                            Edit
                        </Button>
                    </span>
                </Tooltip>
            </div>
        )
    }
}
User.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps)(withRouter(User));