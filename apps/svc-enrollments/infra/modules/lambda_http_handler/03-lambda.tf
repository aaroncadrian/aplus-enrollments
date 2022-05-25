#region Lambda Function

locals {
  nodejs_runtime = "nodejs14.x"
}

data "archive_file" "http_handler_zip" {
  type        = "zip"
  source_file = var.http_handler_source_file
  output_path = "${path.module}/http_handler.zip"
}

resource "aws_lambda_function" "http_handler" {
  function_name = "${local.app_name}_${var.environment_name}"

  handler          = "main.handler"
  filename         = data.archive_file.http_handler_zip.output_path
  source_code_hash = data.archive_file.http_handler_zip.output_base64sha256

  role = aws_iam_role.lambda_exec.arn

  runtime = local.nodejs_runtime

  environment {
    variables = {
      ENROLLMENTS_TABLE_NAME             = var.enrollments_table_name
      # TODO: Take gsi as variable
      LIST_PERSON_ENROLLMENTS_INDEX_NAME = "gsi1"
    }
  }
}

#endregion
