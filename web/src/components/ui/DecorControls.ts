import { forceBackgroundChange, getCurrentBackgroundInfo } from "../../utils/backgroundRotator";

let mounted = false;
let controlsRef: HTMLDivElement | null = null;

function beautifyName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function createControls(): HTMLDivElement {
  const container = document.createElement("div");
  container.className = "decor-controls";
  container.innerHTML = `
    <button type="button" class="decor-controls__action" aria-live="polite">
      <span>Changer le décor</span>
    </button>
  `;
  return container;
}

function updateLabel(root: HTMLElement) {
  const target = root.querySelector<HTMLElement>("[data-bg-label]");
  if (!target) return;

  const { name, index, total } = getCurrentBackgroundInfo();
  const pretty = beautifyName(name);
  target.textContent = `${pretty} (${index + 1}/${total})`;
}

export function mountDecorControls() {
  if (mounted) return;
  mounted = true;

  const controls = createControls();
  document.body.appendChild(controls);
  controlsRef = controls;

  const action = controls.querySelector<HTMLButtonElement>(".decor-controls__action");
  if (action) {
    action.addEventListener("click", () => {
      controls.classList.add("decor-controls--pulse");
      forceBackgroundChange();
      setTimeout(() => {
        controls.classList.remove("decor-controls--pulse");
        updateLabel(controls);
      }, 600);
    });
  }

  updateLabel(controls);
}

export function refreshDecorControls() {
  if (!controlsRef) return;
  updateLabel(controlsRef);
}
