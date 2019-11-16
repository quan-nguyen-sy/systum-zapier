// /* globals describe it */
// const should = require('should');

// const zapier = require('zapier-platform-core');

// // Use this to make test calls into your app:
// const App = require('../index');

// const appTester = zapier.createAppTester(App);
// zapier.tools.env.inject();

// describe('Authentication', () => {
//   describe('Testing authentication', () => {
//     it('Should return access token in result', (done) => {
//       const bundle = {
//         authData: {
//           domain: 'quannguyen.systum.com',
//           username: 'quan.nguyen@systum.com',
//           password: 'qu@nsystum!!',
//         },
//       };

//       appTester(App.authentication.sessionConfig.perform, bundle)
//           .then((results) => {
//             should(results.access_token.length).above(10);
//             done();
//           })
//           .catch(done);
//     });
//   });
// });

// describe('Resource : Customer', () => {
//   it('Should return an array of customers', (done) => {
//     const bundle = {};
//     bundle.authData = {
//       domain: 'quannguyen.systum.com',
//       username: 'quan.nguyen@systum.com',
//       password: 'qu@nsystum!!',
//     };

//     appTester(App.resources.customer.list.operation.perform, bundle)
//         .then((results) => {
//           should.exist(results);
//           done();
//         })
//         .catch(done);
//   });
// });

// describe('Triggers : Customer', () => {
//   describe('New customer trigger', () => {
//     it('should load customers', (done) => {
//       const bundle = {
//         inputData: {
//           status: 'ACTIVE',
//         },
//         authData: {
//           domain: 'quannguyen.systum.com',
//           username: 'quan.nguyen@systum.com',
//           password: 'qu@nsystum!!',
//         },
//       };

//       appTester(App.triggers.customerTrigger.operation.perform, bundle)
//           .then((results) => {
//             results.length.should.above(0);
//             done();
//           })
//           .catch(done);
//     });

//     it('should load recipes without filters', (done) => {
//       const bundle = {
//         inputData: {
//           status: 'DISABLED',
//         },
//         authData: {
//           domain: 'quannguyen.systum.com',
//           username: 'quan.nguyen@systum.com',
//           password: 'qu@nsystum!!',
//         },
//       };

//       appTester(App.triggers.customerTrigger.operation.perform, bundle)
//           .then((results) => {
//             results.length.should.above(1);
//             done();
//           })
//           .catch(done);
//     });
//   });
// });
