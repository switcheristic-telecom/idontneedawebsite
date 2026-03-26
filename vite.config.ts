import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import fs from "fs";

function getLatestEmailDate(): string {
  const data = JSON.parse(
    fs.readFileSync("public/email-metadata.json", "utf-8")
  );
  const maxTime = Math.max(
    ...data.map((e: { Payload: { Time: number } }) => e.Payload.Time)
  );
  const date = new Date(maxTime * 1000);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export default defineConfig({
  plugins: [preact()],
  publicDir: "public",
  define: {
    __LATEST_EMAIL_DATE__: JSON.stringify(getLatestEmailDate()),
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
