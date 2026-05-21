import { NextResponse } from "next/server";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  topic?: string;
  message?: string;
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (!data.name || !data.email || !data.message) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.CONTACT_TO ??
    "siddarathvats.ele17@gmail.com,vinayakvats.work@gmail.com";
  const from = process.env.CONTACT_FROM ?? "Vats Brothers <hello@vatsbrothers.com>";

  if (!apiKey) {
    console.log("[contact:stub]", data);
    return NextResponse.json({ ok: true, stub: true });
  }

  const subject = `vatsbrothers.com — ${data.topic ?? "Contact"} from ${data.name}`;
  const text = [
    `From: ${data.name} <${data.email}>`,
    data.company ? `Company: ${data.company}` : null,
    data.topic ? `Topic: ${data.topic}` : null,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[contact:resend_error]", res.status, body);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact:exception]", err);
    return NextResponse.json({ ok: false, error: "exception" }, { status: 500 });
  }
}
