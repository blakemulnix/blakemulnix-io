variable "aws_acm_certificate_arn" {
  description = "The ARN of the ACM certificate to use for the CloudFront distribution"
  type        = string
}

variable "root_domain_name" {
  description = "The root domain name to use for the CloudFront distribution"
  type        = string
}

variable "www_domain_name" {
  description = "The www subdomain name to use for the CloudFront distribution"
  type        = string
}

variable "root_bucket_website_endpoint" {
  description = "The S3 bucket website endpoint for the root domain"
  type        = string
}

variable "www_bucket_website_endpoint" {
  description = "The S3 bucket website endpoint for the www subdomain"
  type        = string
}