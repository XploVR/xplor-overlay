// plugins/fairseas-undefined-guard.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Only run in the browser & in dev
  if (process.server || !import.meta.dev) return;

  const router = nuxtApp.$router;

  // 1) Guard route changes (e.g., back/forward or external pushes)
  router.beforeEach((to, from, next) => {
    if (to.path === '/fairseas/undefined') {
      const err = new Error('[fairseas] Navigation to /fairseas/undefined');
      // Loud + stack to pinpoint caller
      // eslint-disable-next-line no-console
      console.warn(
        '[fairseas] Blocked navigation → /fairseas/undefined',
        { from: from.fullPath, to: to.fullPath, query: to.query, hash: to.hash }
      );
      // eslint-disable-next-line no-console
      console.trace(err);

      // Soft landing: send them to a safe page
      return next('/fairseas');
    }
    next();
  });

  // 2) Monkey-patch router.push / router.replace to catch bad inputs at source
  (['push', 'replace'] as const).forEach((method) => {
    const original = router[method].bind(router);

    (router as any)[method] = (...args: any[]) => {
      try {
        const target = args[0];
        let path: string | undefined;

        if (typeof target === 'string') {
          path = target;
        } else if (target && typeof target === 'object') {
          if ('path' in target && typeof target.path === 'string') {
            path = target.path;
          } else {
            // Resolve complex locations (named routes, params, etc.)
            const resolved = router.resolve(target as any);
            path = resolved?.fullPath;
          }
        }

        if (path && path.replace(location.origin, '').includes('/fairseas/undefined')) {
          const err = new Error(`[fairseas] router.${method} called with /fairseas/undefined`);
          // eslint-disable-next-line no-console
          console.warn(`[fairseas] router.${method} invoked with suspect target:`, target);
          // eslint-disable-next-line no-console
          console.trace(err);
        }
      } catch {
        // swallow — we only care about logging
      }
      return original(...args);
    };
  });

  // 3) Optional: tiny console helper to manually flag anywhere
  //    window.fairseasWarn('/fairseas/undefined')
  (window as any).fairseasWarn = (path: string) => {
    if (path === '/fairseas/undefined') {
      const err = new Error('[fairseas] Manual flag: /fairseas/undefined');
      // eslint-disable-next-line no-console
      console.warn('[fairseas] Manual flag caught for /fairseas/undefined');
      // eslint-disable-next-line no-console
      console.trace(err);
    }
  };
});
