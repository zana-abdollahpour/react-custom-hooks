import { useCallback, useState } from "react";

function oldSchoolCopy(text: string) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
}

export function useCopyToClipboard() {
  const [clipboardText, setClipboardText] = useState("");

  const copyToClipboard = useCallback((value: string) => {
    const handleCopy = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          navigator?.clipboard?.writeText(value);
        } else {
          throw new Error(
            "writeText not supported in the browser clipboard api.",
          );
        }
      } catch {
        oldSchoolCopy(value);
      } finally {
        setClipboardText(value);
      }
    };

    handleCopy();
  }, []);

  return [clipboardText, copyToClipboard];
}
