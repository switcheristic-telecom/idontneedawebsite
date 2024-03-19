# Source: https://gist.github.com/amirasaran/cafe24da5b33a324972826556788d28b

import re
from email import parser, message
from email.header import decode_header


class EmlParser(object):
    def __init__(self, email: bytes):
        self.parsed = parser.BytesParser().parsebytes(email)

    def file_name_extractor(self, text):
        regex = r"filename=\"([^(\")]*)\""
        matches = re.search(regex, text)
        if matches:
            result = matches.groups()
            return self.decode_mime_words(result[0])
        return False

    def decode_mime_words(self, s):
        return "".join(
            word.decode(encoding or "utf8") if isinstance(word, bytes) else word
            for word, encoding in decode_header(s)
        )

    @property
    def html(self):
        html = self._html()
        return html.decode() if html else None

    def _html(self, parsed=None):
        if parsed is None:
            parsed = self.parsed
        if parsed.is_multipart():
            for item in parsed.get_payload():  # type:message.Message
                html = self._html(item)
                if html:
                    return html
        elif parsed.get_content_type() == "text/html":
            return parsed.get_payload(decode=True)
        return None

    @property
    def text(self):
        text = self._text()
        return text.decode() if text else None

    def _text(self, parsed=None):
        if parsed is None:
            parsed = self.parsed
        if parsed.is_multipart():
            for item in parsed.get_payload():  # type:message.Message
                text = self._text(item)
                if text:
                    return text
        elif parsed.get_content_type() == "text/plain":
            return parsed.get_payload(decode=True)
        return None

    def _list_attachments(self, parsed=None):
        attachments = []
        if parsed is None:
            parsed = self.parsed

        if parsed.is_multipart():
            for item in parsed.get_payload():  # type:message.Message
                data = self._list_attachments(item)
                if data:
                    attachments += data

        elif parsed.get_content_type().startswith("application/"):
            attachments.append(
                {
                    "content_type": parsed.get_content_type(),
                    "file_name": self.file_name_extractor(
                        parsed.get("Content-Disposition")
                    ),
                    "payload": parsed.get_payload(decode=True),
                }
            )
        return attachments

    @property
    def list_attachments(self):
        return self._list_attachments()

    def get_file_by_index(self, index):
        return self.list_attachments[index]
