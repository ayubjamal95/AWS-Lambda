import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppSettings } from './constants';
import * as AWS from 'aws-sdk';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} 
 *
 */
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let response: APIGatewayProxyResult;
    const crypto = require('crypto');

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const sns = new AWS.SNS();
    const res = JSON.parse(event.body as string);

    interface signature {
        timestamp: any,
        token: any,
        signature: any
    }

    const sign: signature = res.signature;
    const mailEvent: any = res["event-data"].event;

    let verify = () => {
        const encodedToken = crypto
            .createHmac('sha256', AppSettings.signingKey)
            .update(sign.timestamp.concat(sign.token))
            .digest('hex')

        return (encodedToken === sign.signature)
    }

    if (verify()) {

        const data = {
            Bucket: AppSettings.bucketName,
            Key: 'file' + sign.timestamp + '.json',
            Body: JSON.stringify(res),
        };

        const responseS3 = await s3.upload(data).promise();

        const transformedVersion = {
            Provider: AppSettings.Provider,
            timestamp: sign.timestamp,
            type: mailEvent
        }

        const params = {
            Message: JSON.stringify(transformedVersion),
            Subject: "SNS From Lambda!",
            TopicArn: process.env.SNStopic
        };

        const snsResponse = await sns.publish(params).promise();

        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "Subscriber Notified!",
            }),
        }
    }
    else {

        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: "Some error occured",
            }),
        };
    }
    return response;
};
