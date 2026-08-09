const SHEET_NAME = "Lead Tracker";
const INTENT_SHEET_NAME = "Website Intent";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = e && e.parameter ? e.parameter : {};
    if (data.event_type === "website_intent" || data.event_type === "lead_contact_click") {
      const intentSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INTENT_SHEET_NAME);
      if (!intentSheet) throw new Error(`Sheet "${INTENT_SHEET_NAME}" was not found.`);
      const choiceLabels = {
        carpet: "Interested in carpet cleaning",
        upholstery: "Interested in upholstery cleaning",
        browsing: "Just browsing / here by accident"
      };
      const isContactClick = data.event_type === "lead_contact_click";
      const interaction = isContactClick ? "Contact button click" : "Visitor choice";
      const visitorChoice = isContactClick
        ? (data.contact_method === "call" ? "Call now clicked" : "Message us clicked")
        : (choiceLabels[data.visitor_intent] || data.visitor_intent || "Unknown choice");
      const classification = isContactClick
        ? "Click lead — contact details not supplied"
        : (data.visitor_intent === "browsing" ? "Browsing / accidental visit" : "Interested visitor");
      intentSheet.appendRow([
        new Date(),
        data.landing_area || "",
        data.landing_page || "",
        interaction,
        visitorChoice,
        classification,
        data.gclid || "",
        data.gbraid || "",
        data.wbraid || "",
        data.utm_source || "",
        data.utm_campaign || "",
        data.status || ""
      ]);
      return ContentService
        .createTextOutput(JSON.stringify({ok: true, routed_to: INTENT_SHEET_NAME}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const rooms = Math.max(0, Number(data.rooms || 0));
    const seats = Math.max(0, Number(data.upholstery_seats || 0));
    const carpetValue = rooms > 0 ? 75 + (Math.max(0, rooms - 1) * 45) : 0;
    const upholsteryValue = seats * 40;
    const serverEstimate = carpetValue + upholsteryValue;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" was not found.`);
    // Always write after the last genuinely used row. Looking only for an
    // empty timestamp can reuse a partially populated economics row and make
    // an older profitability note appear to belong to a new enquiry.
    const targetRow = sheet.getLastRow() + 1;
    if (targetRow > sheet.getMaxRows()) {
      sheet.insertRowsAfter(sheet.getMaxRows(), 1);
    }
    const cleanRow = sheet.getRange(targetRow, 1, 1, 39);
    cleanRow.clearContent();
    // Telephone numbers must be stored as text so UK leading zeroes survive.
    sheet.getRange(targetRow, 3).setNumberFormat("@");
    sheet.getRange(targetRow, 1, 1, 22).setValues([[
      new Date(),
      data.name || "",
      String(data.phone || "").trim(),
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
    ]]);
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
