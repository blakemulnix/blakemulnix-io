# Note: If this zone is being newly created, the name servers on the registered 
#      domain will need to be updated to point to the name servers provided by
#      the Route53 zone.
module "route53_zone_with_tls_cert" {
  source = "../modules/route53_zone_with_tls_cert"

  root_domain_name = "${var.root_domain_name}"
}

module "s3_static_site" {
  source = "../modules/s3_static_site"

  root_domain_name = "${var.root_domain_name}"
  www_domain_name = "${var.www_domain_name}"
}

resource "aws_route53_record" "root" {
  zone_id = "${module.route53_zone_with_tls_cert.zone_id}"
  name    = ""
  type    = "A"

  alias {
    name                   = "${module.cloudfront_distribution.root_domain_name}"
    zone_id                = "${module.cloudfront_distribution.root_hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = "${module.route53_zone_with_tls_cert.zone_id}"
  name    = "${var.www_domain_name}"
  type    = "A"

  alias {
    name                   = "${module.cloudfront_distribution.www_domain_name}"
    zone_id                = "${module.cloudfront_distribution.www_hosted_zone_id}"
    evaluate_target_health = false
  }
}
