import { isAuthenticated, logout } from "../../utils/auth";

// Plus besoin de RefreshHandler
let mounted = false;

function createButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "auth-toggle-btn";
  return button;
}

function updateButton(button: HTMLButtonElement) {
  const authenticated = isAuthenticated();
  
  if (authenticated) {
    button.textContent = "🦢 Se déconnecter";
    button.classList.add("is-logout");
  } else {
    button.textContent = "🔑 Se connecter";
    button.classList.remove("is-logout");
  }
}

// 🆕 Retirer le paramètre refresh
export function mountAuthDebugToggle() {
  if (mounted) return;
  mounted = true;

  const button = createButton();
  updateButton(button);

  button.addEventListener("click", async () => {
    if (isAuthenticated()) {
      if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
        button.disabled = true;
        button.textContent = "⏳ Déconnexion...";
        await logout();
      }
    } else {
      window.location.href = "/login";
    }
  });

  document.body.appendChild(button);
}