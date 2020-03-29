import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
const _ = require('lodash');
const EventEmmiter = require('events');

let event = new EventEmmiter();

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
            initialItems: [
                {label: 'home'},
                {label: 'test'}
            ],
            items: []
        }
        this.openPopover = this.openPopover.bind(this);
        this.closePopover = this.closePopover.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        let items = this.state.initialItems;
        this.setState({items: items})
        /* event.on('message', (text, value) => {
            this.test(text, value)
        }); */
        event.on('message', this.test);
    }

    componentWillUnmount() {
        event.off('message', this.test);
    }

    test(text, value){
        console.log(text, value)
    }

    Capitalize(str){
        if(str === undefined){
            return;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    handleChange(event) {
        let items = this.state.initialItems;
        items = items.filter((item) => {
            return item.label.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });
        this.setState({items: items})
        //this.setState({value: event.target.value})
    }

    openPopover(e) {
        this.setState({open: true, anchorEl: e.currentTarget});
        event.emit('message', 'hello', 'hello-12')
    }

    closePopover() {
        this.setState({open: false});
    }

    renderMenuItems(item) {
        return (
            <MenuItem key={item.label}>{item.label}</MenuItem>
        )
    }

    render() {
        const { user } = this.props.auth;
        const regularUser = (
            <div>
                <h1>Welcome {this.Capitalize(user.name)} </h1>
                <Link to='/products' className='navbarLink'>Products</Link>
            </div>
        );
        const adminUser = (
            <div>
                <h1>Welcome {this.Capitalize(user.name) + ', ' + user.id} </h1>
                <Link to='/products' className='navbarLink'>Products</Link>
                <Link to='/products/add' className='navbarLink'>Add product</Link>
                <Link to='/users' className='navbarLink'>Users</Link>
            </div>
        )
        return (
            <div>
                {user.isAdmin ? adminUser : regularUser}
                <Button 
                    style={{marginLeft: 60, marginTop: 90}} 
                    variant="contained" 
                    color="primary" 
                    onClick={this.openPopover} >
                    Open Popover
                </Button>
                <Popover
                    open={this.state.open}
                    onClose={this.closePopover}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}>
                    <TextField
                        name="search"
                        label="Search Address"
                        placeholder="Search"
                        type="text"
                        margin="dense"
                        fullWidth
                        value={this.state.value}
                        onChange={this.handleChange}/>
                    <div style={{marginTop: 10}}>
                        {_.map(this.state.items, this.renderMenuItems)}
                    </div>
                </Popover>
            </div>
        )
    }
}

Home.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Home)