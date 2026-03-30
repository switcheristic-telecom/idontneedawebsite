const REFERENCES = [
  {
    key: 'krebs-2018',
    title: 'Who Is Afraid of More Spams and Scams?',
    source: 'Krebs on Security, 2018',
    url: 'https://krebsonsecurity.com/2018/03/who-is-afraid-of-more-spams-and-scams/',
  },
  {
    key: 'krebs-2023',
    title: 'Why is .US Being Used to Phish So Many of Us?',
    source: 'Krebs on Security, 2023',
    url: 'https://krebsonsecurity.com/2023/09/why-is-us-being-used-to-phish-so-many-of-us/',
  },
  {
    key: 'ntia-2019',
    title: 'Neustar to Continue to Operate .us Country Code Top Level Domain',
    source: 'NTIA, 2019',
    url: 'https://www.ntia.gov/press-release/2019/neustar-continue-operate-us-country-code-top-level-domain',
  },
  {
    key: 'wapo-2005',
    title: "Ruling on '.us' Domain Raises Privacy Issues",
    source: 'Washington Post, 2005',
    url: 'https://www.washingtonpost.com/wp-dyn/articles/A7251-2005Mar4.html',
  },
  {
    key: 'hussachai-2024',
    title: 'Read This Before Registering a .us Domain',
    source: 'Huss Puripunpinyo, 2024',
    url: 'https://hussachai.medium.com/read-this-before-registering-a-us-domain-ac614fb01087',
  },
] as const;

function Cite({ keys }: { keys: string | string[] }) {
  const keyArr = Array.isArray(keys) ? keys : [keys];
  return (
    <>
      {keyArr.map((k, i) => {
        const ref = REFERENCES.find((r) => r.key === k);
        const idx = REFERENCES.findIndex((r) => r.key === k);
        return (
          <sup key={k}>
            {i > 0 && ' '}
            <a href={ref?.url} target='_blank'>
              {idx + 1}
            </a>
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
          When you register a .US domain, your full name, home address, phone
          number, and email get published in a public database. No opt out.{' '}
          <b>idontneedawebsite.us</b> is just an archive of what happens next.
          This inbox covers Jan 2024 – {__LATEST_EMAIL_DATE__}.
        </div>

        <hr class='about-divider' />

        <div class='about-bio'>
          <div class='about-bio-text'>
            <span class='about-bio-title'>I don't need a website</span>
            <br />
            <a href='https://yufengzhao.com' target='_blank'>
              Yufeng
            </a>{' '}
            registered <b>yufeng.us</b> in 2024 because it was the cheapest
            domain on the market. Within days, spam emails and robocalls started
            rolling in&mdash;all sent to the contact info he'd typed during
            registration. He swapped the WHOIS record to a fake contact, but
            data brokers had already scraped the real one. The spam never
            stopped.
            <Cite keys='krebs-2018' /> So he registered{' '}
            <b>idontneedawebsite.us</b> under the name <b>Webb Notneeded</b> and
            started collecting everything that came in. The name is a nod to the
            spam itself&mdash;most of it is from companies trying to sell web
            design services.
          </div>
        </div>

        <p>
          Everything in this inbox is real. The emails, the phone calls, all of
          it&mdash;sent to a made-up person at an address the government
          publishes by law.
        </p>

        <p>
          The .US domain is run by GoDaddy Registry under contract with NTIA,
          part of the U.S. Department of Commerce.
          <Cite keys={['krebs-2023', 'ntia-2019']} /> Back in 2005, the
          government banned WHOIS privacy on .US domains. The idea was that
          public registration data would promote accountability. No public
          comment period, no opt out.
          <Cite keys='wapo-2005' /> Most domain extensions let you redact your
          info. .US doesn't.
          <Cite keys='hussachai-2024' />
        </p>

        <p>
          The kicker: it hasn't even stopped abuse. At $5.98 a year, .US is one
          of the cheapest domains you can get&mdash;so it's a favorite for
          throwaway phishing sites. One study found 30,000 phishing domains on
          .US in a single year, including at least 109 impersonating the U.S.
          Postal Service.
          <Cite keys='krebs-2023' /> The "nexus requirement" (proof you're
          connected to the U.S.) is literally a pre-checked dropdown.
          <Cite keys='krebs-2023' /> So the policy exposes real people while
          doing nothing about the bad actors. Cool.
        </p>

        <p style={{ marginBottom: '12px' }}>
          NTIA has opened competitive bidding to select a new .US registry
          operator, with a new contract award expected in 2026. If you think .US
          registrants should get the same privacy protections most other domains
          have, you can tell <a href='mailto:dotus@ntia.gov'>NTIA</a> or
          your{' '}
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
