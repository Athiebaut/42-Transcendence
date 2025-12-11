import { isAuthenticated } from "../../utils/auth";

type RefreshHandler = () => void;

let mounted = false;

function createButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "debug-auth-toggle";
  return button;
}

function updateLabel(button: HTMLButtonElement) {
  button.textContent = isAuthenticated() ? "Debug: Se déconnecter" : "Debug: Se connecter";
}

export function mountAuthDebugToggle(refresh: RefreshHandler) {
  if (mounted) return;
  mounted = true;

  const button = createButton();
  updateLabel(button);

  button.addEventListener("click", () => {
    if (isAuthenticated()) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", "debug-token");
    }
    updateLabel(button);
    refresh();
  });

  document.body.appendChild(button);
}
