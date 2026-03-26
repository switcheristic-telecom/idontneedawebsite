import type { CallMetadata } from "../../types";
import { formatPhoneNumber } from "./utils";

const AREA_CODES: Record<string, string> = {
  "206": "Seattle, WA", "207": "Maine", "209": "Stockton, CA",
  "212": "New York, NY", "213": "Los Angeles, CA", "214": "Dallas, TX",
  "217": "Springfield, IL", "218": "Duluth, MN", "220": "Ohio",
  "224": "Chicago suburbs, IL", "231": "Muskegon, MI", "239": "Fort Myers, FL",
  "240": "Maryland", "250": "British Columbia, CA", "252": "Greenville, NC",
  "253": "Tacoma, WA", "254": "Killeen, TX", "267": "Philadelphia, PA",
  "302": "Delaware", "306": "Saskatchewan, CA", "315": "Syracuse, NY",
  "331": "Aurora, IL", "337": "Lafayette, LA", "346": "Houston, TX",
  "401": "Rhode Island", "407": "Orlando, FL", "410": "Baltimore, MD",
  "415": "San Francisco, CA", "448": "Philadelphia, PA", "469": "Dallas, TX",
  "470": "Atlanta, GA", "479": "Fort Smith, AR", "506": "New Brunswick, CA",
  "512": "Austin, TX", "520": "Tucson, AZ", "530": "Redding, CA",
  "539": "Tulsa, OK", "571": "Northern Virginia", "585": "Rochester, NY",
  "586": "Warren, MI", "601": "Jackson, MS", "602": "Phoenix, AZ",
  "607": "Binghamton, NY", "609": "Trenton, NJ", "610": "Allentown, PA",
  "623": "Glendale, AZ", "646": "New York, NY", "650": "San Mateo, CA",
  "678": "Atlanta, GA", "680": "Syracuse, NY", "701": "North Dakota",
  "717": "Harrisburg, PA", "718": "New York, NY", "720": "Denver, CO",
  "727": "St. Petersburg, FL", "737": "Austin, TX", "760": "Oceanside, CA",
  "762": "Augusta, GA", "773": "Chicago, IL", "786": "Miami, FL",
  "806": "Lubbock, TX", "817": "Fort Worth, TX", "847": "Elgin, IL",
  "857": "Boston, MA", "858": "San Diego, CA", "872": "Chicago, IL",
  "904": "Jacksonville, FL", "909": "San Bernardino, CA", "912": "Savannah, GA",
  "917": "New York, NY", "928": "Yuma, AZ", "929": "New York, NY",
};

function getAreaCodeInfo(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  const area = digits.length === 11 && digits[0] === "1" ? digits.slice(1, 4) : digits.slice(0, 3);
  return AREA_CODES[area] ?? null;
}

export function CallDetailPane({ call }: { call: CallMetadata }) {
  const formatted = formatPhoneNumber(call.phone);
  const areaInfo = getAreaCodeInfo(call.phone);
  const area = call.phone.replace(/\D/g, "").slice(1, 4);

  return (
    <div class="email-client-content">
      <div class="reading-header">
        <div class="subject-line">{formatted}</div>
        {areaInfo && (
          <div class="header-field-row">
            <span class="field-label">Area Code:</span>
            <span class="field-value">{area} — {areaInfo}</span>
          </div>
        )}
        <div class="header-field-row">
          <span class="field-label">Type:</span>
          <span class="field-value">{call.type === "Voicemail" ? "Voicemail" : "Missed Call"}</span>
        </div>
        <div class="header-field-row">
          <span class="field-label">Time:</span>
          <span class="field-value">{new Date(call.time).toLocaleString()}</span>
        </div>
        <div class="header-field-row">
          <span class="field-label">Call Back:</span>
          <span class="field-value">
            <a href={`tel:${call.phone}`} style={{ color: "#1a5794" }}>{formatted}</a>
          </span>
        </div>
      </div>
      <div class="reading-body" style={{ padding: "16px", color: "#666", fontSize: "12px" }}>
        {call.type === "Voicemail" && call.hasAudio ? (
          <p>
            A voicemail was left at this number. The audio was originally stored in
            Google Voice under <b>thanks.dont.need.a.website@gmail.com</b>, but
            Google has since deleted the account.
          </p>
        ) : (
          <p>No voicemail was left.</p>
        )}
      </div>
    </div>
  );
}
