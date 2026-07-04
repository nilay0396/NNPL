// Screenshot & content-tampering deterrence.
//
// IMPORTANT: This is NOT true screenshot protection — no web page can prevent
// OS-level screenshot utilities (Windows Snipping Tool, macOS Cmd+Shift+4,
// mobile OS screenshots). These handlers only raise the effort required to
// scrape / tamper with confidential content and act as strong deterrents.

let installed = false;

const isEditable = (el) => {
    if (!el) return false;
    const t = el.tagName;
    return (
        t === "INPUT" ||
        t === "TEXTAREA" ||
        t === "SELECT" ||
        el.isContentEditable === true
    );
};

export function installScreenshotShield() {
    if (installed || typeof window === "undefined") return;
    installed = true;

    // 1. Disable right-click context menu (allow on form fields for accessibility)
    window.addEventListener(
        "contextmenu",
        (e) => {
            if (isEditable(e.target)) return;
            e.preventDefault();
        },
        { capture: true }
    );

    // 2. Disable drag on all images / dragging out to save
    window.addEventListener(
        "dragstart",
        (e) => {
            if (isEditable(e.target)) return;
            e.preventDefault();
        },
        { capture: true }
    );

    // 3. Disable text selection copy for sensitive shielded areas
    document.addEventListener(
        "copy",
        (e) => {
            const sel = window.getSelection && window.getSelection();
            const node = sel && sel.anchorNode;
            const container = node && (node.nodeType === 1 ? node : node.parentElement);
            if (container && container.closest && container.closest("[data-shield=\"on\"]")) {
                e.preventDefault();
            }
        },
        { capture: true }
    );

    // 4. Block common capture / save / devtools shortcuts (deterrent only)
    window.addEventListener(
        "keydown",
        (e) => {
            const key = (e.key || "").toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey;
            // PrintScreen
            if (key === "printscreen") {
                triggerBlurOverlay();
                try {
                    navigator.clipboard && navigator.clipboard.writeText(" ");
                } catch (_) {}
                e.preventDefault();
                return;
            }
            // Ctrl/Cmd + S (save page), Ctrl/Cmd + P (print), Ctrl/Cmd + Shift + S (screenshot),
            // Ctrl/Cmd + Shift + I / J (devtools), Ctrl/Cmd + U (view source), F12 (devtools)
            if (
                (ctrl && (key === "s" || key === "p" || key === "u")) ||
                (ctrl && e.shiftKey && (key === "s" || key === "i" || key === "j" || key === "c")) ||
                key === "f12"
            ) {
                if (isEditable(e.target)) return;
                e.preventDefault();
                triggerBlurOverlay();
            }
        },
        { capture: true }
    );

    // 5. Blur the page when it loses focus. Print-screen / snipping tools on some
    //    systems briefly steal focus — blurring the DOM makes the captured frame less useful.
    const onBlur = () => document.documentElement.classList.add("nn-shield-blur");
    const onFocus = () => document.documentElement.classList.remove("nn-shield-blur");
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) onBlur();
        else onFocus();
    });

    // 6. Very short-lived full-screen shield overlay used by keyboard triggers above
    ensureOverlay();
}

function ensureOverlay() {
    if (document.getElementById("nn-shield-overlay")) return;
    const el = document.createElement("div");
    el.id = "nn-shield-overlay";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:2147483647",
        "background:#0B192C",
        "opacity:0",
        "pointer-events:none",
        "transition:opacity 120ms ease",
    ].join(";");
    document.body.appendChild(el);
}

function triggerBlurOverlay() {
    const el = document.getElementById("nn-shield-overlay");
    if (!el) return;
    el.style.opacity = "1";
    setTimeout(() => {
        el.style.opacity = "0";
    }, 900);
}
