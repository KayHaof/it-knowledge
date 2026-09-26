---
id: security
type: roadmap
title: Application và Delivery Security
description: Browser/API trust, OAuth2/OIDC/JWT, Spring enforcement và software supply chain.
steps:
  - lessonId: security-fundamentals
    note: Threat model, XSS, CSRF và injection.
  - lessonId: threat-modeling-web-api
    note: Assets, trust boundaries, abuse cases và mitigations.
  - lessonId: oauth2-oidc-jwt-security
    note: Authorization, authentication và tokens.
  - lessonId: tls-https-certificate-operations
    note: TLS identity, certificate chain, rotation và expiry drills.
  - lessonId: secrets-authorization-boundaries
    note: Secret lifecycle, workload identity và least privilege.
  - lessonId: spring-security-oauth2-jwt
    note: Resource Server validation.
  - lessonId: spring-security-policy-boundaries
    note: CORS, CSRF, authorization và tenant enforcement.
  - lessonId: spring-rest-validation-errors
    note: Input/error boundary.
  - lessonId: angular-api-contracts
    note: Browser credential và runtime trust.
  - lessonId: angular-security-xss-trusted-types
    note: Angular escaping, sanitization, CSP và Trusted Types.
  - lessonId: docker-production
    note: Image/user/secret surface.
  - lessonId: secure-cicd-supply-chain
    note: Protect source-to-deploy chain.
  - lessonId: technology-decision-evidence
    note: Security in architecture decisions.
---

# Application và Delivery Security

## Tổng quan

Browser/API trust, OAuth2/OIDC/JWT, Spring enforcement và software supply chain.

## Lộ trình

1. **security-fundamentals** — Threat model, XSS, CSRF và injection.

2. **threat-modeling-web-api** — Assets, trust boundaries, abuse cases và mitigations.

3. **oauth2-oidc-jwt-security** — Authorization, authentication và tokens.

4. **tls-https-certificate-operations** — TLS identity, certificate chain, rotation và expiry drills.

5. **secrets-authorization-boundaries** — Secret lifecycle, workload identity và least privilege.

6. **spring-security-oauth2-jwt** — Resource Server validation.

7. **spring-security-policy-boundaries** — CORS, CSRF, authorization và tenant enforcement.

8. **spring-rest-validation-errors** — Input/error boundary.

9. **angular-api-contracts** — Browser credential và runtime trust.

10. **angular-security-xss-trusted-types** — Angular escaping, sanitization, CSP và Trusted Types.

11. **docker-production** — Image/user/secret surface.

12. **secure-cicd-supply-chain** — Protect source-to-deploy chain.

13. **technology-decision-evidence** — Security in architecture decisions.
