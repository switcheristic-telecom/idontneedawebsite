console.log('Hello, world!');

// jQuery has been loaded

/***
 * EMAIL GENERATOR
 */
$.getJSON('/public/email-metadata.json', function (EMAIL_METADATA) {
  // sort by time in descending order
  EMAIL_METADATA = EMAIL_METADATA.sort((a, b) => {
    const aTime = a.Payload.Time;
    const bTime = b.Payload.Time;
    if (aTime < bTime) return 1;
    if (aTime > bTime) return -1;
    return 0;
  });
  // get id "email-container"
  const emailContainer = $('#email-container');
  for (const email of EMAIL_METADATA) {
    const emailDivClass =
      'max-w-3xl p-4 bg-gray-100 border-2 border-gray-200 rounded-lg shadow-md m-4';
    const emailDiv = $('<div class="email ' + emailDivClass + '"></div>');
    emailDiv.append(`<h2>${email.Payload.Subject}</h2>`);
    emailDiv.append(`<p>From: ${email.Payload.Sender.Address}</p>`);
    emailDiv.append(
      `<p>To: ${email.Payload.ToList.map((to) => to.Address).join(', ')}</p>`
    );
    emailDiv.append(
      `<p>Time: ${new Date(email.Payload.Time * 1000).toLocaleString()}</p>`
    );
    emailDiv.append(`<p>${email.Payload.Size} bytes</p>`);
    emailDiv.append(`<p>${email.Payload.NumAttachments} attachments</p>`);

    const emailIFrameDivClass = 'bg-white';
    const emailIFrameDiv = $('<div class="' + emailIFrameDivClass + '"></div>');
    const emailUrl = `/public/emails/${email.Payload.ID}.html`;
    const emailIframe = $(
      `<iframe src="${emailUrl}" width="100%" height="500px" frameborder="0"></iframe>`
    );
    emailIFrameDiv.append(emailIframe);
    emailDiv.append(emailIFrameDiv);

    emailContainer.append(emailDiv);
  }
});

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
