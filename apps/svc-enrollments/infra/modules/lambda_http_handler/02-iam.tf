#region IAM for Lambda

data "aws_iam_policy_document" "lambda_policy" {
  version = "2012-10-17"

  statement {
    sid = "1"

    actions = [
      "dynamodb:Query",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
    ]

    effect = "Allow"

    resources = [
      var.enrollments_table_arn,
    ]
  }
}

data "aws_iam_policy_document" "lambda_policy2" {
  version = "2012-10-17"

  statement {
    sid = "2"

    actions = [
      "dynamodb:Query",
    ]

    effect = "Allow"

    resources = [
      "${var.enrollments_table_arn}/index/${var.list_person_enrollments_index_name}"
    ]
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${local.app_name}.${var.environment_name}.lambda-policy"

  role = aws_iam_role.lambda_exec.id

  policy = data.aws_iam_policy_document.lambda_policy.json
}

resource "aws_iam_role_policy" "lambda_policy2" {
  name = "${local.app_name}.${var.environment_name}.lambda-policy2"

  role = aws_iam_role.lambda_exec.id

  policy = data.aws_iam_policy_document.lambda_policy2.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  version = "2012-10-17"

  statement {
    sid    = ""
    effect = "Allow"

    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}


resource "aws_iam_role" "lambda_exec" {
  name = "${local.app_name}.${var.environment_name}.lambda-role"

  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

#endregion
