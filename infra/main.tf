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

# dig +noall +answer +ttlid ns blakemulnix.io

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