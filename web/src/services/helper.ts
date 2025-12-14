import { ApiError } from "./api";

export type ValidationErrorPayload = {
    error: "VALIDATION_ERROR";
    message?: string;
    fieldErrors?: Record<string, string[]>;
    formErrors?: string[];
};

function isValidationErrorPayload(data: unknown): data is ValidationErrorPayload {
    if (!data || typeof data !== "object") return false;
    return (data as any).error === "VALIDATION_ERROR";
}

function setText(id: string, message: string) {
    const el = document.getElementById(id) as HTMLElement | null;
    if (!el) return;
    el.textContent = message;
    el.classList.remove("hidden");
}

function clearText(id: string) {
    const el = document.getElementById(id) as HTMLElement | null;
    if (!el) return;
    el.textContent = "";
    // optionnel: si tu utilises hidden dans ton HTML
    // el.classList.add("hidden");
}

/**
 * Convention HTML:
 * - erreurs champs : id="error-<field>"  (ex: error-email, error-passwordConfirm)
 * - erreur globale : id="error-global"
 */
export function clearFormErrors(fieldNames: string[], globalId = "error-global") {
    for (const name of fieldNames) clearText(`error-${name}`);
    clearText(globalId);
}

export function applyFormApiError(
    err: unknown,
    opts: {
        fieldNames: string[];
        globalId?: string;
        // si ton backend renvoie des noms différents de tes ids HTML
        fieldMap?: Record<string, string>;
    }
): boolean {
    const globalId = opts.globalId ?? "error-global";
    const fieldMap = opts.fieldMap ?? {};

    if (!(err instanceof ApiError)) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        setText(globalId, msg);
        return true;
    }

    const data = err.data;

    // Cas Zod standardisé
    if (isValidationErrorPayload(data)) {
        // erreurs globales (form)
        if (Array.isArray(data.formErrors) && data.formErrors.length > 0) {
            setText(globalId, data.formErrors[0]);
        }

        // erreurs par champ
        const fieldErrors = data.fieldErrors ?? {};
        for (const [field, messages] of Object.entries(fieldErrors)) {
            if (!Array.isArray(messages) || messages.length === 0) continue;

            const targetField = fieldMap[field] ?? field; // permet de remapper si besoin
            setText(`error-${targetField}`, messages[0]);
        }

        return true;
    }

    // Autres erreurs backend (409, 401, etc.)
    if (data && typeof data === "object") {
        const backendError = (data as any).error;
        const backendMessage = (data as any).message;
        if (typeof backendError === "string") {
            setText(globalId, backendError);
            return true;
        }
        if (typeof backendMessage === "string") {
            setText(globalId, backendMessage);
            return true;
        }
    }

    // fallback
    setText(globalId, err.message);
    return true;
}