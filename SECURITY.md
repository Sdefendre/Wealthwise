# Security Policy

## Supported Versions

Only the latest commit on the `main` branch is supported with security updates.

| Branch / Version | Supported |
| --- | --- |
| `main` | Yes |
| Older commits / forks | No |

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues.

Instead, report them privately using one of the following channels:

1. **GitHub Private Vulnerability Reporting** (preferred): open a private advisory via the repository's **Security** tab -> **Report a vulnerability**.
2. **Email**: send details to [steve@defendresolutions.com](mailto:steve@defendresolutions.com).

Please include a clear description of the issue, steps to reproduce it, affected files or endpoints, and any suggested remediation. We will acknowledge receipt and coordinate a fix before public disclosure.

## Financial Statements and Sensitive Data

WealthWise parses bank statements (CSV and PDF exports) and connects to external services via environment variables.

- **Never** attach real bank statements, transaction exports, account numbers, API keys, database connection strings, or `.env` files to GitHub issues, pull requests, or vulnerability reports.
- When reproducing bugs or sharing examples, use fake or fully redacted data (such as `fixtures/sample-statement.csv`).
