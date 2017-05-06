var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var chaiSpy = require('chai-spies');
var rewire = require('rewire');
var model = rewire('../../../model/follower-model');

var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;
var expect = chai.expect;

var mockNeo4j = {};

chai.use(chaiSpy);

describe('Follower model', function () {

    before(function(){
        model.__set__({
            'neo4j': mockNeo4j,
        });
    });

    function getMockNeo4jResult() {
        return {
            follower: {
                _id: 1,
                properties: {
                    'name': 'John',
                    'profile_image_url': 'a url',
                    'friends_count': 22,
                    'followers_count': 1223,
                    'screen_name': 'John',
                    'description': 'YSBkZXNjcmlwdGlvbg==',
                    'location': 'YSBsb2NhdGlvbg=='
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

        it('Should return a follower model if query successful', function (done) {
            var mockResult = getMockNeo4jResult();
            mockResult.friend = getMockNeo4jResult();

            mockNeo4j.run = sinon.stub();
            mockNeo4j.run.callsArgWith(1, null, [mockResult, mockResult]);

            model.get(1, function (err, result) {
                var mockProps = mockResult.follower.properties;

                expect(err).to.be.equal(null);
                expect(result).to.be.an.instanceof(model);
                expect(result.id).to.be.equal(mockResult.follower._id);
                expect(result.name).to.be.equal(mockProps.name);
                expect(result.friendsCount).to.be.equal(mockProps['friends_count']);
                expect(result.followersCount).to.be.equal(mockProps['followers_count']);
                expect(result.screenName).to.be.equal("@" + mockProps['screen_name']);
                expect(result.description).to.be.equal('a description');
                expect(result.location).to.be.equal('a location');
                expect(result.friends).to.be.an.instanceof(Array);
                expect(result.friends).to.have.a.lengthOf(1);

                done();
            });
        });
    });

});