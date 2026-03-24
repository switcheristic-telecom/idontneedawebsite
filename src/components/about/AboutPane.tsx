export function AboutPane() {
  return (
    <div>
      {/* Email-style header - Outlook 2007 */}
      <div class="reading-header">
        <div class="subject-line">Welcome to idontneedawebsite.us &mdash; Read Me First</div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "2px" }}>
          <span class="field-label">From:</span>
          <span class="field-value">Webb Notneeded [idontneedawebsite@proton.me]</span>
        </div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "2px" }}>
          <span class="field-label">Sent:</span>
          <span class="field-value">None</span>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <span class="field-label">To:</span>
          <span class="field-value">You [visitor@internet]</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px", fontSize: "12px", lineHeight: "1.7" }}>
        {/* The real story */}
        <div style={{
          background: "#fffff0",
          border: "1px solid #d4b830",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "2px",
          fontSize: "12px",
          lineHeight: "1.7",
        }}>
          <span style={{ fontWeight: "bold" }}>The real story:</span>{" "}
          <a href="https://yufengzhao.com" target="_blank">Yufeng</a> bought{" "}
          <b>yufeng.us</b> in 2024 for its surprisingly cheap $4.99/year
          price on Cloudflare and started getting spammed every day for
          nearly a year &mdash; even after he realized the contact info was
          public on WHOIS and changed to a fake identity. This site
          documents that experience.
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #d0dce8", margin: "12px 0" }} />

        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flexShrink: 0 }}>
            <img
              src="/assets/webb-notneeded/DALL·E 2024-03-19 03.57.01 - Craft a hyperrealistic portrait of Mr. Webb Notneeded, now an experienced and wise entrepreneur in his late 50s. He sits with a refined grace at his c.webp"
              alt="Webb Notneeded"
              width="100"
              height="100"
              style={{ objectFit: "cover", border: "1px solid #b8c8dc", borderRadius: "2px" }}
            />
          </div>
          <div style={{ fontSize: "12px", lineHeight: "1.7" }}>
            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#1e3a5f" }}>
              I don't need a website
            </span>
            <br /><br />
            The .US domain's policy of not allowing privacy redaction is
            rooted in a concept of transparency and accountability, a
            legacy from when it was primarily used by government entities
            and schools. This decision by NeuStar, the operator of .US
            domains, is based on the idea that users should be able to see
            who is responsible for a website.
          </div>
        </div>

        <p style={{ marginBottom: "8px" }}>
          To document this problem, a new domain was registered:{" "}
          <b>idontneedawebsite.us</b>, with a fresh ProtonMail email address
          and a Google Voice phone number. The WHOIS contact was left fully
          exposed. The spam started within hours.
        </p>

        <p style={{ marginBottom: "12px" }}>
          Below you will see the journey of a fictional man, by the name of{" "}
          <b>Webb Notneeded</b>. He represents this experiment &mdash; every
          email and phone call in this inbox is real spam, received by his
          publicly listed contact information. His story serves as a case
          study into the challenges and implications of the .US domain's
          policy on privacy redaction.
        </p>

        <p style={{ marginBottom: "6px", fontWeight: "bold" }}>
          WHOIS Record for idontneedawebsite.us
        </p>

        <div style={{ border: "1px solid #8db2e3", borderRadius: "2px", overflow: "hidden" }}>
          <div class="whois-prompt">$ whois idontneedawebsite.us</div>
          <div class="whois-terminal">
{`Domain Name: IDONTNEEDAWEBSITE.US
Registrar: Cloudflare, Inc.
Creation Date: 2024-01-28T20:29:33Z

Registrant Name: `}<span class="whois-highlight">Webb Notneeded</span>{`
Registrant Street: `}<span class="whois-highlight">370 Jay Street</span>{`
Registrant City: `}<span class="whois-highlight">Brooklyn</span>{`
Registrant State/Province: `}<span class="whois-highlight">NY</span>{`
Registrant Postal Code: `}<span class="whois-highlight">11201</span>{`
Registrant Country: `}<span class="whois-highlight">US</span>{`
Registrant Phone: `}<span class="whois-highlight">+1.9295152287</span>{`
Registrant Email: `}<span class="whois-highlight">idontneedawebsite@proton.me</span>{`

Admin Name: Webb Notneeded
Admin Phone: +1.9295152287
Admin Email: idontneedawebsite@proton.me

Tech Name: Webb Notneeded
Tech Phone: +1.9295152287
Tech Email: idontneedawebsite@proton.me

Name Server: cartman.ns.cloudflare.com
Name Server: lilyana.ns.cloudflare.com
DNSSEC: unsigned`}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#888", marginTop: "12px", borderTop: "1px solid #d0dce8", paddingTop: "8px" }}>
          A{" "}
          <a href="https://swtch.tel" target="_blank">
            Switcheristic Telecommunications
          </a>{" "}
          project &middot; &copy; 2024 Webb Notneeded
        </p>
      </div>
    </div>
  );
}
