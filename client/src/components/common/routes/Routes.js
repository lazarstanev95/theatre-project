import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home  from '../../Home';
import Login from '../../Users/Login';
import Register from '../../Users/Register';
import AddProduct from '../../products/AddProduct';
import Products from '../../products/Products';
import Users from '../../Users/Users';
import EditUser from '../../Users/EditUser';
import PrivateRoute from './PrivateRoute';
import NewPassword from '../../Users/NewPassword';

const Routes = () => (
    <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <PrivateRoute path='/products/add' component={AddProduct}/>
        <Route path='/products' component={Products}/>
        <PrivateRoute path='/edit/:id' component={AddProduct}/>
        <PrivateRoute path='/users' component={Users}/>
        <PrivateRoute path='/editUSer/:id' component={EditUser}/>
        <Route path='/new-password/:token' component={NewPassword}/>
    </Switch>
)

export default Routes