export function defaultAvatarDataUri(initial: string) {
  const safeInitial = (initial || "H").replace(/[^a-zA-Z]/g, "H").slice(0, 2);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4B2E83" stop-opacity="0.9"/>
        <stop offset="1" stop-color="#E8D3A2" stop-opacity="0.35"/>
      </linearGradient>
    </defs>
    <rect width="256" height="256" rx="128" fill="#050505"/>
    <circle cx="128" cy="128" r="108" fill="url(#g)" opacity="0.45"/>
    <circle cx="128" cy="128" r="108" fill="none" stroke="#E8D3A2" stroke-opacity="0.35" stroke-width="2"/>
    <text x="128" y="146" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
      font-size="72" font-weight="700" fill="#E8D3A2" letter-spacing="1">${safeInitial}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}
