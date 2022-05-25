# Output value definitions

output "enrollments_table_name" {
  description = "Name of the Enrollments DynamoDB table."

  value = aws_dynamodb_table.enrollments_table.name
}


output "base_url" {
  description = "Base URL for API Gateway stage."

  value = aws_apigatewayv2_stage.http_api_default.invoke_url
}
