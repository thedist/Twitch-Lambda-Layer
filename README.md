# Twitch-Lambda-Layer
AWS Lambda Layer for providing common functionality for Twitch functions.


## Lambda Layers
Lambda Layers are a way to bundle dependencies together and make them accessible through different Lambda functions rather than needing to have each Lambda function include its own copy of a dependency.

This Lambda Layer is designed for the nodejs8.10 and nodejs6.10 runtimes and provides functions that are used within common Twitch Lambda functions, such as verifying a JWT for extensions (where it's not uncommon for an extension to have a dozen endpoints, each needing to verify tokens which would have previously required each of those functions bundling 'jsonwebtoken'), or verifying the signature on webhook notifications. This layer also includes all dependencies needed for those functions.


## Getting Started
This layer is public, meaning that it can be added to a Lambda function through its ARN `arn:aws:lambda:eu-west-1:902747084409:layer:twitch-lambda-layer:1`. This can be achieved by using the AWS CLI with the command `aws lambda update-function-configuration --function-name YourLambdaFunction --layers arn:aws:lambda:eu-west-1:902747084409:layer:twitch-lambda-layer:1`. Alternatively it is possible to add the layer to a function through the functions page on Lambda, selecting Layers in the designer, adding a new layer, and then selecting to use the ARN.

Layers added to a function can be accessed as if they were a module included with the function itself.

## Functions
 - verifyJWT(token, secret)
```javascript
  const { verifyJWT } = requires('twitch-lambda-layer');

  exports.handler = async event => {
    let jwt;

    try {
      jwt = verifyJWT(event.headers.Authorization, SECRET);
    } catch(e) {
      console.warn(e);
    }

    ...
  };

```


 - verifyHubSig(secret, signature, body)
```javascript
  const { verifyHubSig } = requires('twitch-lambda-layer');

  exports.handler = async event => {
    let signatureCheck;

    try {
      signatureCheck = verifyHubSig(SECRET, event.headers['x-hub-signature'], event.body);
    } catch(e) {
      console.warn(e);
    }

    if (!signatureCheck) return console.warn('Notification signature mismatch');

    ...
  };
```


## Creating a new Layer
If you wish to create your own Layer based on this, you need to upload a .zip to AWS using the directory structure `/nodejs/node_modules/`. The simplest way to achieve this is to create a directory called `nodejs` and from within that run `npm install twitch-lambda-layer` which will create the `node_modules` folder along with all the required dependencies. The `nodejs` folder can then be zipped after any changes are made and either manually uploaded to AWS Lambda through the Layers page, or with the AWS CLI command 

```ps
aws lambda publish-layer-version --layer-name "Name for your new Layer" --description "Layer Description" --license-info "Apache-2.0" --compatible-runtimes nodejs8.10 nodejs6.10 --zip-file "fileb://Path/To/Your/Zip"
```


## License

This project is licensed under the Apache-2.0 license - see the LICENSE file for details