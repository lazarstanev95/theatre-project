import React, { Component } from 'react';
import Product from './Product';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import notificationServices from '../../services/notification';
import Loader from '../common/Loader/Loader';

const styles = theme => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    }
})

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts() {
        axios.get('/products')
            .then(response => {
                console.log('reponse -> ', response);
                this.setState({ 
                    products: response.data.products,
                    isLoaded: true
                })
            })
            .catch(function (error) {
                console.log(error);
                notificationServices.error(error.response.data.error.message)
            })
    }

    handleDelete = productId => {
        axios.delete('/products/' + productId)
            .then(response => {
                notificationServices.error('Product is deleted!');
                this.setState({isLoaded: false})
                this.getProducts();
            })
            .catch(err => {
                notificationServices.error(err.response.data.message);
                this.props.history.push('/products');
            });
    }

    mapProducts() {
        let { isLoaded, products } = this.state;
        console.log('fsfsdfsd', products)
        if (!isLoaded) {
            return <Loader/>
        }
        if(products.length !== 0) {
            return products.map((product, i) => {
                return <Product products={product} key={i} onDelete={this.handleDelete}/>
            })
        }
        return <div>No Products!</div>
    }

    render() {
        const { classes } = this.props;
        return (
            <main>
                <div>
                    <Container className={classes.cardGrid} maxWidth="md">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {this.mapProducts()}
                        </Grid>
                    </Container>
                </div>
            </main>
        )
    }
}

export default (withStyles(styles)(Products))