const zapier = require('zapier-platform-core');
zapier.tools.env.inject();

const checkExistanceOfCustomer = (z, bundle) => {
  console.log('check if customer is existed or not');
  const requestOptions = {
    method: 'GET',
    url: process.env.CUSTOMER_ENDPOINT_V1_1,
    params: {
      'q': bundle.inputData.email,
    },
  };
  const responsePromise = z.request(requestOptions);
  return responsePromise.then((response) => {
    if (response.status >= 500) {
      throw new Error('Server Error');
    }

    if (response.status >= 400) {
      throw new Error('Check your credentials');
    }
    // return search result
    return z.JSON.parse(response.content);
  });
};

// get a single customer
const getCustomer = (z, bundle) => {
  const responsePromise = z.request({
    url: process.env.CUSTOMER_ENDPOINT + bundle.inputData.sysid + '/',
  });
  return responsePromise
      .then((response) => {
        if (response.status == 400) {
          throw new Error('Please check your credentials');
        }

        const customer = z.JSON.parse(response.content);
        return {
          'customer': customer,
        };
      });
};

// get a list of customers
const listCustomers = (z, bundle) => {
  const responsePromise = z.request({
    method: 'GET',
    url: process.env.CUSTOMER_ENDPOINT,
    params: {
      status: 'ACTIVE',
      fields: 'sysid,name,status,email,phone',
    },
  });

  return responsePromise
      .then((response) => {
        if (response.status == 400) {
          throw new Error('Please check your credentials');
        }

        const customers = z.JSON.parse(response.content);
        customers.forEach((customer) => {
          customer.id = customer.sysid + ' - ' + customer.dateModified;
          if (customer.status == 'ACTIVE') {
            customer.status = 'Active';
          } else {
            customer.status = 'Inactive';
          }
        });
        return customers;
      });
};

// find a particular customer by name
const searchCustomers = (z, bundle) => {
  const responsePromise = z.request({
    url: process.env.CUSTOMER_ENDPOINT,
    params: {
      q: `${bundle.inputData.name}`,
    },
  });
  return responsePromise
      .then((response) => {
        if (response.status >= 500) {
          throw new Error('Server Error');
        }
        if (response.status >= 400) {
          throw new Error('Check your credential please');
        }

        const result = z.JSON.parse(response.content);
        return {
          'customer': result,
        };
      });
};

const createCustomer = async (z, bundle) => {
  // checking if customer is existed or not
  const searchResult = await checkExistanceOfCustomer(z, bundle);

  let customerSysid = -1;
  // found customer who has the simillar email address
  if (searchResult.total > 0) {
    customers = searchResult.results;
    customers.forEach((customer) => {
      if (customer.email == bundle.inputData.email) {
        // if customer is existed: update value of customerSysid variable.
        customerSysid = customer.sysid;
      }
    });
  }

  // data is used for sending create/update request
  data = {
    name: bundle.inputData.name,
    firstName: bundle.inputData.firstName,
    lastName: bundle.inputData.lastName,
    email: bundle.inputData.email,
    status: bundle.inputData.status,
    phone: bundle.inputData.phone,
    mobile: bundle.inputData.mobile,
  };

  // setting API endpoint and data for request
  let endpoint = process.env.CUSTOMER_ENDPOINT;
  if (customerSysid > -1) {
    // if customer is found: update endpoint and remove email attribute from data.
    endpoint = process.env.CUSTOMER_ENDPOINT + customerSysid + '/';
    delete data.email;
  }

  const requestOptions = {
    method: 'POST',
    url: endpoint,
    body: data,
  };

  const responsePromise =z.request(requestOptions);

  return responsePromise.then((response) =>{
    if (response.status >= 500) {
      throw new Error('Server Error');
    }

    if (response.status >= 400) {
      throw new Error('Check your credentials');
    }

    const customer = z.JSON.parse(response.content);
    return {
      'customer': customer,
    };
  });
};

module.exports = {
  key: 'customer',
  noun: 'Customer',

  create: {
    display: {
      label: 'Create/Update customer',
      description: 'Create new customers or update customers on Systum.',
    },
    operation: {
      inputFields: [
        {key: 'id', required: false, type: 'number'},
        {key: 'name', required: true, type: 'string'},
        {key: 'email', required: true, type: 'string'},
        {key: 'phone', required: false, type: 'string'},
        {key: 'status', required: false, type: 'string'},
        {key: 'firstname', required: false, type: 'string'},
        {key: 'lastname', required: false, type: 'string'},
        {key: 'individual', required: false, type: 'boolean'},
        {key: 'isB2B', required: false, type: 'boolean'},
        {key: 'title', required: false, type: 'string'},
        {key: 'mobile', required: false, type: 'string'},
      ],
      perform: createCustomer,
    },
  },
  get: {
    display: {
      label: 'Get Customer',
      description: 'Gets a customer.',
    },
    operation: {
      inputFields: [
        {key: 'id', required: true},
      ],
      perform: getCustomer,
    },
  },

  list: {
    display: {
      label: 'Resource: Active Customer',
      description: 'Resource: Lists active customers.',
    },
    operation: {
      perform: listCustomers,
    },
  },

  search: {
    display: {
      label: 'Find Customer',
      description: 'Finds a customer by searching.',
    },
    operation: {
      inputFields: [
        {key: 'name', required: true},
      ],
      perform: searchCustomers,
    },
  },

  sample: {
    id: 1,
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
};
