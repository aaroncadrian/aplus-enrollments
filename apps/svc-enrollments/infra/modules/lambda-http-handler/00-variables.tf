variable "environment_name" {
  type        = string
  description = "The name of the deployment environment"
}

variable "enrollments_table_name" {
  type = string
}

variable "enrollments_table_arn" {
  type = string
}

variable "http_handler_source_file" {
  type = string
}
