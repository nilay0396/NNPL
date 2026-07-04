// Screenshot & content-tampering deterrence.
//
// HONEST DISCLAIMER: This is NOT true screenshot protection. No web page can
// prevent OS-level screenshot utilities (Windows Snipping Tool, macOS
// Cmd+Shift+4, mobile OS screenshots, or a camera pointed at the display).
// These handlers only raise the effort required to scrape / tamper with
// confidential content and act as strong deterrents.

let installed = false;
let toastEl = null;
let toastTimer = null;

const TOAST_MESSAGE =
    "Protected company material. Please request official documents via enquiry.";

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

// Do not fight the user inside admin dashboard / auth screens.
const isAdminRoute = () => {
    try {
        return (window.location.pathname || "").startsWith("/admin");
    } catch (_) {
        return false;
    }
};

export function installScreenshotShield() {
    if (installed || typeof window === "undefined") return;
    installed = true;

    // 1. Disable right-click context menu (allow on form fields for accessibility)
    window.addEventListener(
        "contextmenu",
        (e) => {
            if (isEditable(e.target) || isAdminRoute()) return;
            e.preventDefault();
            showToast();
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
                showToast();
            }
        },
        { capture: true }
    );

    // 4. Block common capture / save / devtools shortcuts (deterrent only)
    window.addEventListener(
        "keydown",
        (e) => {
            if (isAdminRoute()) return;
            const key = (e.key || "").toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey;
            // PrintScreen
            if (key === "printscreen") {
                triggerBlurOverlay();
                try {
                    navigator.clipboard && navigator.clipboard.writeText(" ");
                } catch (_) {}
                showToast();
                e.preventDefault();
                return;
            }
            // Ctrl/Cmd + S (save page), Ctrl/Cmd + P (print), Ctrl/Cmd + U (view source),
            // Ctrl/Cmd + Shift + I/J/C/S (devtools/screenshot), F12 (devtools).
            const blocked =
                (ctrl && (key === "s" || key === "p" || key === "u")) ||
                (ctrl && e.shiftKey && (key === "s" || key === "i" || key === "j" || key === "c")) ||
                key === "f12";
            if (blocked) {
                if (isEditable(e.target)) return;
                e.preventDefault();
                triggerBlurOverlay();
                showToast();
            }
        },
        { capture: true }
    );

    // 5. Blur the page when it loses focus. Print-screen / snipping tools on some
    //    systems briefly steal focus — blurring the DOM makes the captured frame less useful.
    const onBlur = () => {
        if (isAdminRoute()) return;
        document.documentElement.classList.add("nn-shield-blur");
    };
    const onFocus = () => document.documentElement.classList.remove("nn-shield-blur");
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) onBlur();
        else onFocus();
    });

    // 6. Very short-lived full-screen shield overlay used by keyboard triggers above
    ensureOverlay();
    ensureToast();
}

function ensureOverlay() {
    if (document.getElementById("nn-shield-overlay")) return;
    const el = document.createElement("div");
    el.id = "nn-shield-overlay";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:2147483646",
        "background:#0B192C",
        "opacity:0",
        "pointer-events:none",
        "transition:opacity 120ms ease",
    ].join(";");
    document.body.appendChild(el);
}

function ensureToast() {
    if (toastEl) return;
    const el = document.createElement("div");
    el.id = "nn-shield-toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("data-testid", "shield-toast");
    el.style.cssText = [
        "position:fixed",
        "left:50%",
        "bottom:28px",
        "transform:translateX(-50%) translateY(20px)",
        "z-index:2147483647",
        "max-width:min(92vw, 420px)",
        "padding:12px 18px",
        "background:#0B192C",
        "color:#fff",
        "font:500 13px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
        "letter-spacing:0.01em",
        "border:1px solid rgba(255,255,255,0.12)",
        "border-left:3px solid #047857",
        "box-shadow:0 12px 30px rgba(0,0,0,0.35)",
        "opacity:0",
        "pointer-events:none",
        "transition:opacity 220ms ease, transform 220ms ease",
        "text-align:left",
    ].join(";");
    el.textContent = TOAST_MESSAGE;
    document.body.appendChild(el);
    toastEl = el;
}

function showToast() {
    ensureToast();
    if (!toastEl) return;
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateX(-50%) translateY(0)";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        if (!toastEl) return;
        toastEl.style.opacity = "0";
        toastEl.style.transform = "translateX(-50%) translateY(20px)";
    }, 2400);
}

function triggerBlurOverlay() {
    const el = document.getElementById("nn-shield-overlay");
    if (!el) return;
    el.style.opacity = "1";
    setTimeout(() => {
        el.style.opacity = "0";
    }, 900);
}
