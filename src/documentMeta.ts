interface DocumentMeta {
  title: string;
  description: string;
  path: string;
  robots?: string;
  canonical?: string | null;
  openGraphUrl?: string | null;
}

const SITE_URL = "https://ianmattas.com";
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large";

export function applyDocumentMeta({ title, description, path, robots, canonical, openGraphUrl }: DocumentMeta) {
  const previousTitle = document.title;
  const previous = new Map<Element, string | null>();
  const removed: Element[] = [];
  const updates: Array<[string, string, string]> = [
    ["meta", 'name="description"', description],
    ["meta", 'property="og:title"', title],
    ["meta", 'property="og:description"', description],
    ["meta", 'name="twitter:title"', title],
    ["meta", 'name="twitter:description"', description],
  ];
  if (openGraphUrl !== null) updates.push(["meta", 'property="og:url"', openGraphUrl ?? `${SITE_URL}${path}`]);
  if (canonical !== null) updates.push(["link", 'rel="canonical"', canonical ?? `${SITE_URL}${path}`]);
  updates.push(["meta", 'name="robots"', robots ?? DEFAULT_ROBOTS]);

  for (const [tag, attributes] of [
    ["meta", 'property="og:url"'],
    ["link", 'rel="canonical"'],
  ] as const) {
    const shouldRemove = (tag === "meta" && openGraphUrl === null) || (tag === "link" && canonical === null);
    if (!shouldRemove) continue;
    const element = document.head.querySelector(`${tag}[${attributes}]`);
    if (!element) continue;
    previous.set(element, element.getAttribute(tag === "link" ? "href" : "content"));
    removed.push(element);
    element.remove();
  }

  document.title = title;
  for (const [tag, attributes, content] of updates) {
    const element = document.head.querySelector(`${tag}[${attributes}]`);
    if (!element) continue;
    previous.set(element, element.getAttribute(tag === "link" ? "href" : "content"));
    element.setAttribute(tag === "link" ? "href" : "content", content);
  }

  return () => {
    document.title = previousTitle;
    for (const [element, value] of previous) {
      const attribute = element.tagName.toLowerCase() === "link" ? "href" : "content";
      if (value === null) element.removeAttribute(attribute);
      else element.setAttribute(attribute, value);
      if (!element.isConnected) document.head.appendChild(element);
    }
  };
}
