export function AboutPane() {
  return (
    <div>
      {/* Email-style header - Outlook 2007 */}
      <div class="reading-header">
        <div class="subject-line">Welcome to idontneedawebsite.us &mdash; <span class="rainbow-text">Read Me First</span></div>
        <div class="header-field-row">
          <span class="field-label">From:</span>
          <span class="field-value">Webb Notneeded [idontneedawebsite@proton.me]</span>
        </div>
        <div class="header-field-row">
          <span class="field-label">Sent:</span>
          <span class="field-value">None</span>
        </div>
        <div class="header-field-row">
          <span class="field-label">To:</span>
          <span class="field-value">You [visitor@internet]</span>
        </div>
      </div>

      {/* Body */}
      <div class="about-body">
        {/* The real story */}
        <div class="about-callout">
          <span style={{ fontWeight: "bold" }}>The real story:</span>{" "}
          <a href="https://yufengzhao.com" target="_blank">Yufeng</a> bought{" "}
          <b>yufeng.us</b> in 2024 for its surprisingly cheap $4.99/year
          price on Cloudflare and started getting spammed every day for
          nearly a year &mdash; even after he realized the contact info was
          public on WHOIS and changed to a fake identity. This site
          documents that experience.
        </div>

        <hr class="about-divider" />

        <div class="about-bio">
          <div class="about-bio-text">
            <span class="about-bio-title">
              I don't need a website
            </span>
            <br /><br />
            The .US country-code domain is managed by GoDaddy under contract
            with the National Telecommunications and Information Administration
            (NTIA), an agency of the U.S. Department of Commerce.<sup><a href="#ref-1">1</a></sup> In 2005,
            the U.S. government banned WHOIS privacy on all .US
            domains &mdash; without public comment.<sup><a href="#ref-2">2</a></sup> Every registrant's name,
            address, phone number, and email is exposed to anyone who runs
            a WHOIS lookup. Almost every other domain extension allows privacy
            redaction; .US is the notable exception.
          </div>
        </div>

        <p>
          The result is a worst-of-both-worlds situation: legitimate
          registrants are fully exposed, while the policy does nothing to
          stop abuse. An Interisle Consulting study found over 30,000
          phishing domains on .US in a single year &mdash; at least 109
          of which targeted the U.S. government itself.<sup><a href="#ref-1">1</a></sup> Nexus verification
          (the requirement that registrants have a connection to the U.S.)
          is effectively a pre-checked dropdown box.<sup><a href="#ref-1">1</a></sup>
        </p>

        <p>
          To document this problem, a new domain was registered:{" "}
          <b>idontneedawebsite.us</b>, with a fresh ProtonMail email address
          and a Google Voice phone number. The WHOIS contact was left fully
          exposed. The spam started within hours.
        </p>

        <p style={{ marginBottom: "12px" }}>
          Below you will see the journey of a fictional man, by the name of{" "}
          <b>Webb Notneeded</b>. He represents this experiment &mdash; every
          email and phone call in this inbox is real spam, received by his
          publicly listed contact information.
        </p>

        <p style={{ marginBottom: "6px", fontWeight: "bold" }}>
          WHOIS Record for idontneedawebsite.us{" "}
          <a href="https://lookup.icann.org/en/lookup?name=idontneedawebsite.us" target="_blank" style={{ fontWeight: "normal", fontSize: "11px" }}>
            (look it up yourself)
          </a>
        </p>

        <div class="whois-box">
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

        <p style={{ marginBottom: "6px", fontWeight: "bold" }}>
          References
        </p>
        <ol class="about-references">
          <li id="ref-1">
            <a href="https://krebsonsecurity.com/2023/09/why-is-us-being-used-to-phish-so-many-of-us/" target="_blank">
              Why is .US Being Used to Phish So Many of Us?
            </a>{" "}&mdash; Krebs on Security, 2023
          </li>
          <li id="ref-2">
            <a href="https://domainnamewire.com/2022/04/20/reminder-theres-no-whois-privacy-for-us-domain-names/" target="_blank">
              Reminder: there's no Whois privacy for .us domain names
            </a>{" "}&mdash; Domain Name Wire, 2022
          </li>
          <li id="ref-3">
            <a href="https://krebsonsecurity.com/2018/03/who-is-afraid-of-more-spams-and-scams/" target="_blank">
              Who Is Afraid of More Spams and Scams?
            </a>{" "}&mdash; Krebs on Security, 2018
          </li>
        </ol>

        <p class="about-footer">
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
