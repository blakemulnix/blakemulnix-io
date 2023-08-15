provider "aws" {
  region = "us-east-1"
}

# Terraform S3 Backend config and resources
terraform {
  backend "s3" {
    bucket         = "terraform-state-pw-bmulnix"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-locking"
    encrypt        = true
  }
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "terraform-state-pw-bmulnix"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_s3_versioning" {
  bucket = aws_s3_bucket.terraform_state.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_s3_ecryption" {
  bucket = aws_s3_bucket.terraform_state.bucket
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-state-locking-pw"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

# TODO re-enter
# Game of life DNS record
# Type A
# Value s3-website-us-east-1.amazonaws.com.
# Alias Yes
# Routing Policy Simple

variable "www_domain_name" {
  type    = string
  default = "www.blakemulnix.io"
}

variable "root_domain_name" {
  type    = string
  default = "blakemulnix.io"
}

#
# ns-1100.awsdns-09.org.
# ns-1577.awsdns-05.co.uk.
# ns-376.awsdns-47.com.
# ns-656.awsdns-18.net.

# Static S3, CloudFront, Route 53 Website Infrastructure
resource "aws_acm_certificate" "certificate" {
  domain_name       = "${var.root_domain_name}"
  validation_method = "DNS"

  subject_alternative_names = ["*.${var.root_domain_name}"]
}

resource "aws_route53_zone" "zone" {
  name = var.root_domain_name
}

resource "aws_route53_record" "validation_records" {
  for_each = {
    for dvo in aws_acm_certificate.certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.zone.zone_id
}

# resource "aws_acm_certificate_validation" "certificate_validation" {
#   certificate_arn         = aws_acm_certificate.certificate.arn
#   validation_record_fqdns = [for record in aws_route53_record.validation_records : record.fqdn]
# }

# resource "aws_s3_bucket" "www" {
#   bucket = var.www_domain_name
# }

# resource "aws_s3_bucket_policy" "www_bucket_policy" {
#   bucket = aws_s3_bucket.www.id

#   policy = <<EOF
#   {
#     "Version":"2012-10-17",
#     "Statement":[
#       {
#         "Sid":"AddPerm",
#         "Effect":"Allow",
#         "Principal": "*",
#         "Action":["s3:GetObject"],
#         "Resource":["arn:aws:s3:::${var.www_domain_name}/*"]
#       }
#     ]
#   }
#   EOF
# }

# resource "aws_s3_bucket_ownership_controls" "www_bucket_ownership_control" {
#   bucket = aws_s3_bucket.www.id
#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
#   depends_on = [aws_s3_bucket_public_access_block.www_bucket_public_access_block]
# }

# resource "aws_s3_bucket_public_access_block" "www_bucket_public_access_block" {
#   bucket = aws_s3_bucket.www.id

#   block_public_acls       = false
#   block_public_policy     = false
#   ignore_public_acls      = false
#   restrict_public_buckets = false
# }

# resource "aws_s3_bucket_acl" "bucket_acl" {
#   depends_on = [
#     aws_s3_bucket_ownership_controls.www_bucket_ownership_control,
#     aws_s3_bucket_public_access_block.www_bucket_public_access_block,
#   ]

#   bucket = aws_s3_bucket.www.id
#   acl    = "public-read"
# }

# resource "aws_s3_bucket_website_configuration" "www_bucket_website_configuration" {
#   bucket = aws_s3_bucket.www.id

#   index_document {
#     suffix = "index.html"
#   }

#   error_document {
#     key = "error.html"
#   }
# }

# resource "aws_cloudfront_distribution" "www_distribution" {
#   origin {
#     custom_origin_config {
#       http_port              = "80"
#       https_port             = "443"
#       origin_protocol_policy = "http-only"
#       origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
#     }

#     domain_name = aws_s3_bucket_website_configuration.www_bucket_website_configuration.website_endpoint
#     origin_id   = var.www_domain_name
#   }

#   enabled             = true
#   default_root_object = "index.html"

#   default_cache_behavior {
#     viewer_protocol_policy = "redirect-to-https"
#     compress               = true
#     allowed_methods        = ["GET", "HEAD"]
#     cached_methods         = ["GET", "HEAD"]
#     target_origin_id       = var.www_domain_name
#     min_ttl                = 0
#     default_ttl            = 86400
#     max_ttl                = 31536000

#     forwarded_values {
#       query_string = false
#       cookies {
#         forward = "none"
#       }
#     }
#   }

#   aliases = ["${var.www_domain_name}"]

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

#   viewer_certificate {
#     acm_certificate_arn = aws_acm_certificate.certificate.arn
#     ssl_support_method  = "sni-only"
#   }
# }

# data "aws_route53_zone" "selected" {
#   name = var.root_domain_name
# }

# resource "aws_route53_record" "www" {
#   zone_id = data.aws_route53_zone.selected.zone_id
#   name    = var.www_domain_name
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.www_distribution.domain_name
#     zone_id                = aws_cloudfront_distribution.www_distribution.hosted_zone_id
#     evaluate_target_health = false
#   }
# }

# resource "aws_s3_bucket" "root" {
#   bucket = var.root_domain_name
# }

# resource "aws_s3_bucket_policy" "root_bucket_policy" {
#   bucket = aws_s3_bucket.root.id

#   policy = <<EOF
#   {
#     "Version":"2012-10-17",
#     "Statement":[
#       {
#         "Sid":"AddPerm",
#         "Effect":"Allow",
#         "Principal": "*",
#         "Action":["s3:GetObject"],
#         "Resource":["arn:aws:s3:::${var.root_domain_name}/*"]
#       }
#     ]
#   }
#   EOF
# }

# resource "aws_s3_bucket_ownership_controls" "root_bucket_ownership_control" {
#   bucket = aws_s3_bucket.root.id
#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
#   depends_on = [aws_s3_bucket_public_access_block.root_bucket_public_access_block]
# }

# resource "aws_s3_bucket_public_access_block" "root_bucket_public_access_block" {
#   bucket = aws_s3_bucket.root.id

#   block_public_acls       = false
#   block_public_policy     = false
#   ignore_public_acls      = false
#   restrict_public_buckets = false
# }

# resource "aws_s3_bucket_acl" "root_bucket_acl" {
#   depends_on = [
#     aws_s3_bucket_ownership_controls.root_bucket_ownership_control,
#     aws_s3_bucket_public_access_block.root_bucket_public_access_block,
#   ]

#   bucket = aws_s3_bucket.root.id
#   acl    = "public-read"
# }

# resource "aws_s3_bucket_website_configuration" "root_bucket_website_configuration" {
#   bucket = aws_s3_bucket.root.id

#   redirect_all_requests_to {
#     host_name = var.www_domain_name
#     protocol  = "https"
#   }
# }

# resource "aws_cloudfront_distribution" "root_distribution" {
#   origin {
#     custom_origin_config {
#       http_port              = "80"
#       https_port             = "443"
#       origin_protocol_policy = "http-only"
#       origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
#     }

#     domain_name = aws_s3_bucket_website_configuration.root_bucket_website_configuration.website_endpoint
#     origin_id   = var.root_domain_name
#   }

#   enabled             = true
#   default_root_object = "index.html"

#   default_cache_behavior {
#     viewer_protocol_policy = "redirect-to-https"
#     compress               = true
#     allowed_methods        = ["GET", "HEAD"]
#     cached_methods         = ["GET", "HEAD"]
#     target_origin_id       = var.root_domain_name
#     min_ttl                = 0
#     default_ttl            = 86400
#     max_ttl                = 31536000

#     forwarded_values {
#       query_string = false
#       cookies {
#         forward = "none"
#       }
#     }
#   }

#   aliases = ["${var.root_domain_name}"]

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

#   viewer_certificate {
#     acm_certificate_arn = aws_acm_certificate.certificate.arn
#     ssl_support_method  = "sni-only"
#   }
# }

# resource "aws_route53_record" "root" {
#   zone_id = data.aws_route53_zone.selected.zone_id
#   name    = ""
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.root_distribution.domain_name
#     zone_id                = aws_cloudfront_distribution.root_distribution.hosted_zone_id
#     evaluate_target_health = false
#   }
# }
