import React, { Component } from 'react'
import awsmobile from '../../aws-exports';
import { API } from 'aws-amplify';

export class OpenOrdersTable extends Component {
  state = {
    orders: undefined,
    finishedQuery: false
  }


  async getAirtableOrders() {

    const apiName = 'w4madata';
    const path = '/orders';
    const apiParameters = { // OPTIONAL parameters
        response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
        queryStringParameters: {  // OPTIONAL
            key1: 'value1',
        },
    };

    const orders = await API
      .get(apiName, path, apiParameters)
      .then(response => {
        console.log("retrieved response from airtable:",response)
        return response.data.body.records
      })
      .catch(error => {
        console.log("ERROR RETRIEVING DATA", error)
        console.log(error.response);
     });

    this.setState({orders})
  }

  async componentDidMount(){

    await this.getAirtableOrders()
    this.setState({finishedQuery: true})
  }

  render() {
    // waits to render the page until we have data
   if (!this.state.orders) {
      return <div />
       }

    const {orders} = this.state

    // create the table rows in a loop
    let tableRows = []
    let order, uid
    for (var i = 0; i < orders.length; i++) {
        order = orders[i]
        uid = order.id

        tableRows.push(
          <tr key={uid}>
            <td>{order.fields.order_id}</td>
            <td>{order.fields.first_name}</td>
            <td>{order.fields.delivery_date}</td>
            <td>{order.fields.language}</td>
            <td>
              {order.fields.is_urgent ? "YES" : ""}
            </td>
            <td><label className="badge badge-warning">{order.fields.order_status}</label></td>

            <td><a href={"/form-Elements/view-edit-order-form/" + order.fields.order_id} target="_blank"> <i className="mdi mdi-open-in-new"></i></a></td>
          </tr>
          )
          ;
    }
    return (

      <div>
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">In-progress Orders</h4>
                <p className="card-description">All open orders that have not yet been delivered
                </p>
                <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                      <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Delivery Date</th>
                        <th>Language</th>
                        <th>Urgent</th>
                        <th>Order status</th>
                        <th>View order</th>
                      </tr>
                    </thead>
                    <tbody>
                    {tableRows}
                    </tbody>
                 </table>
               </div>
             </div>
           </div>
         </div>

       </div>
     </div>
    );
  }
}

export default OpenOrdersTable
