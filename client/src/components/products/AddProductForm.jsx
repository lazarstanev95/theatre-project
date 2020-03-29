import React from 'react';
import Input from '../common/forms/Input';

const AddProductForm = (props) => (
    <form>
        <div>{props.error}</div>
        <Input 
            name='name'
            placeholder='Name'
            value={props.product.name}
            onChange={props.onChange}/>
        <br />
        <Input 
            name='description'
            placeholder='Description'
            value={props.product.description}
            onChange={props.onChange}/>
        <br />
        <Input 
            name='price'
            type='number'
            placeholder='Price'
            value={props.product.price}
            onChange={props.onChange}/>
        <br />
        <input type='submit' onClick={props.onSave}/>
    </form>
)

export default AddProductForm