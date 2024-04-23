import { ExtensionContext } from "@foxglove/studio";
import { initVisualizationPanel } from "./VisualisationPanel";

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "visualisation-panel", initPanel: initVisualizationPanel });
}
