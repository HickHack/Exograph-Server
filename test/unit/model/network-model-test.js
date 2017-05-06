var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var chaiSpy = require('chai-spies');
var rewire = require('rewire');
var errors = require("../../../helper/errors");
var model = rewire('../../../model/network-model');

var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;
var expect = chai.expect;

var mockNeo4j = {};

chai.use(chaiSpy);

describe('Network model', function () {

    before(function(){
        model.__set__({
            'neo4j': mockNeo4j,
        });
    });

    function getMockNeo4jResult() {
        return {
            network: {
                _id: 1,
                properties: {
                    'no_connections': 4224,
                    'job_id': 2,
                    'name': 'a network',
                    'type': 'LINKEDIN',
                    'created_time': 1494094897,
                    'image_ref': '/a/ref',
                    'is_trash': true
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

            model.get(1, null, callback);

            expect(callback).to.have.been.called.once();
            expect(callback).to.have.been.called.with(error);
        });

        it('should return an NodeNotFound error', function (done) {
            var error = 'an error';
            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, null, []);

            model.get(1, null, function (error, result) {
                expect(error).to.be.an.instanceof(errors.NodeNotFoundError);
                expect(result).to.be.equal(undefined);

                done();
            });
        });

        it('Should return a network object', function (done) {
            var mockResult = getMockNeo4jResult();
            mockResult.friend = getMockNeo4jResult();

            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, null, [mockResult]);

            model.get(1, null, function (err, result) {
                var mockProps = mockResult.network.properties;

                expect(err).to.be.equal(null);
                expect(result).to.be.an.instanceof(model);
                expect(result.id).to.be.equal(mockResult.network._id);
                expect(result.name).to.be.equal(mockProps.name);
                expect(result.type).to.be.equal(mockProps.type);
                expect(result.imageRef).to.be.equal(mockProps['image_ref']);
                expect(result.isTrash).to.be.equal(mockProps['is_trash']);
                expect(result.jobId).to.be.equal(mockProps['job_id']);
                expect(result.numConnections).to.be.equal(mockProps['no_connections']);

                done();
            });
        });
    });

});