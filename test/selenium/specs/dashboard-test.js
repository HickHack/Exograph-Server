var chai = require("chai");
var DashboardPage = require('../pages/dashboard-page');
var assert = chai.assert;

// describe("Dashboard tests", function () {
//
//     describe("elements on the page should be visible", function () {
//
//         it('should check the standout components are visible', function () {
//             DashboardPage.login(function () {
//                 var standouts = DashboardPage.standouts;
//
//                 assert(standouts.networks.get().isVisible());
//                 assert(standouts.running_jobs.get().isVisible());
//                 assert(standouts.trash_count.get().isVisible());
//                 assert(standouts.warnings.get().isVisible());
//             });
//         });
//     });
// });