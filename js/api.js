const API_BASE = "http://localhost:9191/api";

export async function apiRequest(path, options = {}) {
    const config = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    };

    const response = await fetch(`${API_BASE}${path}`, config);
    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        const message =
            data?.mensaje ||
            data?.message ||
            data?.error ||
            (typeof data === "string" ? data : `Error HTTP ${response.status}`);
        throw new Error(message);
    }

    return data;
}

export function mostrarMensaje(elementId, message, type = "success") {
    const box = document.getElementById(elementId);
    if (!box) return;
    box.textContent = message;
    box.className = `message ${type}`;
}