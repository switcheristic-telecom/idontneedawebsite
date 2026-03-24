export function AboutWindow(_props: { windowId: string; props?: Record<string, unknown> }) {
  return (
    <div class="flex flex-col h-full bg-win-bg text-[11px] font-win overflow-auto win95-scroll p-3">
      <div class="flex gap-3 mb-3">
        <img
          src="/assets/webb-notneeded/DALL·E 2024-03-19 03.57.01 - Craft a hyperrealistic portrait of Mr. Webb Notneeded, now an experienced and wise entrepreneur in his late 50s. He sits with a refined grace at his c.webp"
          alt="Webb Notneeded"
          class="w-[100px] h-[100px] object-cover win95-inset"
        />
        <div>
          <h2 class="text-base font-bold mb-1">I don't need a website</h2>
          <p class="text-[11px] leading-relaxed">
            The .US domain's policy of not allowing privacy redaction is rooted
            in a concept of transparency and accountability, a legacy from when
            it was primarily used by government entities and schools.
          </p>
        </div>
      </div>

      <p class="mb-3 leading-relaxed">
        I registered my new business site with a .US domain, because it was the
        cheapest option of all the domains. Not knowing what the lack of privacy
        redaction on WHOIS implies, my personal information (full name, address,
        email, and phone number) had been exposed to the public. Immediately, I
        was bombarded with spam emails and phone calls, asking me if I needed to
        build a website / mobile app / SEO / marketing / etc.
      </p>

      <p class="mb-3 leading-relaxed">
        Below you see the journey of a fictional man, by the name of{" "}
        <b>Webb Notneeded</b>. He just bought the fantastic domain name of{" "}
        <b>idontneedawebsite.us</b>, with his ProtonMail email address and a
        Google Voice phone number. His story serves as an enlightening case
        study into the challenges and implications of the .US domain's policy on
        privacy redaction.
      </p>

      {/* WHOIS Record */}
      <div class="mb-3">
        <div class="font-bold mb-1">WHOIS Record for idontneedawebsite.us</div>
        <div class="win95-inset">
          <div class="bg-neutral-900 text-green-400 px-2 py-1 text-[10px] font-mono">
            $ whois idontneedawebsite.us
          </div>
          <pre class="bg-neutral-900 text-green-300 p-2 text-[10px] font-mono leading-relaxed overflow-auto max-h-[200px] win95-scroll">
{`Domain Name: IDONTNEEDAWEBSITE.US
Registrar: Cloudflare, Inc.
Creation Date: 2024-01-28T20:29:33Z

Registrant Name: Webb Notneeded
Registrant Street: 370 Jay Street
Registrant City: Brooklyn
Registrant State/Province: NY
Registrant Postal Code: 11201
Registrant Country: US
Registrant Phone: +1.9295152287
Registrant Email: idontneedawebsite@proton.me

Admin Name: Webb Notneeded
Admin Phone: +1.9295152287
Admin Email: idontneedawebsite@proton.me

Tech Name: Webb Notneeded
Tech Phone: +1.9295152287
Tech Email: idontneedawebsite@proton.me

Name Server: cartman.ns.cloudflare.com
Name Server: lilyana.ns.cloudflare.com
DNSSEC: unsigned`}
          </pre>
        </div>
      </div>

      {/* Footer */}
      <div class="text-center text-gray-600 mt-auto pt-2 border-t border-gray-400">
        A{" "}
        <a
          href="https://swtch.tel"
          target="_blank"
          class="text-blue-600 underline"
        >
          Switcheristic Telecommunications
        </a>{" "}
        project &middot; &copy; 2024 Webb Notneeded
      </div>
    </div>
  );
}
