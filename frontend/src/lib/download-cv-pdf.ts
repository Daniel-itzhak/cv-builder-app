/**
 * Export the CV as a real text PDF via the browser print engine.
 * This matches original CVs in quality/size (vector text + fonts), unlike
 * html2canvas raster capture which produces large blurry image PDFs.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const safeTitle = filename.trim() || "CV";

  await new Promise<void>((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc) {
      iframe.remove();
      reject(new Error("Could not open print view"));
      return;
    }

    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = "210mm";
    clone.style.height = "297mm";
    clone.style.minHeight = "297mm";
    clone.style.maxHeight = "297mm";
    clone.style.overflow = "hidden";
    clone.style.boxShadow = "none";
    clone.style.margin = "0";

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(safeTitle)}</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    * { box-sizing: border-box; }
    a { color: inherit; }
  </style>
</head>
<body></body>
</html>`);
    doc.close();

    doc.body.appendChild(clone);

    const cleanup = () => {
      win.removeEventListener("afterprint", onAfterPrint);
      iframe.remove();
      resolve();
    };

    const onAfterPrint = () => cleanup();

    win.addEventListener("afterprint", onAfterPrint);

    // Wait for layout/fonts/SVGs to settle, then open the system print dialog.
    // Choose "Save as PDF" as the destination for a sharp ~200–300KB text PDF.
    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
        // Fallback if afterprint never fires (some browsers).
        window.setTimeout(cleanup, 60_000);
      } catch (err) {
        cleanup();
        reject(err instanceof Error ? err : new Error("Print failed"));
      }
    }, 250);
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
