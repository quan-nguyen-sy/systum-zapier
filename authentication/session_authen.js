const fetch = require('node-fetch');
const zapier = require('zapier-platform-core');
zapier.tools.env.inject();
// getting access token from domain
const getAccessToken = (z, bundle) => {
  z.console.log('getting acces token');
  const promise = z.request({
    method: 'POST',
    url: 'https://quannguyen.systum.com/api/identity/auth/employee/',
    headers: {
      'Content-Type': 'application/json',
    },
    json: {
      domain: bundle.authData.domain,
      username: bundle.authData.username,
      password: bundle.authData.password,
    },
  });

  return promise.then((response) => {
    if (response.status == 401) {
      throw new Error('Check your credentials!');
    }

    result = z.JSON.parse(response.content);
    if ('key' in result && 'message' in result) {
      throw new z.errors.RefreshAuthError('Your credentials is not corrected.');
    }
    accessToken = result.token;
    return {
      'access_token': 'Token ' + accessToken,
    };
  });
};

const testSessionAuth = (z, bundle) => {
  const options = {
    url: 'https://quannguyen.systum.com/api/products/33937/',
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': bundle.authData.access_token,
    },
    params: {
      username: bundle.authData.username,
      domain: bundle.authData.domain,
      password: bundle.authData.password,
    },
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = z.JSON.parse(response.content);

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

// doing the authenticaiton
const authentication = {
  type: 'session',
  test: testSessionAuth,
  // all required fields that need to do the authentication
  fields: [
    {
      key: 'domain',
      type: 'string',
      required: true,
      helpText: 'your domain',
    },
    {
      key: 'username',
      type: 'string',
      required: true,
      helpText: 'your username',
    },
    {
      key: 'password',
      type: 'password',
      required: true,
      helpText: 'your password',
    },
  ],
  sessionConfig: {
    perform: getAccessToken,
  },
};

// eslint-disable-next-line require-jsdoc
const gettingAccessToken = (domain, username, password) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain: domain,
      username: username,
      password: password,
    }),
  };

  const promise = fetch('https://quannguyen.systum.com/api/identity/auth/employee/', options);
  return promise.then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      let message = 'Can not retrieve access token ';
      message += response.status + ' : ' + response.statusText;
      z.console.log(message);
      return false;
    }
  });
};

// adding access token to header
const addingAccessToken = async (request, z, bundle) => {
  const authenData = await gettingAccessToken(
      bundle.authData.domain,
      bundle.authData.username,
      bundle.authData.password);

  const token = authenData.token;
  if (!token) {
    throw new Error('Error while retrieving access token');
  } else {
    request.headers['Authorization'] = 'Token ' + token;
  }
  bundle.authData.access_token = token;
  return request;
};

// retaking access token if access token is expired or lacking
const responseProcessing = (response, z, bundle) => {
  if (response.status >= 500) {
    throw new Error(`ERROR ${response.status}: ${response.statusText}`);
  };
  result = z.JSON.parse(response.content);
  if (response.status == 200) {
    if (result.message && result.key) {
      throw new z.errors.HaltedError(`ERROR ${result.key}: ${result.message}`);
    }
  }
  if (response.status >= 400) {
    throw new z.errors.HaltedError('401: Access token need to reclaim');
  }
  return response;
};

module.exports = {
  'authentication': authentication,
  'addingAccessToken': addingAccessToken,
  'responseProcessing': responseProcessing,
  'getAccessToken': getAccessToken,
};
