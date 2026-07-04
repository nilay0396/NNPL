// Robust file-download helper.
// Some CDNs / browsers ignore the HTML `download` attribute for PDFs and
// open the file inline. Fetching as a blob and triggering the download
// programmatically forces the browser to save the file with our filename.

export async function downloadFile(url, filename) {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Revoke after a tick so Safari has time to start the download
        setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
        return true;
    } catch (err) {
        // Last-resort fallback — open in a new tab so the user still gets the file
        window.open(url, "_blank", "noopener,noreferrer");
        return false;
    }
}

export function downloadBrochure(e) {
    if (e && e.preventDefault) e.preventDefault();
    return downloadFile("/brochure.pdf", "NNPL_Company_Profile_Brochure.pdf");
}
