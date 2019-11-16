const updateCustomer = (z, bundle) => {
  const url = `https://quannguyen.systum.com/api/customers/${bundle.inputData.sysid}/`;
  const promise = z.request({
    url: url,
    method: 'POST',
    body: {
      sysid: bundle.inputData.sysid,
      name: bundle.inputData.name,
      phone: bundle.inputData.phone,
      firstName: bundle.inputData.firstName,
      lastName: bundle.inputData.lastName,
      mobile: bundle.inputData.mobile,
    },
  });

  return promise.then((response) => {
    const customer = z.JSON.parse(response.content);
    customer.id = customer.sysid;
    delete customer.sysid;
    return customer;
  });
};

module.exports = {
  key: 'customer_update',
  noun: 'Customer',
  display: {
    label: 'Update customer',
    description: 'Updating information of customer',
  },
  operation: {
    inputFields: [
      {key: 'sysid', required: true, type: 'string'},
      {key: 'name', required: false, type: 'string'},
      {key: 'phone', required: false, type: 'string'},
      {key: 'firstName', required: false, type: 'string'},
      {key: 'lastName', required: false, type: 'string'},
      {key: 'mobile', required: false, type: 'string'},
    ],
    perform: updateCustomer,
    sample: {
      id: 1,
      name: 'John Wick',
      phone: '+18239842',
      firstName: 'John',
      lastName: 'Wick',
      mobile: '+1894234',
    },
    outputFields: [
      {key: 'id', label: 'sysid'},
      {key: 'name', label: 'name'},
      {key: 'phone', label: 'phone'},
      {key: 'firstName', label: 'firstName'},
      {key: 'lastName', label: 'lastName'},
      {key: 'mobile', label: 'mobile'},
    ],
  },
};
