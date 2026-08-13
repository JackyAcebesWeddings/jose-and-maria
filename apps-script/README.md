# RSVP backend — setup

`Code.gs` receives RSVP submissions from the wedding site and writes them into
a Google Sheet. No server, no cost, no third-party form service.

## One-time setup

1. **Create the Sheet.** New Google Sheet named e.g. `Jose & Maria — RSVP`.
2. **Add the script.** In that Sheet: **Extensions → Apps Script**. Delete the
   placeholder `myFunction`, paste in all of `Code.gs`, and save.
3. **Run `setup` once.** Pick `setup` from the function dropdown and press Run.
   Google will ask you to authorise the script — that is expected, it needs
   permission to write to your own Sheet. This creates:
   - a **`Responses`** tab with the header row, and
   - a **`Config`** tab with `A1` = "RSVP Deadline".
4. **Deploy.** **Deploy → New deployment → Web app**, then set:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**

   Copy the **Web app URL** it gives you.
5. **Connect the site.** In `index.html`, set:

   ```js
   var RSVP_ENDPOINT = 'PASTE_THE_WEB_APP_URL_HERE';
   ```

   Until this is filled in, a guest who submits is shown a message telling
   them to reply using the contact details on their invitation.
6. **Test it.** Submit a real RSVP on the site and confirm a row lands in
   `Responses`. Opening the Web app URL in a browser should show
   `{"result":"ok","service":"rsvp"}`.

## Setting the RSVP deadline

Type the deadline into **`Config!B1`** as a real date/time value — not text.
The script rejects anything arriving after it.

The couple can change this themselves at any time; no code change and no
redeploy needed. **Leave it blank to keep RSVPs open** — a blank or
mistyped cell fails *open* (replies still accepted) rather than locking
every guest out.

For a nicer guest experience, mirror the same date into `RSVP_DEADLINE` in
`index.html`, which hides the form once it passes. That is cosmetic only —
`Config!B1` is what actually accepts or rejects a submission.

> ⚠️ **Redeploy after editing the script.** Apps Script keeps serving the old
> version until you do **Deploy → Manage deployments → Edit → New version**.

## What gets recorded

| Column | Source |
|--------|--------|
| Timestamp | server time when the reply arrived |
| Name | `name` field |
| Attending | `Yes` / `No` |
| Guests | guest count (`0` when not attending) |
| Message | optional note |

## Notes

- **The endpoint is public by necessity.** A static site has to hold the URL in
  its JavaScript, so anyone viewing source can find it. That is unavoidable and
  is why the script validates everything: it requires a name and a valid
  attending value, trims and caps every field, caps the guest count, and
  enforces the deadline server-side.
- **Submissions are fire-and-forget.** Apps Script cannot return CORS headers a
  browser will read, so the site shows its thank-you message without waiting
  for a reply. A failure server-side is therefore invisible to the guest —
  check the `Responses` tab after testing.
- **Concurrency is handled.** A script lock stops two simultaneous replies from
  colliding on the same row.

## Not built — ask the couple first

Per `AGENTS.md` §8.2/§8.3 these need the couple's say-so:

- **Confirmation email to the guest** — needs an `email` field added to the
  form. Watch the `MailApp` quota (100/day on consumer Gmail).
- **Duplicate-submission guard** — upsert on a matching name instead of
  appending, so a guest who submits twice is not counted twice.
- **Admin summary** — a read-only headcount view so the couple is not reading
  the raw sheet.
