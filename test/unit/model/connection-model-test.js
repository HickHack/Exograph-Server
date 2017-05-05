var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var chaiSpy = require('chai-spies');
var rewire = require('rewire');
var model = rewire('../../../model/connection-model');

var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;
var assert = chai.assert;
var expect = chai.expect;

var mockNeo4j = {};
var mockConnection = {};

chai.use(chaiSpy);

describe('', function () {

    before(function(){
        model.__set__({
            'neo4j': mockNeo4j,
        });
    });

    function getMockNeo4jResult() {
        return {
            connection: {
                _id: 1,
                properties: {
                    'name': 'John',
                    'profile_image_url': 'a url',
                    'profile_url': 'a profile url',
                    'phone': '1234',
                    'email': 'an email',
                    'company': 'a company',
                    'title': 'a title',
                    'location': 'a location',

                }
            }
        }
    }

    describe("testing get()", function () {
        it('should return a return an error if query fails', function () {
            var error = 'an error';
            var callback = chai.spy();
            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, error , null);

            model.get(1, callback);

            expect(callback).to.have.been.called.once();
            expect(callback).to.have.been.called.with(error);
        });

        it('should return a return an error if query fails', function (done) {
            var error = 'an error';
            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, null, []);

            model.get(1, function (error, result) {
                expect(error).to.be.an.instanceof(Error);
                expect(error.message).to.equal('No such node with id: 1');
                expect(result).to.be.equal(undefined);

                done();
            });
        });

        it('Should return a connection model if query successful', function (done) {
            var mockResult = getMockNeo4jResult();
            mockResult.connections = getMockNeo4jResult();

            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, null, [mockResult, mockResult]);

            model.get(1, function (err, result) {
                var mockProps = mockResult.connection.properties;

                expect(err).to.be.equal(null);
                expect(result).to.be.an.instanceof(model);

                expect(result.id).to.be.equal(mockResult.connection._id);
                expect(result.name).to.be.equal(mockProps.name);
                expect(result.phone).to.be.equal(mockProps.phone);
                expect(result.email).to.be.equal(mockProps.email);
                expect(result.company).to.be.equal(mockProps.company);
                expect(result.title).to.be.equal(mockProps.title);
                expect(result.location).to.be.equal(mockProps.location);
                expect(result.connections).to.be.an.instanceof(Array);
                expect(result.connections).to.have.a.lengthOf(2);

                done();
            });
        });
    });

});