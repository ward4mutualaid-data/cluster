import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import CustomGeocoder from './Geocoder';
import OrderForm from './OrderForm'

export class NewOrderForm extends Component {
  state = {
    startDate: new Date(),
    edit: true,
    order: {},
    title: "New Order Intake Form"
  };

render(){
 return  <OrderForm {...this.state}/>

}



}

export default NewOrderForm
