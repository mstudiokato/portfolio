// TYMCZASOWY endpoint diagnostyczny — weryfikuje parę KEYSTATIC_GITHUB_CLIENT_ID
// + KEYSTATIC_GITHUB_CLIENT_SECRET przez GitHub "Check a token"
// (POST /applications/{client_id}/token z Basic auth). NIE zużywa żadnego
// OAuth `code` — w body wysyłamy fikcyjny token. USUNĄĆ po zdiagnozowaniu.
//
// Dostęp tylko dla właściciela: wymaga ?key=<KEYSTATIC_SECRET> (tylko Ty znasz
// tę wartość). Zły/brak klucza → 404 (endpoint pozostaje ukryty).
// Nigdy nie zwraca wartości sekretów — tylko ich długości i werdykt GitHuba.

export const dynamic = "force-dynamic";

function trimmedEnv(name: string): string {
  return (process.env[name] ?? "").trim();
}

export async function GET(req: Request): Promise<Response> {
  const providedKey = new URL(req.url).searchParams.get("key") ?? "";
  const gate = trimmedEnv("KEYSTATIC_SECRET");

  // Brak sekretu w env albo zły klucz → udajemy, że endpointu nie ma.
  if (!gate || providedKey !== gate) {
    return new Response("Not Found", { status: 404 });
  }

  const clientId = trimmedEnv("KEYSTATIC_GITHUB_CLIENT_ID");
  const clientSecret = trimmedEnv("KEYSTATIC_GITHUB_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    return Response.json(
      {
        verdict: "BRAK_ENV",
        message:
          "Brak KEYSTATIC_GITHUB_CLIENT_ID lub KEYSTATIC_GITHUB_CLIENT_SECRET w środowisku Production.",
        clientIdLength: clientId.length,
        clientSecretLength: clientSecret.length,
      },
      { status: 200 },
    );
  }

  const url = `https://api.github.com/applications/${encodeURIComponent(clientId)}/token`;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  let githubStatus = 0;
  let githubBodySnippet = "";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "keystatic-creds-debug",
      },
      // Fikcyjny token — nie zużywa żadnego prawdziwego `code`.
      body: JSON.stringify({ access_token: "diagnostic-dummy-token-000000" }),
    });
    githubStatus = res.status;
    githubBodySnippet = (await res.text()).slice(0, 300);
  } catch (err) {
    return Response.json(
      {
        verdict: "FETCH_ERROR",
        message: "Połączenie z GitHub API nie powiodło się.",
        error: String(err),
      },
      { status: 200 },
    );
  }

  // 401 = Basic auth odrzucony → para client_id/secret jest ZŁA.
  // 404 / 422 / 200 = auth przeszło (zła jest tylko fikcyjna treść) → creds OK.
  let verdict: string;
  let message: string;
  if (githubStatus === 401) {
    verdict = "CREDS_INVALID";
    message =
      "client_id + client_secret NIE pasują do siebie / do aplikacji na GitHubie. " +
      "To jest przyczyna 'Authorization failed'. Wygeneruj nowy client_secret w TEJ aplikacji " +
      "i wklej do Vercela (Production) bez spacji/newline, potem redeploy.";
  } else if (
    githubStatus === 404 ||
    githubStatus === 422 ||
    githubStatus === 200
  ) {
    verdict = "CREDS_VALID";
    message =
      "Para client_id + client_secret jest POPRAWNA (Basic auth przeszedł; 404/422 dotyczy tylko " +
      "fikcyjnego tokenu). Przyczyna 'Authorization failed' leży gdzie indziej — daj znać, drążymy dalej.";
  } else {
    verdict = "NIEJEDNOZNACZNE";
    message = `Nieoczekiwany status ${githubStatus} z GitHub API — patrz githubBodySnippet.`;
  }

  return Response.json(
    {
      verdict,
      message,
      githubStatus,
      clientIdLength: clientId.length, // OAuth App ~20; GitHub App zaczyna się od "Iv"
      clientSecretLength: clientSecret.length, // OAuth App secret = 40 znaków hex
      githubBodySnippet,
      note: "Endpoint TYMCZASOWY — usuń po użyciu. Nie zużywa żadnego OAuth code.",
    },
    { status: 200 },
  );
}
