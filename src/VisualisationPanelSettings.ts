import { PanelExtensionContext, SettingsTreeAction, SettingsTreeNode, SettingsTreeNodes } from "@foxglove/studio";
import { useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { Config, defaultConfig } from "./types";


export function buildSettingsTree(config: Config): SettingsTreeNodes {
  const generalSettings = useMemo(
    (): SettingsTreeNode => ({
      label: "General",
      fields: {
        frequency: { 
          label: "Frequency",
          input: "number", 
          value: config.frequency, 
          min: 1, 
          max: 60
        },
      },
    }),
    [config],
  );
  const inputTopicsSettings = useMemo(
    (): SettingsTreeNode => ({
      label: "Input topics",
      fields: {
        mode: {
          label: "Mode",
          input: "string",
          value: config.inputTopics.mode,
        },
        odometry: {
          label: "Odometry",
          input: "string", 
          value: config.inputTopics.odometry, 
        },
        controlInput: {
          label: "Input",
          input: "string", 
          value: config.inputTopics.controlInput, 
        }
      }
    }),
    [config],
  );
  const outputTopicsSettings = useMemo(
    (): SettingsTreeNode => ({
      label: "Output topics",
      fields: {
        box: {
          label: "Truck box",
          input: "string",
          value: config.outputTopics.box,
        },
        trace: {
          label: "Trace",
          input: "string", 
          value: config.outputTopics.trace, 
        }
      }
    }),
    [config],
  );
  const truckScaleSettings = useMemo(
    (): SettingsTreeNode => ({
      label: "Truck scale",
      fields: {
        x: {
          label: "Width",
          input: "number",
          value: config.scale.x,
          min: 0
        },
        y: {
          label: "Length",
          input: "number", 
          value: config.scale.y, 
          min: 0
        },
        z: {
          label: "Height",
          input: "number", 
          value: config.scale.z, 
          min: 0
        }
      }
    }),
    [config],
  );
  return { general: generalSettings, inputTopics: inputTopicsSettings, outputTopics: outputTopicsSettings, scale: truckScaleSettings };
}

export function useConfig(context: PanelExtensionContext): Config {
  const [config, setConfig] = useState(() => ({
    ...defaultConfig,
    ...(context.initialState as Partial<Config>),
  }));

  const settingsActionHandler = useCallback(
    (action: SettingsTreeAction) => {
      if (action.action !== "update") {
        return;
      }
      const path = action.payload.path
      setConfig((previous) => {
        const newConfig = { ...previous };
        _.set(
          newConfig,
          path.slice(path[0] == "general" ? 1 : 0),
          action.payload.value
        );
        return newConfig;
      });
    },
    [setConfig],
  );

  const settingsTree = buildSettingsTree(config);
  useEffect(() => {
    context.updatePanelSettingsEditor({
      actionHandler: settingsActionHandler,
      nodes: settingsTree,
    });
  }, [context, settingsActionHandler, settingsTree]);

  useEffect(() => {
    context.saveState(config);
  }, [config, context]);
  return config;
}
