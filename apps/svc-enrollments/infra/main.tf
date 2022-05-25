#region DynamoDB

resource "aws_dynamodb_table" "enrollments_table" {
  hash_key  = "pk"
  range_key = "sk"

  name = "${var.app_name}.${var.environment_name}.enrollments"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }
}

#endregion

#region Lambda HTTP Handler

module "svc_enrollments_http_handler" {
  source                   = "./modules/lambda_http_handler"
  http_handler_source_file = "${path.module}/../../../dist/apps/svc-enrollments/main.js"
  environment_name         = var.environment_name
  enrollments_table_arn    = aws_dynamodb_table.enrollments_table.arn
  enrollments_table_name   = aws_dynamodb_table.enrollments_table.name
}
#endregion

#region API Gateway

resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.app_name}.${var.environment_name}.http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "http_api_default" {
  api_id = aws_apigatewayv2_api.http_api.id

  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.http_api.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }
}

resource "aws_cloudwatch_log_group" "http_api" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.http_api.name}"

  retention_in_days = 30
}

#endregion

#region API Gateway Route/Integration

resource "aws_apigatewayv2_integration" "svc_function" {
  api_id = aws_apigatewayv2_api.http_api.id

  integration_uri    = module.svc_enrollments_http_handler.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "svc_function" {
  api_id = aws_apigatewayv2_api.http_api.id

  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.svc_function.id}"
}

resource "aws_lambda_permission" "api_gw_svc_function" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.svc_enrollments_http_handler.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

#endregion
