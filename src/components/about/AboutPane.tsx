const REFERENCES = [
  { key: "krebs-2018", title: "Who Is Afraid of More Spams and Scams?", source: "Krebs on Security, 2018", url: "https://krebsonsecurity.com/2018/03/who-is-afraid-of-more-spams-and-scams/" },
  { key: "krebs-2023", title: "Why is .US Being Used to Phish So Many of Us?", source: "Krebs on Security, 2023", url: "https://krebsonsecurity.com/2023/09/why-is-us-being-used-to-phish-so-many-of-us/" },
  { key: "ntia-2019", title: "Neustar to Continue to Operate .us Country Code Top Level Domain", source: "NTIA, 2019", url: "https://www.ntia.gov/press-release/2019/neustar-continue-operate-us-country-code-top-level-domain" },
  { key: "wapo-2005", title: "Ruling on '.us' Domain Raises Privacy Issues", source: "Washington Post, 2005", url: "https://www.washingtonpost.com/wp-dyn/articles/A7251-2005Mar4.html" },
  { key: "hussachai-2024", title: "Read This Before Registering a .us Domain", source: "Huss Puripunpinyo, 2024", url: "https://hussachai.medium.com/read-this-before-registering-a-us-domain-ac614fb01087" },
] as const;

function Cite({ keys }: { keys: string | string[] }) {
  const keyArr = Array.isArray(keys) ? keys : [keys];
  return (
    <>
      {keyArr.map((k, i) => {
        const idx = REFERENCES.findIndex((r) => r.key === k);
        return (
          <sup key={k}>
            {i > 0 && ' '}
            <a href={`#ref-${k}`}>{idx + 1}</a>
          </sup>
        );
      })}
    </>
  );
}

export function AboutPane() {
  return (
    <div>
      {/* Email-style header - Outlook 2007 */}
      <div class='reading-header'>
        <div class='subject-line'>
          Not for .us &mdash; <span class='rainbow-text'>Read Me First</span>
        </div>
        <div class='header-field-row'>
          <span class='field-label'>From:</span>
          <span class='field-value'>
            Webb Notneeded [idontneedawebsite@proton.me]
          </span>
        </div>
        <div class='header-field-row'>
          <span class='field-label'>Sent:</span>
          <span class='field-value'>None</span>
        </div>
        <div class='header-field-row'>
          <span class='field-label'>To:</span>
          <span class='field-value'>You [visitor@internet]</span>
        </div>
      </div>

      {/* Body */}
      <div class='about-body'>
        {/* The real story */}
        <div class='about-callout'>
          If you register a .US domain, your full name, home address, phone
          number, and email are published in a public database. You cannot opt
          out. <b>idontneedawebsite.us</b> is an archive of what happens next. This inbox covers Jan 2024 – {__LATEST_EMAIL_DATE__}.
        </div>

        <hr class='about-divider' />

        <div class='about-bio'>
          <div class='about-bio-text'>
            <span class='about-bio-title'>I don't need a website</span>
            <br />
            <a href='https://yufengzhao.com' target='_blank'>
              Yufeng
            </a>{' '}
            registered <b>yufeng.us</b> in 2024. Within days, spam emails and
            robocalls started arriving at the contact information he had entered
            during registration. He changed the WHOIS record to a fake
            identity&mdash;but by then, data brokers and lead-generation
            scrapers had already harvested the original details. The spam never
            stopped.
            <Cite keys="krebs-2018" />{' '}
            So he registered <b>idontneedawebsite.us</b> under the fictional
            name <b>Webb Notneeded</b> to document everything that followed. The
            name is a reply to the spam itself: most of it is from companies
            offering web design and site-building services.
          </div>
        </div>

        <p>
          Everything in this inbox is real. The emails are real. The phone calls
          are real. They were all sent to a fictional identity, at an address
          listed in a public database by law.
        </p>

        <p>
          The .US domain is managed by GoDaddy Registry under contract with
          NTIA, an agency of the U.S. Department of Commerce.
          <Cite keys={["krebs-2023", "ntia-2019"]} />{' '}
          In 2005, the government banned WHOIS privacy on all .US domains,
          arguing that public registration data promotes accountability and
          deters abuse. No public comment period. No opt out.
          <Cite keys="wapo-2005" />{' '}
          Every registrant's name, address, phone number, and email is
          published. Almost every other domain extension allows privacy
          redaction. .US does not.
          <Cite keys="hussachai-2024" />
        </p>

        <p>
          The transparency has not deterred abuse. At $5.98 a year, .US is one
          of the cheapest domain extensions available&mdash;a magnet for
          throwaway phishing sites. An Interisle Consulting study found 30,000
          phishing domains registered on .US in a single year, at least 109
          targeting the U.S. Postal Service.
          <Cite keys="krebs-2023" />{' '}
          The nexus requirement, proof of a connection to the United States, is
          a pre-checked dropdown.
          <Cite keys="krebs-2023" />{' '}
          The policy exposes legitimate registrants while doing nothing to stop
          bad actors.
        </p>

        <p style={{ marginBottom: '12px' }}>
          NTIA's contract with GoDaddy Registry is up for renewal. If you
          believe .US registrants deserve the same privacy protections available
          on virtually every other domain extension, contact{' '}
          <a href='mailto:dotus@ntia.gov'>NTIA</a> or your{' '}
          <a
            href='https://www.house.gov/representatives/find-your-representative'
            target='_blank'
          >
            representative in Congress
          </a>
          .
        </p>

        <p style={{ marginBottom: '6px', fontWeight: 'bold' }}>
          WHOIS Record for idontneedawebsite.us{' '}
          <a
            href='https://lookup.icann.org/en/lookup?name=idontneedawebsite.us'
            target='_blank'
            style={{ fontWeight: 'normal', fontSize: '11px' }}
          >
            (verify)
          </a>
        </p>

        <div class='whois-box'>
          <div class='whois-prompt'>$ whois idontneedawebsite.us</div>
          <div class='whois-terminal'>
            {`Domain Name: IDONTNEEDAWEBSITE.US
Registrar: Cloudflare, Inc.
Creation Date: 2024-01-28T20:29:33Z

Registrant Name: `}
            <span class='whois-highlight'>Webb Notneeded</span>
            {`
Registrant Street: `}
            <span class='whois-highlight'>370 Jay Street</span>
            {`
Registrant City: `}
            <span class='whois-highlight'>Brooklyn</span>
            {`
Registrant State/Province: `}
            <span class='whois-highlight'>NY</span>
            {`
Registrant Postal Code: `}
            <span class='whois-highlight'>11201</span>
            {`
Registrant Country: `}
            <span class='whois-highlight'>US</span>
            {`
Registrant Phone: `}
            <span class='whois-highlight'>+1.9295152287</span>
            {`
Registrant Email: `}
            <span class='whois-highlight'>idontneedawebsite@proton.me</span>
            {`

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

        <p style={{ marginBottom: '6px', fontWeight: 'bold' }}>References</p>
        <ol class='about-references'>
          {REFERENCES.map((ref) => (
            <li id={`ref-${ref.key}`} key={ref.key}>
              <a href={ref.url} target='_blank'>
                {ref.title}
              </a>{' '}
              &mdash; {ref.source}
            </li>
          ))}
        </ol>

        <p class='about-footer'>
          A{' '}
          <a href='https://swtch.tel' target='_blank'>
            Switcheristic Telecommunications
          </a>{' '}
          project &middot; &copy; 2024&ndash;{__LATEST_EMAIL_YEAR__} Webb
          Notneeded
        </p>
      </div>
    </div>
  );
}
