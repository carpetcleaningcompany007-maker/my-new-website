const SHEET_NAME = "Sheet1";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = e && e.parameter ? e.parameter : {};
    const rooms = Math.max(0, Number(data.rooms || 0));
    const seats = Math.max(0, Number(data.upholstery_seats || 0));
    const carpetValue = rooms > 0 ? 75 + (Math.max(0, rooms - 1) * 45) : 0;
    const upholsteryValue = seats * 40;
    const serverEstimate = carpetValue + upholsteryValue;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.postcode || "",
      data.service || "",
      rooms,
      seats,
      serverEstimate,
      data.status || "New",
      data.actual_value || "",
      data.landing_area || "",
      data.landing_page || "",
      data.gclid || "",
      data.gbraid || "",
      data.wbraid || "",
      data.utm_source || "",
      data.utm_medium || "",
      data.utm_campaign || "",
      data.utm_term || "",
      data.utm_content || "",
      data.notes || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ok: true, estimated_value: serverEstimate}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ok: true, service: "Website Lead Value Test"}))
    .setMimeType(ContentService.MimeType.JSON);
}
