/* globals describe it */
const should = require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Resource : Customer', () => {
  it('Create new customer', (done) => {
    const bundle = {};
    bundle.inputData = {};
    bundle.authData = {
      domain: 'quannguyen.systum.com',
      username: 'quan.nguyen@systum.com',
      password: 'qu@nsystum!!',
    };
    bundle.inputData = {
      name: 'Zapier demo 02',
      email: 'zapier.demo.02@email.com',
      phone: '+1123123123',
      mobile: '+1789789789',
    };

    appTester(App.resources.customer.create.operation.perform, bundle)
        .then((results) => {
          console.log(results);
          should.exist(results);
          done();
        })
        .catch(done);
  });
});


// describe('Creates: Customer', () => {
//   it('Should update existing customer with new information', (done) => {
//     const bundle = {};
//     bundle.authData = {
//       domain: 'quannguyen.systum.com',
//       username: 'quan.nguyen@systum.com',
//       password: 'qu@nsystum!!',
//     };
//     bundle.inputData = {
//       email: 'asd@gfmai.com',
//       name: 'Jane Adam new name',
//       phone: '+111111111',
//       mobile: '+2222222222',
//     };
//     appTester(App.creates.customer_update.operation.perform, bundle)
//         .then((results) => {
//           should.exist(results);
//           done();
//         })
//         .catch(done);
//   });
// });
