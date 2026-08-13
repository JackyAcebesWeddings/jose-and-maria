/**
 * RSVP backend — Jose Marie Cotejo & Maria Ivy Orozco (28 December 2026)
 * https://jose-and-maria.jackyacebesweddings.com
 *
 * Paste this into the RSVP Google Sheet: Extensions → Apps Script.
 * Full setup steps are in the README beside this file.
 *
 * It expects exactly what the site's RSVP form posts:
 *   { name, attending: "Yes"|"No", guestCount, message }
 *
 * NOTE ON THE REQUEST SHAPE
 * The form posts with `mode: 'no-cors'`, so the browser sends the JSON as a
 * plain-text body and cannot read the reply. The return values below are for
 * debugging and for anything calling this directly — the site never sees them
 * and treats every submission as fire-and-forget.
 */

var RESPONSES_SHEET = 'Responses';
var CONFIG_SHEET = 'Config';
var HEADERS = ['Timestamp', 'Name', 'Attending', 'Guests', 'Message'];

// The endpoint has to be world-callable for a static site to reach it, so
// treat every field as hostile: trim it, cap it, and never trust the count.
var MAX_NAME = 120;
var MAX_MESSAGE = 1000;
var MAX_GUESTS = 10;

/**
 * Run this ONCE from the Apps Script editor before deploying.
 * Creates both tabs, the header row, and the deadline cell.
 */
function setup() {
  var responses = getResponsesSheet_();
  var config = getConfigSheet_();
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Ready. Responses: "' + responses.getName() + '", deadline cell: ' +
    config.getName() + '!B1', 'RSVP setup', 8);
}

/** Health check — open the deployment URL in a browser to confirm it is live.
 *  Deliberately returns no guest data. */
function doGet() {
  return json_({ result: 'ok', service: 'rsvp' });
}

function doPost(e) {
  // Two guests submitting at the same moment can otherwise land on the same
  // row and one reply is lost.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ result: 'busy' });
  }

  try {
    // Server-side deadline backstop. The site also hides the form past the
    // deadline, but that is trivially bypassed, so this is the real gate.
    var deadline = getDeadline_();
    if (deadline && new Date() > deadline) {
      return json_({ result: 'closed' });
    }

    var data = parseBody_(e);

    var name = clean_(data.name, MAX_NAME);
    if (!name) return json_({ result: 'error', reason: 'name required' });

    var attending = String(data.attending == null ? '' : data.attending).trim().toLowerCase();
    if (attending !== 'yes' && attending !== 'no') {
      return json_({ result: 'error', reason: 'attending required' });
    }
    attending = attending === 'yes' ? 'Yes' : 'No';

    var guests = attending === 'Yes' ? toCount_(data.guestCount) : 0;

    getResponsesSheet_().appendRow([
      new Date(),
      name,
      attending,
      guests,
      clean_(data.message, MAX_MESSAGE)
    ]);

    return json_({ result: 'success' });
  } catch (err) {
    console.error('RSVP submission failed: ' + err);
    return json_({ result: 'error' });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Config!B1 is the source of truth for the deadline, so the couple can change
 * it themselves without touching code or rebuilding the site.
 * Blank, text, or a missing tab all FAIL OPEN — better to accept a late reply
 * than to lock every guest out because of a typo in a cell.
 */
function getDeadline_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_SHEET);
  if (!sheet) return null;
  var value = sheet.getRange('B1').getValue();
  return value instanceof Date ? value : null;
}

function getResponsesSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(RESPONSES_SHEET);
  if (!sheet) sheet = ss.insertSheet(RESPONSES_SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(5, 420);
  }
  return sheet;
}

function getConfigSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_SHEET);
  if (!sheet) sheet = ss.insertSheet(CONFIG_SHEET);
  if (!sheet.getRange('A1').getValue()) {
    sheet.getRange('A1').setValue('RSVP Deadline');
    sheet.getRange('A1').setFontWeight('bold');
    sheet.getRange('B1').setNote(
      'Enter the deadline as a real date/time value (not text).\n' +
      'Leave blank to keep RSVPs open indefinitely.');
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 200);
  }
  return sheet;
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents) || {};
  } catch (err) {
    return {};
  }
}

function clean_(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

function toCount_(value) {
  var n = parseInt(value, 10);
  if (isNaN(n) || n < 1) return 1;
  return Math.min(n, MAX_GUESTS);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
