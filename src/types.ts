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

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: "email-client" | "calendar" | "about" | "email-popup";
  props?: Record<string, unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}
