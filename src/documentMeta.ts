interface DocumentMeta {
  title: string;
  description: string;
  path: string;
  robots?: string;
}

const SITE_URL = "https://ianmattas.com";

export function applyDocumentMeta({ title, description, path, robots }: DocumentMeta) {
  const previousTitle = document.title;
  const previous = new Map<Element, string | null>();
  const updates: Array<[string, string, string]> = [
    ["meta", 'name="description"', description],
    ["meta", 'property="og:title"', title],
    ["meta", 'property="og:description"', description],
    ["meta", 'property="og:url"', `${SITE_URL}${path}`],
    ["meta", 'name="twitter:title"', title],
    ["meta", 'name="twitter:description"', description],
    ["link", 'rel="canonical"', `${SITE_URL}${path}`],
  ];
  if (robots) updates.push(["meta", 'name="robots"', robots]);

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
    }
  };
}
