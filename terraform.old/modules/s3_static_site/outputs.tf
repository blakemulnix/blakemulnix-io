output "www_bucket_website_endpoint" {
  value = "${aws_s3_bucket_website_configuration.www_bucket_website_configuration.website_endpoint}"
}

output "root_bucket_website_endpoint" {
  value = "${aws_s3_bucket_website_configuration.root_bucket_website_configuration.website_endpoint}"
}