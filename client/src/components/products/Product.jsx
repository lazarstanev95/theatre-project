import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
})

class Product extends Component {    

    onEdit() {
        this.props.history.push('/edit/' + this.props.products._id)
    }
    
    render() {
        const { classes } = this.props;

        return (
            <Grid item /* key={card} */ xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cardMedia}
                        image={this.props.products.productImage}
                        title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.products.name}
                        </Typography>
                        <Typography>
                            {this.props.products.description}
                        </Typography>
                        <Typography>
                            {this.props.products.price}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary">
                            View
                        </Button>
                        <Button size="small" color="primary" onClick={this.onEdit.bind(this)}/* href={'/edit/' + this.props.products._id} */>
                            Edit
                        </Button>
                        <Button onClick={() => this.props.onDelete(this.props.products._id)} size="small" color="primary">
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        )
    }
}

export default (withStyles(styles)(withRouter(Product)))