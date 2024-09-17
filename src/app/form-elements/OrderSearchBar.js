import React, { Component } from 'react';
import { Form } from 'react-bootstrap';


export class OrderSearchBar extends Component {
  state = {
    startDate: new Date(),
    order_id: this.props.order_id,
    edit: this.props.edit,
    title: this.props.title
  };


  render() {return(
    <div className="row"> {/* begin first row */}
      <div className="col-md-8 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Look up an order</h4>

              <div className="row">
                <div className="col-md-12">
                  <Form.Group >
                    <label className="col-form-label">Order id</label>
                    <div >
                    <Form.Control  type="text" className="form-control" id="orderId" placeholder="Order Id"/>
                    </div>
                  </Form.Group>
                </div>

              </div>



          </div>
        </div>
      </div>

   </div>
 )}
}


export default OrderSearchBar
