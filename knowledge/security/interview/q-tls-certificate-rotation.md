---
id: q-tls-certificate-rotation
type: interview-question
technology: Security
category: Security
difficulty: senior
topics:
  - TLS
  - PKI
  - certificate-rotation
relatedLessons:
  - tls-https-certificate-operations
sources:
  - title: RFC 8446 — The Transport Layer Security Protocol Version 1.3
    url: https://www.rfc-editor.org/rfc/rfc8446.html
    organization: IETF / RFC Editor
    type: standard
    accessedAt: 2026-09-02
  - title: RFC 9525 — Service Identity in TLS
    url: https://www.rfc-editor.org/rfc/rfc9525.html
    organization: IETF / RFC Editor
    type: standard
    accessedAt: 2026-09-02
  - title: OWASP Transport Layer Security Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html
    organization: OWASP
    type: standard
    accessedAt: 2026-09-02
  - title: MDN — Transport Layer Security
    url: https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security
    organization: Mozilla
    type: official-documentation
    accessedAt: 2026-09-02
rubric:
  dimensions:
    technicalCorrectness: 40
    completeness: 20
    reasoning: 15
    production: 10
    tradeoffs: 10
    communication: 5
  concepts:
    - id: tls
      required: true
      aliases:
        - TLS
      points:
        technicalCorrectness: 14
        completeness: 7
    - id: pki
      required: true
      aliases:
        - PKI
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: certificate-rotation
      required: false
      aliases:
        - certificate-rotation
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - Chỉ ghi đè certificate file trước ngày hết hạn; mọi process và client sẽ tự nhận ngay, không cần overlap hay handshake test.
      penalty: 20
---

# Bạn rotate TLS certificate không downtime như thế nào và kiểm chứng ở đâu?

## Rubric

### Must Include

- TLS

- PKI

### Strong Answer Includes

- certificate-rotation

## Câu trả lời 30 giây

Chuẩn bị certificate/key mới, validate identity/SAN/chain, phân phối an toàn, tạo overlap trust khi cần, reload từng endpoint và probe handshake thực tế. Monitor expiry/handshake errors; chỉ thu hồi old trust sau khi mọi client/server đã chuyển.

## Câu trả lời chi tiết

Tôi inventory mọi TLS termination hop: CDN/load balancer/ingress/service/egress và mTLS cả hai phía. Kiểm certificate chain, key match, EKU/SAN, hostname, clock và intermediate/root availability. Rollout canary rồi reload gracefully; long-lived connections có thể giữ session cũ nên cần quan sát reconnect. Với CA rotation, trust bundle thường mở rộng trước, rotate leaf/issuer sau, rồi contract old root cuối cùng.

## Deep Dive

Thay file trên disk không chứng minh process đã reload; health HTTP nội bộ cũng không chứng minh public SNI/chain đúng. TLS bảo vệ transport peer/channel, không thay object authorization.

## Góc nhìn Production

Alert expiry theo inventory, synthetic handshake từ nhiều network paths, metric protocol/cipher/verification failures và runbook rollback. Không log private key; test expired, wrong SAN, missing intermediate và clock skew.

## Trade-offs

Thay file trên disk không chứng minh process đã reload; health HTTP nội bộ cũng không chứng minh public SNI/chain đúng. TLS bảo vệ transport peer/channel, không thay object authorization.

## Câu trả lời sai thường gặp

Chỉ ghi đè certificate file trước ngày hết hạn; mọi process và client sẽ tự nhận ngay, không cần overlap hay handshake test.

## Follow-up

- CA rotation khác leaf rotation ở điểm nào?

- Vì sao HTTP health check có thể xanh khi TLS public đang hỏng?

## Nguồn chính thống

- [IETF / RFC Editor — RFC 8446 — The Transport Layer Security Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)
- [IETF / RFC Editor — RFC 9525 — Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525.html)
- [OWASP — OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [Mozilla — MDN — Transport Layer Security](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security)
