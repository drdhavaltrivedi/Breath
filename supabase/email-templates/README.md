# Supabase email templates

Theme-aligned HTML for Supabase Auth emails.

## Confirm signup (`confirm-signup.html`)

1. Open **Supabase Dashboard** → **Authentication** → **Email Templates**.
2. Select **Confirm signup**.
3. **Subject** (example): `Verify your email – Breath`
4. **Body**: Copy the full contents of `confirm-signup.html` into the body field.
5. Save.

Variables used: `{{ .ConfirmationURL }}`, `{{ .Email }}`. Supabase replaces these when sending.
