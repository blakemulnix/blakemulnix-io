output "zone_id" {
  value = "${aws_route53_zone.zone.id}"
}

output "certificate_arn" {
  value = "${aws_acm_certificate.certificate.arn}"
}