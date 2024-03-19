/***
 * EMAIL GENERATOR
 */
$.getJSON('/public/email-metadata.json', (emailMetadataList) => {
  processEmailMetadataList(emailMetadataList);
});

/**
 * @param {EmailMetadata[]} emailMetadataList
 */
function processEmailMetadataList(emailMetadataList) {
  // filter out emails that are not wanted
  emailMetadataList = emailMetadataList.filter((email) => {
    const IGNORE_SENDERS = ['proton.me'];
    const IGNORE_IDS = [
      'Tz3yiKX_ahgueIP-aI7S8B6DkFAWLcID3Dobp2_5LcFllv8dLSfkGewulUtXVGM9z2byXqyvob4hzvfWWc9jPw==', // first cloudflare email
    ];
    let ignore = false;
    for (const ignoreSender of IGNORE_SENDERS) {
      if (email.Payload.Sender.Address.includes(ignoreSender)) {
        ignore = true;
        break;
      }
    }
    for (const ignoreID of IGNORE_IDS) {
      if (email.Payload.ID.includes(ignoreID)) {
        ignore = true;
        break;
      }
    }
    return !ignore;
  });

  // sort by time in ascending order
  emailMetadataList = emailMetadataList.sort((a, b) => {
    const aTime = a.Payload.Time;
    const bTime = b.Payload.Time;
    if (aTime < bTime) return -1;
    if (aTime > bTime) return 1;
    return 0;
  });

  // get id "email-container"
  const emailContainer = $('#email-container');
  for (const email of emailMetadataList) {
    const emailDivClass =
      'px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg shadow-md mb-4 ';
    const emailDiv = $('<div class="email ' + emailDivClass + '"></div>');
    emailDiv.append(
      `<div class="flex justify-between items-center">
      <h2 class="text-lg font-bold">${email.Payload.Subject}</h2>
      <a class="text-blue-500 cursor-pointer" 
      onclick="window.open('/public/emails/${email.Payload.ID}.html', '_blank', 'height=600,width=960,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no');">
      Open
      </a>
      </div>`
    );
    emailDiv.append(`<p>From: ${email.Payload.Sender.Address}</p>`);
    if (email.Payload.ReplyTos.length > 0)
      emailDiv.append(
        `<p>Reply To: ${email.Payload.ReplyTos.map(
          (replyTo) => replyTo.Address
        ).join(', ')}</p>`
      );
    if (email.Payload.ToList.length > 0)
      emailDiv.append(
        `<p>To: ${email.Payload.ToList.map((to) => to.Address).join(', ')}</p>`
      );
    if (email.Payload.CCList.length > 0)
      emailDiv.append(
        `<p>CC: ${email.Payload.CCList.map((cc) => cc.Address).join(', ')}</p>`
      );
    if (email.Payload.BCCList.length > 0)
      emailDiv.append(
        `<p>BCC: ${email.Payload.BCCList.map((bcc) => bcc.Address).join(
          ', '
        )}</p>`
      );
    emailDiv.append(
      `<p>Time: ${new Date(email.Payload.Time * 1000).toLocaleString()}</p>`
    );

    // emailDiv.append(`<p>${email.Payload.Size} bytes</p>`);
    // emailDiv.append(`<p>${email.Payload.NumAttachments} attachments</p>`);

    const emailIFrameDivClass = 'bg-white border-2 shadow-inner';
    const emailIFrameDiv = $('<div class="' + emailIFrameDivClass + '"></div>');
    const emailUrl = `/public/emails/${email.Payload.ID}.html`;
    const emailIframeClass = 'w-full';
    const emailIframeStyle = 'max-height: 500px;';
    const emailIframe = $(
      `<iframe src="${emailUrl}" width="100%" height="360px" frameborder="0" class="${emailIframeClass}" style="${emailIframeStyle}"></iframe>`
    );
    emailIFrameDiv.append(emailIframe);
    emailDiv.append(emailIFrameDiv);

    emailContainer.append(emailDiv);
  }
}

/************************
 *******DEFINITIONS******
 *************************/

/**
 * Email Metadata representation.
 *
 * @typedef {Object} EmailMetadata
 *
 * @property {string} ID - The ID of the email.
 * @property {Payload} Payload - The payload of the email.
 * @property {number} Version - The version of the email.
 */

/**
 * Email Payload representation.
 * @typedef {Object} Payload
 * @property {string} ID - The ID of the email.
 * @property {string} Subject - The subject of the email.
 * @property {string} AddressID - The address ID of the email.
 * @property {Array<string>} LabelIDs - The label IDs of the email.
 * @property {string} ExternalID - The external ID of the email.
 * @property {string} Subject - The subject of the email.
 * @property {{Name: string, Address: string}} Sender - The sender of the email.
 * @property {Array<{Name: string, Address: string}>} ToList - The list of recipients of the email.
 * @property {Array<{Name: string, Address: string}>} CCList - The list of CC recipients of the email.
 * @property {Array<{Name: string, Address: string}>} BCCList - The list of BCC recipients of the email.
 * @property {Array<{Name: string, Address: string}>} ReplyTos - The list of reply to recipients of the email.
 * @property {number} Flags - The flags of the email.
 * @property {number} Time - The time of the email.
 * @property {number} Size - The size of the email.
 * @property {number} Unread - The unread status of the email.
 * @property {number} IsReplied - The replied status of the email.
 * @property {number} IsRepliedAll - The replied all status of the email.
 * @property {number} IsForwarded - The forwarded status of the email.
 * @property {number} NumAttachments - The number of attachments of the email.
 * @property {Array<{ID: string, Name: string, Size: number, MIMEType: string, Disposition: string, Headers: Object, KeyPackets: string, Signature: string}>} Attachments - The attachments of the email.
 * @property {string} MIMEType - The MIME type of the email.
 * @property {string} Headers - The headers of the email.
 * @property {number} WriterType - The writer type of the email.
 */
