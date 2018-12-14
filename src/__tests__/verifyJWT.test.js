const verifyJWT = require ('../verifyJWT');

const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUwMDAwMDAwMDAsIm9wYXF1ZV91c2VyX2lkIjoiVUcxMlgzNDVUNko3OCIsImNoYW5uZWxfaWQiOiJ0ZXN0X2NoYW5uZWwiLCJyb2xlIjoiYnJvYWRjYXN0ZXIiLCJpc191bmxpbmtlZCI6ImZhbHNlIiwicHVic3ViX3Blcm1zIjp7Imxpc3RlbiI6WyJicm9hZGNhc3QiLCJ3aGlzcGVyLVVHMTJYMzQ1VDZKNzgiXSwic2VuZCI6WyJicm9hZGNhc3QiLCJ3aGlzcGVyLSoiXX19.Qg8ZmSr-FrWCySU-FQrxtxBn2QzHULy24ZGoQqCksUs';
const expiredToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUwMDAwMDAwLCJvcGFxdWVfdXNlcl9pZCI6IlVHMTJYMzQ1VDZKNzgiLCJjaGFubmVsX2lkIjoidGVzdF9jaGFubmVsIiwicm9sZSI6ImJyb2FkY2FzdGVyIiwiaXNfdW5saW5rZWQiOiJmYWxzZSIsInB1YnN1Yl9wZXJtcyI6eyJsaXN0ZW4iOlsiYnJvYWRjYXN0Iiwid2hpc3Blci1VRzEyWDM0NVQ2Sjc4Il0sInNlbmQiOlsiYnJvYWRjYXN0Iiwid2hpc3Blci0qIl19fQ.NwRfNeOx2Gj8Z6voMQmZzsnDIFal76W24s_d-7iNS98';
const payload = {
  exp: 5000000000,
  opaque_user_id: 'UG12X345T6J78',
  channel_id: 'test_channel',
  role: 'broadcaster',
  is_unlinked: 'false',
  pubsub_perms: {
    listen: [ 'broadcast', 'whisper-UG12X345T6J78' ],
    send: ['broadcast','whisper-*']
  }
};

const validSecret = 'testSecret';

test('valid payload and secret', () => {
  expect(verifyJWT(validToken, validSecret)).toEqual(payload)
});

test('missing token', () => {
  const throwTest = () => {
    verifyJWT(null, validSecret);
  };

  expect(throwTest).toThrow('Missing JWT Token');
});

test('missing secret', () => {
  const throwTest = () => {
    verifyJWT(validToken, null);
  };

  expect(throwTest).toThrowError('Missing JWT Secret');
});

test('invalid prefix', () => {
  const throwTest = () => {
    verifyJWT(validToken.substr(7), validSecret);
  };
  
  expect(throwTest).toThrowError('Invalid token prefix');
});

test('invalid signature', () => {
  const throwTest = () => {
    verifyJWT(validToken, '123');
  };
  
  expect(throwTest).toThrow('invalid signature');
});

test('jwt expired', () => {
  const throwTest = () => {
    verifyJWT(expiredToken, validSecret);
  };
  
  expect(throwTest).toThrow('jwt expired');
});