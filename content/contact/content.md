# Contact us

Use this form for questions about ohmyho.st, privacy, your rights or the Data Processing Agreement. Company is optional for individuals. Please do not include passwords, access tokens or unnecessary sensitive data.

For a bug, a failed deployment or a missing feature, ask your agent to report it instead; see [Support](https://docs.ohmyho.st/support).

<form id="contact-form" class="contact-form" method="post" action="/v1/contact-requests">
<label for="contact-name">Name</label><input id="contact-name" name="name" autocomplete="name" maxlength="120" required>
<label for="contact-email">Email</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required>
<label for="contact-company">Company (optional)</label><input id="contact-company" name="company" autocomplete="organization" maxlength="200">
<label for="contact-message">Your question or request</label><textarea id="contact-message" name="message" maxlength="8000" rows="7" required></textarea>
<p>We use these details to handle your request as described in our <a href="/privacy">Privacy notice</a>.</p>
<button id="contact-submit" class="btn nochev" type="submit">Send request</button>
</form>
<p id="contact-result" role="status" aria-live="polite"></p>

[Privacy](/privacy) · [Cookies](/cookies) · [DPA](/dpa)
