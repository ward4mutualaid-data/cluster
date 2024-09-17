import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import CustomGeocoder from './Geocoder';
import { API } from 'aws-amplify';

export class OrderForm extends Component {


  constructor(props){
      super(props);
      this.state = {
        startDate: new Date(),
        order: this.props.order,
        edit: this.props.edit,
        title: this.props.title
      };
      this.handleFormChange = this.handleFormChange.bind(this);
    }

  handleFormChange(event) {

      var newOrder = this.state.order
      newOrder.fields[event.target.name] = event.target.value
      console.log("VALUE CHANGED, event = ", event.target.value)
      console.log("NEW ORDER", newOrder)
      this.setState({order: newOrder});

    }


  async updateOrder(order) {

    const apiName = 'w4madata';
    const path = `/orders`;


    /*
     remove non-updatable fields (aka airtable "computed fields")
     we are not allowed to update this -- nor should you
    */
    var updatedOrder = order
    updatedOrder.fields.order_id = undefined // auto number
    updatedOrder.createdTime = undefined //  auto timestamp

    const apiParameters = {
      body: {order: order}
     };

    const updateStatus = await API
      .patch(apiName, path, apiParameters)
      .then(response => {
        console.log("update successful:", response)
      })
      .catch(error => {
        console.log("ERROR UPDATING ORDER", error)
        console.log(error.response);
     });

  }


  render() {
    const disabled = !this.state.edit

    var order = this.state.order // FIXME - delte
    return (
      <div> {/* begin page */}
        <div className="page-header">
          <h3 className="page-title"> {this.state.title} </h3>
          { !this.state.edit ? (
            <button type="button" className="btn btn-primary"
               onClick={() => {
                 this.setState({ edit: true});
               }}
             >Edit
           </button>
         ) : (
           <button type="button" className="btn btn-success"
              onClick={async () =>  {
                await this.updateOrder(this.state.order)
                this.setState({ edit: false });
              }}
              >Save
            </button>)
          }
        </div>


        <div className="row"> {/* begin first row */}
          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Basic information</h4>

                    {/* for the form inputs, make sure their id is the same as the order field name ,
                      eg id = first_name, and order.fields.first_name
                      */}
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">First Name</label>
                        <div >
                        <Form.Control  type="text" className="form-control" name="first_name" placeholder="First name" value={this.state.order.fields.first_name}  disabled={disabled}  onChange={this.handleFormChange}/>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Last Name</label>
                        <div>
                        <Form.Control type="text" className="form-control" name="last_name" placeholder="Last name" value={this.state.order.fields.last_name}  disabled={disabled}  onChange={this.handleFormChange}/>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Email address</label>
                        <div >
                        <Form.Control type="email" className="form-control" name="email_address" placeholder="Email address" value={this.state.order.fields.email_address || ''}  disabled={disabled} onChange={this.handleFormChange}/>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Phone number</label>
                        <div>
                        <Form.Control type="tel" className="form-control" name="phone_number" placeholder="Phone number" value={order.fields.phone_number}  disabled={disabled} onChange={this.handleFormChange}/>
                        </div>
                      </Form.Group>
                    </div>
                  </div>


                  <Form.Group>
                    <label htmlFor="deliveryDate">Desired delivery date (must be a Wednesday or Saturday)</label>
                    <Form.Control type="date" className="form-control" name="delivery_date" placeholder="Desired delivery date" value={this.state.order.fields.delivery_date || ''}  disabled={disabled} onChange={this.handleFormChange} />
                  </Form.Group>



                  <Form.Group className="row">
                    <label className="col-sm-4 col-form-label">Preferred language</label>
                    <div className="col-sm-3">
                      <div className="form-check">
                        <label className="form-check-label">
                          <input type="radio" className="form-check-input" name="language" id="languageEnglish" checked={this.state.order.fields.language==="english"} onChange={this.handleFormChange} /> English
                          <i className="input-helper"></i>
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-3">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input type="radio" className="form-check-input" name="language" id="languageSpanish"  checked={this.state.order.fields.language==="spanish"} onChange={this.handleFormChange}/> Spanish
                        <i className="input-helper"></i>
                      </label>
                    </div>
                    </div>
                  </Form.Group>

                  <div className="form-check">
                    <label className="form-check-label text">
                      <input type="checkbox" className="form-check-input" name="is_urgent" checked={this.state.order.fields.is_urgent==="yes"}  disabled={disabled} onChange={this.handleFormChange}/>
                      <i className="input-helper"></i>
                      Urgent delivery?
                    </label>
                  </div>

              </div>
            </div>
          </div>

          <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Family information</h4>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Number of adults</label>
                        <div >
                        <Form.Control  type="number" step="1" min="0" className="form-control" name="num_adults" placeholder="Number of adults" value={this.state.order.fields.num_adults}  disabled={disabled}  onChange={this.handleFormChange}/>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group >
                        <label className="col-form-label">Number of children</label>
                        <div >
                        <Form.Control  type="number" step="1" min="0" className="form-control" name="num_children" placeholder="Number of children" value={this.state.order.fields.num_children}  disabled={disabled}  onChange={this.handleFormChange}/>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group >
                        <label className="col-form-label">Children's ages (leave blank if not applicable)</label>
                        <div >
                        <Form.Control  type="text"  className="form-control" name="children_ages" placeholder="8, 10, 15" value={this.state.order.fields.children_ages}  disabled={disabled}  onChange={this.handleFormChange}/>
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group >
                        <label className="col-form-label">Dietary restrictions (leave blank if none)</label>
                        <div >
                        <Form.Control type="textarea" className="form-control" name="dietary_restrictions" placeholder="No dairy, ..." value={this.state.order.fields.dietary_restrictions}  disabled={disabled}  onChange={this.handleFormChange}/>
                        </div>
                      </Form.Group>
                    </div>

                  </div>


              </div>
             </div>
           </div>
         </div> {/* end first row */}


         <div className="row">
         <div className="card-body" id="geocoder-h4">
         <h4 className="card-title">Delivery location</h4>
         </div>
           <div className="col-md-12 grid-margin stretch-card">

             <div className="card">
               <div className="card-body">
                <CustomGeocoder/>
                {/* TODO - show order.lon/lat on the map*/}
               </div>
             </div>

           </div>
         </div>

      {/* end page*/}
      </div>
    )
  }
}

export default OrderForm
