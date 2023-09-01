output "root_distribution_id" {
  description = "The ID of the CloudFront distribution for the root domain."
  value = "${module.cloudfront_distribution.root_distribution_id}"
}

output "www_distribution_id" {
  description = "The ID of the CloudFront distribution for the www subdomain."
  value = "${module.cloudfront_distribution.www_distribution_id}"
}