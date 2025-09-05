import type { H3Event } from 'h3';

interface DocusignStatusResponse {
  ok: boolean;
  reason?: string;
  apiBase?: string;
  user?: string | null;
  accounts?: any[];
}

export default defineEventHandler(
  async (event: H3Event): Promise<DocusignStatusResponse> => {
    const access = getCookie(event, 'ds_access_token');
    const base   = getCookie(event, 'ds_api_base'); // like https://na2.docusign.net/restapi
    if (!access || !base) {
      return { ok: false, reason: 'No token/baseUri cookie. Hit /api/docusign/login first.' };
    }
    // Optional: call /userinfo to show who you are
    const authBase = useRuntimeConfig().docusign.authBaseUrl;
    const userInfo = await $fetch<any>(authBase + '/oauth/userinfo', {
      headers: { Authorization: `Bearer ${access}` }
    }).catch(() => null);

    return { ok: true, apiBase: base, user: userInfo?.name || null, accounts: userInfo?.accounts || [] };
  }
);
