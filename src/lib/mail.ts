import { Resend } from "resend";
import { appendEmailLog, makeId } from "@/lib/booking/store";
import type { EmailLogTyp } from "@/lib/booking/types";

export type PosliMailArgs = {
  komu: string;
  predmet: string;
  html: string;
  text: string;
  typ: EmailLogTyp;
  rezervaceId: string;
};

export type PosliMailResult = {
  ok: boolean;
  prijemceOdeslano: string;
  resendId?: string;
  chyba?: string;
  zkusebni: boolean;
};

/**
 * Jediné místo, odkud se volá Resend.
 * Nikdy neshodí volající požadavek — chyby jen zaloguje.
 */
export async function posliMail(args: PosliMailArgs): Promise<PosliMailResult> {
  const testRedirect = process.env.TEST_REDIRECT_EMAIL?.trim();
  const zkusebni = Boolean(testRedirect);
  const prijemceOdeslano = zkusebni ? testRedirect! : args.komu.trim();
  const predmet = zkusebni
    ? `[ZKUŠEBNÍ → ${args.komu}] ${args.predmet}`
    : args.predmet;

  const bannerHtml = zkusebni
    ? `<div style="background:#f3f4f6;color:#4b5563;padding:10px 14px;font-size:13px;margin-bottom:16px;border-radius:6px;">Zkušební režim. Naostro by tento e-mail šel na <strong>${escapeHtml(args.komu)}</strong>.</div>`
    : "";
  const bannerText = zkusebni
    ? `Zkušební režim. Naostro by tento e-mail šel na ${args.komu}.\n\n`
    : "";

  const from =
    process.env.RESEND_FROM || "Masáže Niedoba <rezervace@azervera.com>";
  const replyTo = process.env.RESEND_REPLY_TO || undefined;
  const key = process.env.RESEND_API_KEY;

  let resendId: string | undefined;
  let chyba: string | undefined;
  let ok = false;

  if (!key) {
    chyba = "Chybí RESEND_API_KEY";
  } else if (!prijemceOdeslano) {
    chyba = "Chybí příjemce";
  } else {
    try {
      const resend = new Resend(key);
      const result = await resend.emails.send({
        from,
        to: prijemceOdeslano,
        replyTo,
        subject: predmet,
        html: `${bannerHtml}${args.html}`,
        text: `${bannerText}${args.text}`,
      });
      if (result.error) {
        chyba = result.error.message || "Resend vrátil chybu";
      } else {
        ok = true;
        resendId = result.data?.id;
      }
    } catch (err) {
      chyba = err instanceof Error ? err.message : "Odeslání selhalo";
      console.error("[mail] send failed", err);
    }
  }

  try {
    await appendEmailLog({
      id: makeId("elog"),
      rezervaceId: args.rezervaceId,
      typ: args.typ,
      prijemceSkutecny: args.komu,
      prijemceOdeslano,
      resendId,
      stav: ok ? "ok" : "chyba",
      chyba,
      odeslano: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[mail] emailLog write failed", err);
  }

  return { ok, prijemceOdeslano, resendId, chyba, zkusebni };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
