import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import notificationServices from '../../services/notification';
import DefaultImg from './../../assets/default-img.jpg';
//import FileBase from 'react-file-base64';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {
                name: '',
                description: '',
                productImage: '',
                price: 0
            },
            multerImage: DefaultImg,
            baseImage: DefaultImg,
            isEdit: false,
            error: '',
            date: new Date()
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        console.log('match..', this.props.match.params.id)
        this.timerID = setInterval(() => this.tick(), 1000);
        if (this.props.match.params.id) {
            axios.get('/products/' + this.props.match.params.id)
                .then(response => {
                    console.log('edit response', response)
                    this.setState(state => {
                        state.product.name = response.data.product.name;
                        state.product.description = response.data.product.description;
                        state.product.price = response.data.product.price;
                        state.product.productImage = response.data.product.productImage;
                        state.isEdit = true;
                        return state;
                    });
                })
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    handleChange(event) {
        this.handleFormChange.bind(this)(event, 'product');
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
        const data = this.state.product;
        const { product, isEdit } = this.state;
        if (isEdit) {
            axios.patch('/products/' + this.props.match.params.id, data)
                .then(response => {
                    console.log('updated...', response)
                    notificationServices.success(response.data.message)
                    this.props.history.push('/');
                })
                .catch(err => {
                    notificationServices.error(err.response.data.message);
                    this.props.history.push('/edit/' + this.props.match.params.id);
                });
        } else {
            /* let formData = new FormData();
            formData.append('name', product.name);
            formData.append('description', product.description);
            formData.append('price', product.price);
            formData.append('productImage', productImage) */
            let userId = this.props.auth.user.id
            axios.post('/products', { ...product, userId })
                .then(response => {
                    console.log('reponse -> ', response);
                    notificationServices.success(response.data.message);
                    this.props.history.push('/');
                })
                .catch(err => {
                    console.log('err', err.response.data.message)
                    notificationServices.error(err.response.data.message);
                    this.props.history.push('/products/add');
                });
        }
    }

    setDefaultImage(uploadType) {
        if (uploadType === "multer") {
            this.setState({
                multerImage: DefaultImg
            });
        } else {
            this.setState({
                baseImage: DefaultImg
            });
        }
    }

    uploadImage(e, method) {
        e.preventDefault();
        if (method === "multer") {

            let file = e.target.files && e.target.files[0];
            if (!file) {
                return;
            }
            let imageFormObj = new FormData();

            imageFormObj.append("imageName", "multer-image-" + Date.now());
            imageFormObj.append("imageData", file);

            // stores a readable instance of 
            // the image being uploaded using multer
            this.setState({
                multerImage: URL.createObjectURL(file)
            });

            axios.post('/image/uploadmulter', imageFormObj)
                .then((data) => {
                    if (data.data.success) {
                        this.setState(state => {
                            state.product.productImage = data.data.document.imageData
                            return state;
                        });
                        notificationServices.success("Image has been successfully uploaded using multer");
                        console.log('multerImageeee', this.state.product.productImage);
                    }
                })
                .catch(err => {
                    notificationServices.error(err.response.data.message);
                    this.setDefaultImage("multer");
                });
        }
    }

    getBaseFile(files) {
        // create a local readable base64 instance of an image
        this.setState({
            baseImage: files.base64
        });

        let imageObj = {
            imageName: "base-image-" + Date.now(),
            imageData: files.base64
        };

        axios.post(`/image/uploadbase`, imageObj)
            .then((data) => {
                if (data.data.success) {
                    this.setState(state => {
                        state.product.productImage = data.data.document.imageData
                        return state;
                    });
                    notificationServices.success("Image has been successfully uploaded using base64 format");
                    //alert("Image has been successfully uploaded using base64 format");
                    //this.setDefaultImage("base");
                }
            })
            .catch((err) => {
                console.log(err);
                //alert("Error while uploading image using base64 format")
                this.setDefaultImage("base");
            });
    }

    render() {
        const { classes } = this.props;
        const { isEdit } = this.state;
        return (
            <div>
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <h1>{isEdit ? 'Update Product' : 'Create Product'}</h1>
                        <form className={classes.form} >
                            <TextField
                                name="name"
                                label="name"
                                placeholder="Name"
                                value={this.state.product.name}
                                onChange={this.handleChange}
                                margin="normal"
                                fullWidth
                            />
                            <br />
                            <TextField
                                name="description"
                                label="description"
                                placeholder="Description"
                                value={this.state.product.description}
                                onChange={this.handleChange}
                                margin="normal"
                                fullWidth
                            />
                            <br />
                            <TextField
                                name="price"
                                label="price"
                                placeholder="Price"
                                type="number"
                                value={this.state.product.price}
                                onChange={this.handleChange}
                                margin="normal"
                                fullWidth
                            />
                            <br />
                            <input type="file" name="productImage" onChange={(e) => this.uploadImage(e, 'multer')} />
                            <img src={isEdit ? "/" + this.state.product.productImage : this.state.multerImage} alt="uploaded" width="400" heigh="400" />
                            {/* <div className="process__upload-btn">
                                <FileBase type="file" multiple={true} onDone={this.getBaseFile.bind(this)} />
                            </div>
                            <img src={isEdit ? this.state.product.productImage : this.state.baseImage} alt="uploaded" className="process__image" width="400" heigh="400" /> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={this.handleSave}
                                className={classes.submit}
                            >
                                {isEdit ? 'Update' : 'Create'}
                            </Button>
                        </form>
                    </div>
                </Container>
                <p>test {moment(this.state.date).format('DD/MM/YY | hh:mm:ss')}</p>
                <p>{this.props.auth.user.id}</p>
            </div>
        )
    }
}
AddProduct.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
    auth: state.auth
})
export default connect(mapStateToProps)(withStyles(styles)(AddProduct))