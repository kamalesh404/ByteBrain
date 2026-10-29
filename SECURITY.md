# Security Policy

ByteBrain is committed to maintaining a secure, private environment for all users. Because ByteBrain processes documents and runs machine learning inference entirely on the client's local device, security considerations focus primarily on client-side safety, malicious file inputs, and asset integrity.

---

## Supported Versions

Only the latest commit on the `master` branch is actively supported with security fixes.

| Version | Supported |
| :--- | :--- |
| `master` (latest) | :white_check_mark: |
| Older commits | :x: |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues or public pull requests.**

If you discover a security vulnerability in ByteBrain, please report it privately through GitHub's Private Vulnerability Reporting:

1. Navigate to the [ByteBrain Security Advisories](https://github.com/kamalesh404/ByteBrain/security/advisories) tab.
2. Click **"Report a vulnerability"** to open a confidential draft advisory:
   [https://github.com/kamalesh404/ByteBrain/security/advisories/new](https://github.com/kamalesh404/ByteBrain/security/advisories/new)
3. Provide:
   - A detailed description of the vulnerability.
   - Proof of concept or reproduction steps.
   - An assessment of the potential impact.

If private vulnerability reporting is unavailable or inaccessible, contact the project maintainer via their verified GitHub profile: [@kamalesh404](https://github.com/kamalesh404).

---

## Scope & Client-Side Considerations

ByteBrain operates as a static client-side web application. Areas of security focus include:

- **Document Parsing Security:** Potential vulnerabilities in parsing untrusted PDFs (`pdfjs-dist`) or image decoding (`tesseract.js`).
- **Cross-Site Scripting (XSS):** Unsanitized rendering of markdown or model output in the chat interface.
- **Worker & Script Isolation:** Insecure cross-origin resource access or worker communication flaws.
- **Dependency Vulnerabilities:** Known Common Vulnerabilities and Exposures (CVEs) in third-party npm packages.

### Out of Scope
- Prompt injection or LLM "jailbreaks" that manipulate the conversational output within the user's own browser session without cross-origin impact or code execution.
- Denial of Service caused by exhausting local device GPU/VRAM through intentionally massive user prompts or files.
