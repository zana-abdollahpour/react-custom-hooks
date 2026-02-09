import { useEffect } from "react";

export function useFavicon(url: string) {
  useEffect(() => {
    const link = document.head.querySelector(
      `link[rel~="icon"]`,
    ) as HTMLLinkElement;

    if (link) {
      link.href = url;
    } else {
      const newLink = document.createElement("link");
      newLink.href = url;
      newLink.rel = "icon";
      newLink.type = "image/x-icon";
      document.head.appendChild(newLink);
    }
  }, [url]);
}
