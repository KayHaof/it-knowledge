---
id: security-tls-certificate-rotation
type: interview-question
technology: Security
category: Security
difficulty: middle
topics:
  - TLS
  - certificates
  - mTLS
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
    - id: certificates
      required: true
      aliases:
        - certificates
      points:
        technicalCorrectness: 13
        completeness: 7
    - id: mtls
      required: false
      aliases:
        - mTLS
      points:
        technicalCorrectness: 13
        completeness: 6
  misconceptions:
    - id: common-wrong-answer
      patterns:
        - HTTPS đảm bảo server đã authorize user và certificate hết hạn không ảnh hưởng nếu encryption còn bật.
      penalty: 20
---

# TLS bảo vệ những thuộc tính nào và certificate rotation gây lỗi gì?

## Rubric

### Must Include

- TLS

- certificates

### Strong Answer Includes

- mTLS

## Câu trả lời 30 giây

TLS bảo vệ confidentiality/integrity khi truyền và xác thực endpoint qua certificate; nó không authorize business user. Rotation sai chain/hostname hoặc client pin cũ có thể làm outage.

## Câu trả lời chi tiết

Handshake thương lượng version/cipher và xác minh CA/SAN, sau đó mã hóa session key. mTLS thêm xác thực client nhưng cần lifecycle/identity mapping. Tự ký cert cần trust distribution và expiry monitoring; đừng tắt verification để chữa lỗi.

## Góc nhìn Production

Alert expiry, handshake error và trust-store drift; staged rotation với overlap.

## Trade-offs

Handshake thương lượng version/cipher và xác minh CA/SAN, sau đó mã hóa session key. mTLS thêm xác thực client nhưng cần lifecycle/identity mapping. Tự ký cert cần trust distribution và expiry monitoring; đừng tắt verification để chữa lỗi.

## Câu trả lời sai thường gặp

HTTPS đảm bảo server đã authorize user và certificate hết hạn không ảnh hưởng nếu encryption còn bật.

## Follow-up

- mTLS khác API key thế nào?

- Certificate pinning có trade-off gì?

## Nguồn chính thống

- [IETF / RFC Editor — RFC 8446 — The Transport Layer Security Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446.html)
- [IETF / RFC Editor — RFC 9525 — Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525.html)
- [OWASP — OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [Mozilla — MDN — Transport Layer Security](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security)
