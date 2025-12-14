import { t } from "../../i18n";

export function renderHeaderContextMessage(
  labelKey: string,
  helperKey: string,
  className = ""
): string {
  const classes = [
    "pointer-events-none",
    "absolute",
    "left-1/2",
    "top-1/2",
    "-translate-x-1/2",
    "-translate-y-1/2",
    "text-center",
    "flex",
    "flex-col",
    "items-center",
    "gap-1",
    "w-full",
    "px-4"
  ];
  if (className) classes.push(className);

  return `
    <div class="${classes.join(" ")}">
      <span class="uppercase tracking-[0.3em] text-[0.65rem] sm:text-xs text-slate-500">
        ${t(labelKey)}
      </span>
      <span class="text-slate-100 text-sm sm:text-base">
        ${t(helperKey)}
      </span>
    </div>
  `;
}
