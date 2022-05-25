# DynamoDB Local

## Summary

There are a few things you need to run DynamoDB locally on your machine:

1. Install and run DynamoDB locally (similar to installing Postgres on your machine)
2. Create a DynamoDB table within your local instance (similar to creating a database in Postgres once you are running it locally)
3. Point your application to your local DynamoDB endpoint along with your table you created within it

## Setting Up DynamoDB Locally for First Time

These steps simply set up a container running DynamoDB on your machine.
They do not have anything to do with creating tables in DynamoDB.

You only need to do this once per repository. It does not need to be done per application.

1. Visit [AWS's docs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html) for the latest set of info
2. Install [Docker Desktop (CASK) via Homebrew](https://formulae.brew.sh/cask/docker#default) by running `brew install --cask docker`
3. Start running Docker Desktop
4. Copy the `docker-compose.yaml` from Step 1 without making any modifications into the root directory of your entire repo (not per app).
5. From your repository run, run `docker-compose up -d`

## Starting DynamoDB Locally Normally

1. From your repository run, run `docker-compose up -d`

## Creating table for the first time

1. Create a YAML file somewhere within your application's folder (such as `apps/palmera/dynamo-table-definition.yaml`)
2. Copy this YAML file and set a proper table name:
```yaml
TableName: 'SET_TABLE_NAME_HERE'
AttributeDefinitions:
  - AttributeName: 'pk'
    AttributeType: S
  - AttributeName: 'sk'
    AttributeType: S
KeySchema:
  - AttributeName: 'pk'
    KeyType: HASH
  - AttributeName: 'sk'
    KeyType: RANGE
GlobalSecondaryIndexes:
  - IndexName: 'sk-pk-index'
    KeySchema:
      - AttributeName: 'sk'
        KeyType: HASH
      - AttributeName: 'pk'
        KeyType: RANGE
    Projection:
      ProjectionType: ALL
BillingMode: PAY_PER_REQUEST 
```
3. Change directory to your application folder
4. Run the following script in your terminal:
```
scriptDirectory=$(dirname "$0")
endpointUrl="http://localhost:8000"

yamlFilePath="file://${scriptDirectory}/dynamo-table-definition.yaml"

aws dynamodb create-table --cli-input-yaml "$yamlFilePath" --endpoint-url $endpointUrl
```
