/**
 * Triggers a direct browser file download for a PDF URL without navigating
 * or simply displaying the PDF in a new tab.
 *
 * @param {string} url - The URL of the file to download
 * @param {string} filename - The name to save the file as
 */
export const downloadPdfFile = async (url, filename = "document.pdf") => {
  if (!url) return;

  const safeFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

  try {
    // 1. Fetch file as Blob to bypass browser's default inline PDF viewer
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = safeFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
  } catch (err) {
    console.warn("Direct blob download failed, trying attachment fallback:", err);

    // 2. Fallback: Append ImageKit ik-attachment parameter
    const separator = url.includes("?") ? "&" : "?";
    const attachmentUrl = url.includes("ik-attachment")
      ? url
      : `${url}${separator}ik-attachment=true`;

    const link = document.createElement("a");
    link.href = attachmentUrl;
    link.download = safeFilename;
    link.target = "_self";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

