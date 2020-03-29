import React from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRouteHandler = ({ component, auth, ...rest }) => {

    let ComponentToRender = component;

    return (
        <Route
            {...rest}
            render={props =>
                auth.isAuthenticated ? (
                    <ComponentToRender {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
}

const mapStateToProps  = (state) => ({ auth: state.auth });
export default withRouter(connect(mapStateToProps)(PrivateRouteHandler));