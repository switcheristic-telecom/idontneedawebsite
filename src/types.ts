export interface EmailAddress {
  Name: string;
  Address: string;
}

export interface EmailPayload {
  ID: string;
  Subject: string;
  Sender: EmailAddress;
  ToList: EmailAddress[];
  CCList: EmailAddress[];
  BCCList: EmailAddress[];
  ReplyTos: EmailAddress[];
  Time: number;
  Size: number;
  NumAttachments: number;
}

export interface EmailMetadata {
  ID: string;
  Payload: EmailPayload;
  Version: number;
}

export interface CallMetadata {
  phone: string;
  type: "Missed" | "Voicemail";
  time: string;
  hasAudio: boolean;
}
