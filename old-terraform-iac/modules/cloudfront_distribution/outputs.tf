output "root_distribution_id" {
  description = "The ID of the CloudFront distribution for the root domain."
  value = "${aws_cloudfront_distribution.root_distribution.id}"
}

output "www_distribution_id" {
  description = "The ID of the CloudFront distribution for the www subdomain."
  value = "${aws_cloudfront_distribution.www_distribution.id}"
}

output "root_domain_name" {
  description = "The domain name of the CloudFront distribution for the root domain."
  value = "${aws_cloudfront_distribution.root_distribution.domain_name}"
}

output "www_domain_name" {
  description = "The domain name of the CloudFront distribution for the www subdomain."
  value = "${aws_cloudfront_distribution.www_distribution.domain_name}"
}

output "root_hosted_zone_id" {
  description = "The Route 53 Hosted Zone ID for this distribution"
  value = "${aws_cloudfront_distribution.root_distribution.hosted_zone_id}"
}

output "www_hosted_zone_id" {
  description = "The Route 53 Hosted Zone ID for this distribution"
  value = "${aws_cloudfront_distribution.www_distribution.hosted_zone_id}"
}