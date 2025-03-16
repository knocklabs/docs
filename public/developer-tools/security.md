---
title: Security at Knock
description: Learn about our security policies.
section: Getting started
tags: ["compliance", "gdpr", "soc2", "soc 2", "hipaa", "hippa", "baa", "ccpa"]
---

Knock was built with security and privacy in mind from day one.

Below you can learn more about our security credentials, our internal security practices, and how to disclose security issues to our team. If you're looking to learn more about how we think about data privacy at Knock, you can read our [privacy policy](https://knock.app/legal/privacy-policy).

## Our security posture

Knock is SOC 2 Type 2 compliant, GDPR certified, CCPA, and HIPAA compliant. We perform regular penetration tests. If you'd like copies of our SOC 2 report or penetration test report, please let us know at [security@knock.app](mailto:security@knock.app). You can learn more about our GDPR certification in our [privacy policy](https://knock.app/legal/privacy-policy).

<div className="flex flex-row items-center justify-center space-x-4">
  <div>
    <Image
      src={"/images/21972-312_SOC_NonCPA.png"}
      alt="SOC2 Service Organization Logo"
      width={120}
      height={120}
    />
  </div>
  <div>
    <Image
      src={"/images/gdpr-badge-2.png"}
      alt="GDPR badge"
      width={120}
      height={120}
      className="self-center ml-2"
    />
  </div>
  <div>
    <Image
      src={"/images/hipaa-badge.png"}
      alt="HIPAA badge"
      width={120}
      height={120}
      className="self-center"
    />
  </div>
</div>

Here's a little more about our security practices at Knock:

- We implement best practices around least privilege, with limited access to production data for our employees.
- Access to all systems is enforced by 2FA for our employees.
- All of our code changes are signed off by at least one other person, and tested in a staging environment before being deployed.
- We retain server logs for a maximum of 1 year, after which time they are permanently deleted.
- We have regular third party penetration tests and infrastructure audits.
- All data is encrypted at rest, and we use TLS 1.2 for all cross-service communication.

## More information and responsible disclosure

We're always improving the security of our product. If you'd like to learn more about our data protection processes, you can email us at [security@knock.app](mailto:security@knock.app).

If you are a security researcher and would like to disclose an issue, contact [security@knock.app](mailto:security@knock.app). We are strong advocates for responsible disclosure by independent security researchers. We believe the best way to protect current and future customers is to encourage researchers to come forward with issues and reply promptly.

Our promise to you is:

- We will read and respond to all reported vulnerabilities.
- We will not take any harmful action (including legal action) against researchers who act ethically and in good faith.
- We will highlight the contributions of security researchers who make significant reports.

In return we ask:

- That you do not attempt to access, modify, or delete data belonging to Knock customers.
- That you report issues promptly once discovered.
- That you do not attempt denial of service against the Knock service.

<br />
