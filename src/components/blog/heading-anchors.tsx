"use client";

import * as React from "react";

/**
 * Progressive enhancement: finds every h2/h3 with an id inside the article
 * body and injects a "copy link" button next to it. Runs after the raw
 * HTML content has mounted, so it never touches the content string itself.
 */
export function HeadingAnchors({ containerId }: { containerId: string }) {
  React.useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const headings = container.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]");
    const cleanups: (() => void)[] = [];

    headings.forEach((heading) => {
      if (heading.querySelector("[data-heading-anchor]")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.headingAnchor = "true";
      button.setAttribute("aria-label", `Copy link to "${heading.textContent ?? "section"}"`);
      button.className =
        "ms-2 inline-flex h-6 w-6 shrink-0 -translate-y-0.5 items-center justify-center rounded-md align-middle text-muted-foreground opacity-0 transition-opacity hover:text-gold focus-visible:opacity-100 group-hover:opacity-100";
      button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

      heading.classList.add("group");
      heading.appendChild(button);

      const handleClick = async () => {
        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        try {
          await navigator.clipboard.writeText(url);
          const original = button.getAttribute("aria-label");
          button.setAttribute("aria-label", "Link copied");
          window.setTimeout(() => {
            if (original) button.setAttribute("aria-label", original);
          }, 1500);
        } catch {
          window.location.hash = heading.id;
        }
      };

      button.addEventListener("click", handleClick);
      cleanups.push(() => button.removeEventListener("click", handleClick));
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [containerId]);

  return null;
}
