import json

import django
import numpy as np


def hello(event, context):
    body = {
        "message": "Django and numpy",
        "input": event,
        "proofNotPudding": json.dumps(np.arange(0, 10).reshape(5, 2).tolist())
    }
    print('body')
    print(body)

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }
    print('response')
    print(response)

    return response

    # Use this code if you don't use the http event with the LAMBDA-PROXY
    # integration
    """
    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "event": event
    }
    """

if __name__ == '__main__':
    hello('', '')
