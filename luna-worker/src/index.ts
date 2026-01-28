export interface Env {
	SUPABASE_URL: string;
	SUPABASE_SERVICE_ROLE_KEY: string;
	GITHUB_WEBHOOK_SECRET: string;
  }

  export default {
	async fetch(request: Request, env: Env): Promise<Response> {
	  const url = new URL(request.url);

	  // GET /health
	  if (url.pathname === "/health" && request.method === "GET") {
		return Response.json({ ok: true });
	  }

	  // POST /webhooks/github
	  if (url.pathname === "/webhooks/github" && request.method === "POST") {
		const bodyText = await request.text();

		// Verify GitHub signature
		const sig256 = request.headers.get("X-Hub-Signature-256") || "";
		const valid = await verifyGitHubSignature(bodyText, sig256, env.GITHUB_WEBHOOK_SECRET);
		if (!valid) return new Response("Invalid signature", { status: 401 });

		let payload: any;
		try {
		  payload = JSON.parse(bodyText);
		} catch {
		  return new Response("Invalid JSON", { status: 400 });
		}

		const deliveryId = request.headers.get("X-GitHub-Delivery") || "";
		const eventType = request.headers.get("X-GitHub-Event") || "unknown";

		// Some events have repository; installation events may not
		const githubRepoId: number | null = payload?.repository?.id ?? null;

		// Personal account installs still have "installation.account"
		const accountId: number | null =
		  payload?.installation?.account?.id ??
		  payload?.organization?.id ??
		  payload?.repository?.owner?.id ??
		  null;

		const accountLogin: string | null =
		  payload?.installation?.account?.login ??
		  payload?.organization?.login ??
		  payload?.repository?.owner?.login ??
		  null;

		// ---- If this is an installation event, upsert org + repos ----
		if (eventType === "installation" || eventType === "installation_repositories") {
		  if (accountId && accountLogin) {
			const orgId = await upsertOrg(env, accountId, accountLogin);

			// Repos can appear in different fields depending on event/action
			const repos: any[] =
			  payload?.repositories ??
			  payload?.repositories_added ??
			  payload?.installation?.repositories ??
			  [];

			for (const r of repos) {
			  const repo_id = r?.id;
			  const name = r?.full_name ?? r?.name;
			  if (repo_id && name) {
				await upsertRepo(env, {
				  github_repo_id: repo_id,
				  org_id: orgId,
				  name,
				  default_branch: "main",
				});
			  }
			}
		  }
		}

		// ---- Try to link webhook_events.repo_id (for events with a repository) ----
		let repoId: string | null = null;

		if (githubRepoId) {
		  // If we know the owner account, ensure org & repo exist
		  if (accountId && accountLogin) {
			const orgId = await upsertOrg(env, accountId, accountLogin);

			// Upsert repo using repository info if present
			const repoName = payload?.repository?.full_name ?? payload?.repository?.name ?? null;
			const defaultBranch = payload?.repository?.default_branch ?? "main";
			if (repoName) {
			  const upsertedRepoId = await upsertRepo(env, {
				github_repo_id: githubRepoId,
				org_id: orgId,
				name: repoName,
				default_branch: defaultBranch,
			  });
			  repoId = upsertedRepoId;
			} else {
			  // fallback: lookup
			  repoId = await findRepoIdByGithubRepoId(env, githubRepoId);
			}
		  } else {
			// no account info; just lookup
			repoId = await findRepoIdByGithubRepoId(env, githubRepoId);
		  }
		}

		// ---- Insert webhook event row ----
		const row = {
		  repo_id: repoId, // now linked when possible
		  delivery_id: deliveryId,
		  event_type: eventType,
		  github_repo_id: githubRepoId,
		  github_org_id: accountId,
		  raw_json: payload,
		};

		const res = await supabaseInsert(env, "webhook_events", row);
		if (!res.ok) {
		  const err = await res.text();
		  return new Response(`Supabase insert failed (${res.status}):\n${err}`, { status: 500 });
		}

		return Response.json({ ok: true });
	  }

	  return new Response("Not Found", { status: 404 });
	},
  };

  // -------------------- Supabase helpers --------------------

  async function supabaseInsert(env: Env, table: string, row: any): Promise<Response> {
	return fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
	  method: "POST",
	  headers: supabaseHeaders(env, { prefer: "return=minimal" }),
	  body: JSON.stringify([row]),
	});
  }

  function supabaseHeaders(env: Env, opts?: { prefer?: string }) {
	const h: Record<string, string> = {
	  "Content-Type": "application/json",
	  apikey: env.SUPABASE_SERVICE_ROLE_KEY,
	  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
	};
	if (opts?.prefer) h.Prefer = opts.prefer;
	return h;
  }

  // Upsert org by github_org_id, return org UUID
  async function upsertOrg(env: Env, githubOrgId: number, name: string): Promise<string> {
	const res = await fetch(`${env.SUPABASE_URL}/rest/v1/orgs?on_conflict=github_org_id`, {
	  method: "POST",
	  headers: supabaseHeaders(env, { prefer: "resolution=merge-duplicates,return=representation" }),
	  body: JSON.stringify([{ github_org_id: githubOrgId, name }]),
	});

	if (!res.ok) {
	  throw new Error(`org upsert failed: ${res.status} ${await res.text()}`);
	}

	const rows = (await res.json()) as any[];
	return rows[0].id as string;
  }

  // Upsert repo by github_repo_id, return repo UUID
  async function upsertRepo(env: Env, repo: {
	github_repo_id: number;
	org_id: string;
	name: string;
	default_branch: string;
  }): Promise<string> {
	const res = await fetch(`${env.SUPABASE_URL}/rest/v1/repos?on_conflict=github_repo_id`, {
	  method: "POST",
	  headers: supabaseHeaders(env, { prefer: "resolution=merge-duplicates,return=representation" }),
	  body: JSON.stringify([repo]),
	});

	if (!res.ok) {
	  throw new Error(`repo upsert failed: ${res.status} ${await res.text()}`);
	}

	const rows = (await res.json()) as any[];
	return rows[0].id as string;
  }

  // Lookup repo UUID by github_repo_id
  async function findRepoIdByGithubRepoId(env: Env, githubRepoId: number): Promise<string | null> {
	const url = `${env.SUPABASE_URL}/rest/v1/repos?github_repo_id=eq.${githubRepoId}&select=id&limit=1`;
	const res = await fetch(url, { headers: supabaseHeaders(env) });
	if (!res.ok) return null;
	const rows = (await res.json()) as any[];
	return rows?.[0]?.id ?? null;
  }

  // -------------------- GitHub signature verification --------------------

  async function verifyGitHubSignature(body: string, signature256: string, secret: string): Promise<boolean> {
	if (!signature256.startsWith("sha256=")) return false;
	const theirHex = signature256.slice("sha256=".length).trim();
	if (!theirHex) return false;

	const enc = new TextEncoder();

	const key = await crypto.subtle.importKey(
	  "raw",
	  enc.encode(secret),
	  { name: "HMAC", hash: "SHA-256" },
	  false,
	  ["sign"]
	);

	const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(body));
	const ourHex = bufToHex(sigBuf);

	return timingSafeEqualHex(ourHex, theirHex);
  }

  function bufToHex(buf: ArrayBuffer): string {
	const bytes = new Uint8Array(buf);
	let out = "";
	for (const b of bytes) out += b.toString(16).padStart(2, "0");
	return out;
  }

  function timingSafeEqualHex(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
  }
