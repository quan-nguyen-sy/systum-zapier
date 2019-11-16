const zapier = require('zapier-platform-core');
zapier.tools.env.inject();
const customerEndpoint = process.env.CUSTOMER_ENDPOINT;
const listCustomerTrigger = (z, bundle) => {
  // `z.console.log()` is similar to `console.log()`.
  const params = {};
  if (bundle.inputData.status) {
    params.status = bundle.inputData.status;
  }
  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const requestOptions = {
    url: customerEndpoint,
  };

  // You may return a promise or a normal data structure from any perform method.
  return z
      .request(requestOptions)
      .then((response) => {
        if (response.status == 401) {
          throw new Error(`Check your token: ${bundle.authData.access_token}`);
        }

        const customers = z.JSON.parse(response.content);
        // change prototype from sysid to id
        customers.forEach((customer) => {
          customer.id = customer.sysid + ' - ' +customer.dateModified;
        });
        return customers;
      });
};

module.exports = {
  key: 'customerTrigger',
  noun: 'Customer',
  display: {
    label: 'Trigger: New/Updated Customer',
    description: 'Triggers when new customer is created or updated',
  },

  operation: {
    inputFields: [
      {
        key: 'status',
        required: true,
        label: 'Status of customer',
        type: 'string',
      },
    ],

    perform: listCustomerTrigger,
    sample: {
      id: 1,
      sysid: 1,
      name: 'John Wick',
      email: 'jk@systum.com',
      phone: '123456789',
      status: 'ACTIVE',
      firstname: 'John',
      lastname: 'Wick',
      individual: 'true',
      title: 'Mr',
      mobile: '0938171483',
    },

    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'sysid', label: 'sysid'},
      {key: 'name', label: 'Name'},
      {key: 'email', label: 'Email'},
      {key: 'phone', label: 'Phone'},
      {key: 'status', label: 'Status'},
      {key: 'firstname', label: 'First name'},
      {key: 'lastname', label: 'Last name'},
      {key: 'individual', label: 'Individual?'},
      {key: 'title', label: 'Title'},
      {key: 'mobile', label: 'Mobile'},
    ],
  },
};
