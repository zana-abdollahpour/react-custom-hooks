import { useEffect, useState } from "react";

export function useDocumentTitle(newTitle: string) {
  const [title, setTitle] = useState(newTitle);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return { title, setTitle };
}
