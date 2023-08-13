# Steps for initializing Terraform S3 backend
# 1. Remove any existing state resources (delete S3 bucket and DynamoDB table)
#    from AWS console
# 2. Comment out terraform backend config
# 3. Use below S3 bucket, S3 versioning, DynamoDB table Terraform resources to 
#    create necessary infrastructure for backend
# 4. Run 'terraform init' to setup temporary local state
# 5. Reun 'terraform apply' to create resources for backend
# 6. Uncomment Terraform backend config
# 7. Run 'terraform init' once more to replace the existing local backend with
#    the newly created S3 backend
# 8. Remove existing local state files (terraform.tfstate and terraform.tfstate.backup)
#
# https://www.youtube.com/watch?v=FTgvgKT09qM

# Useful Terraform commands
# terraform init - initialize Terraform project
# terraform plan - show changes to be applied
# terraform apply - apply changes
# terraform destroy - destroy resources
# terraform show - show current state
# terraform output - show outputs
# terraform console - interactive console for Terraform interpolations
# terraform fmt - format Terraform files
# terraform validate - validate Terraform files
# terraform graph - generate visual representation of Terraform resources

provider "aws" {
  region = "us-east-1"
}

# Terraform S3 Backend config and resources
# terraform {
#   backend "s3" {
#     bucket         = "terraform-state-pw-bmulnix"
#     key            = "global/s3/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "terraform-state-locking"
#     encrypt        = true
#   }
# }

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