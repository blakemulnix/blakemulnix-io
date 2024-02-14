# www domain bucket
resource "aws_s3_bucket" "www" {
  bucket = "${var.www_domain_name}"
}

resource "aws_s3_bucket_policy" "www_bucket_policy" {
  bucket = aws_s3_bucket.www.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "AddPerm"
        Effect    = "Allow"
        Principal = "*"
        Action    = ["s3:GetObject"],
        Resource  = ["arn:aws:s3:::${var.www_domain_name}/*"]
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.www_bucket_public_access_block]
}

resource "aws_s3_bucket_ownership_controls" "www_bucket_ownership_control" {
  bucket = aws_s3_bucket.www.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
  depends_on = [aws_s3_bucket_public_access_block.www_bucket_public_access_block]
}

resource "aws_s3_bucket_public_access_block" "www_bucket_public_access_block" {
  bucket = aws_s3_bucket.www.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.www_bucket_ownership_control,
    aws_s3_bucket_public_access_block.www_bucket_public_access_block,
  ]

  bucket = aws_s3_bucket.www.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "www_bucket_website_configuration" {
  bucket = aws_s3_bucket.www.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# root domain bucket
resource "aws_s3_bucket" "root" {
  bucket = "${var.root_domain_name}"
}

resource "aws_s3_bucket_policy" "root_bucket_policy" {
  bucket = aws_s3_bucket.root.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "AddPerm"
        Effect    = "Allow"
        Principal = "*"
        Action    = ["s3:GetObject"],
        Resource  = ["arn:aws:s3:::${var.root_domain_name}/*"]
      }
    ]
  })

    depends_on = [aws_s3_bucket_public_access_block.root_bucket_public_access_block]
}

resource "aws_s3_bucket_ownership_controls" "root_bucket_ownership_control" {
  bucket = aws_s3_bucket.root.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
  depends_on = [aws_s3_bucket_public_access_block.root_bucket_public_access_block]
}

resource "aws_s3_bucket_public_access_block" "root_bucket_public_access_block" {
  bucket = aws_s3_bucket.root.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "root_bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.root_bucket_ownership_control,
    aws_s3_bucket_public_access_block.root_bucket_public_access_block,
  ]

  bucket = aws_s3_bucket.root.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "root_bucket_website_configuration" {
  bucket = aws_s3_bucket.root.id

  redirect_all_requests_to {
    host_name = "${var.www_domain_name}"
    protocol  = "https"
  }
}