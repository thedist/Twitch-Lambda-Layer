const verifyHubSig = require('../verifyHubSig');

const signature = 'sha256=6a691f752a2ef60046bbbcc3d59c762fc50b04e16b40d07f7ebf53c1571fae0b';
const body = `{
  "data":
    [{
      "id": "0123456789",
      "user_id": "32168215",
      "user_name": "thedist",
      "game_id": "21779",
      "community_ids": [],
      "type": "live",
      "title": "Best Stream Ever",
      "viewer_count": 417,
      "started_at": "2017-12-01T10:09:45Z",
      "language": "en",
      "thumbnail_url": "https://link/to/thumbnail.jpg"
    }
}`;

const secret = 'testSecret';

test('valid secret, signature and body', () => {
  expect(verifyHubSig(secret, signature, body)).toBeTruthy();
});

test('valid secret and event', () => {
  expect(verifyHubSig(secret, { headers: { 'x-hub-signature': signature }, body })).toBeTruthy();
});

test('missing secret', () => {
  const throwTest = () => {
    verifyHubSig(null, signature, body)
  };

  expect(throwTest).toThrow('Missing Secret');
});

test('missing signature', () => {
  const throwTest = () => {
    verifyHubSig(secret, null, body)
  };

  expect(throwTest).toThrow('Missing x-hub-signature');
});