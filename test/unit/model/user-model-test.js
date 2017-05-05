var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var chaiSpy = require('chai-spies');
var rewire = require('rewire');
var model = rewire('../../../model/user-model');

var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;
var assert = chai.assert;
var expect = chai.expect;

var mockNeo4j = {};
var mockValidate = {};
var mockNetwork = {};

chai.use(chaiSpy);

describe('User model testing', function () {

    before(function(){
        model.__set__({
            'neo4j': mockNeo4j,
            'validate': mockValidate,
            'network': mockNetwork
        });
    });

    function getMockNode() {
        return {
            properties: {
                email: sinon.spy()
            }
        }
    }

    describe("testing patch()", function () {
        it('should call the callback with null', function () {
            var subject = new model(getMockNode());
            var results = [{user: 'a user'}];
            var callback = sinon.spy();

            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, null, results);

            subject.patch(callback);

            assert(callback.calledWith(null));
        });

        it('should call the callback with an error', function () {
            var mockNode = getMockNode();
            var subject = new model(mockNode);
            var callback = sinon.spy();
            var error = {message: 'an error'};

            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, error, null);

            subject.patch(callback);

            assert(callback.calledWith(error));
        });
    });


    describe("testing getNetworks()", function () {
        it('should fail and return an error', function () {
            var subject = new model(getMockNode());
            var err = {message: 'an error'};
            var callback = sinon.spy();

            mockNetwork.getAllByUser = sinon.stub();
            mockNetwork.getAllByUser.callsArgWith(1, err, null);

            subject.getNetworks(callback);

            assert(callback.calledWith(err));

        });

        it('should call callback with result', function () {
            var subject = new model(getMockNode());
            var result = {network: 'an network'};
            var callback = sinon.spy();

            mockNetwork.getAllByUser = sinon.stub();
            mockNetwork.getAllByUser.callsArgWith(1, null, result);

            subject.getNetworks(callback);

            assert(callback.calledWith(null, result));
        });
    });

    describe("testing getNetwork()", function () {
        it('should resolve with a network', function () {
            var subject = new model(getMockNode());
            var results = {network: 'a network'};

            mockNetwork.get = sinon.stub();
            mockNetwork.get.callsArgWith(2, null, results);

            subject.getNetwork(1)
                .then(res => {
                    expect(res).to.have.property('network');
                    expect(res.network).to.equal('a network');
                });
        });

        it('should reject with an error', function () {
            var subject = new model(getMockNode());
            var error = {message: 'a message'};

            mockNetwork.get = sinon.stub();
            mockNetwork.get.callsArgWith(2, error, null);

            subject.getNetwork(1)
                .catch(err => {
                    expect(err).to.have.property('message');
                    expect(err.message).to.equal('a message');
                });
        });
    });

    describe("testing user get()", function () {

        it('should call callback with an error', function () {
            var err = {message: ''};
            var callback = chai.spy();


            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, err, null);

            model.get(1, callback);

            expect(callback).to.have.been.called.once();
            expect(callback).to.have.been.called.with(err);
        });

        it('results should be empty and return error object', function () {
            var results = [];
            var callback = chai.spy();


            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, null, results);

            model.get(1, callback);

            expect(callback).to.have.been.called();
            expect(callback).to.have.been.called.once();
        });
    });
});