import { PanelExtensionContext, Topic } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useConfig } from "./VisualisationPanelSettings";
import { createBoxMessage } from "./createBoxMessage";
import { createTraceMessage } from "./createTraceMessage";
import { createArchMessage } from "./createArchMessage";
import { Pose, Stamp } from "./types";


function ExamplePanel({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();
  
  const { frequency, inputTopics, outputTopics, scale } = useConfig(context);
  
  const [stamp, setStammp] = useState<Stamp>();
  const [pose, setPose] = useState<Pose>();
  
  const [mode, setMode] = useState<number>(0);
  const [velosity, setVelocity] = useState<number>(0);
  const [steering, setSteering] = useState<number>(0);

  const isArchActive = Math.abs(velosity) > 0.1 && mode == 1
  const [tracePointId, setTracePointId] = useState<number>(0);

  const processInputMessage = ({ topic, message } : { topic: string, message: any }) => {
    switch (topic) {
      case inputTopics.mode:
        setMode(message.mode);
        setStammp(message.header.stamp);
        break;
      case inputTopics.controlInput:
        setVelocity(message.velocity_ratio);
        setSteering(message.curvature_ratio);
        break;
      case inputTopics.odometry:
        setPose(message.pose.pose);
        break;
    }
  }

  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      const {currentFrame} = renderState
      currentFrame && currentFrame.map((item: any) => processInputMessage(item))  
      setRenderDone(() => done);
    };
    context.watch("topics");
  }, [context]);

  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  useEffect(() => {
    Object.values(outputTopics).map(topic => {
      context.advertise?.(topic, "visualization_msgs/msg/Marker");
    })
    return () => {
      Object.values(outputTopics).map(topic => {
        context.unadvertise?.(topic)
      })
    }
  }, [outputTopics])

  useEffect(() => {
    const markersInterval = setInterval(() => {
      setTracePointId(prev => ++prev)
      context.publish?.(outputTopics.box, createBoxMessage(mode, pose!!, scale))
      context.publish?.(outputTopics.trace, createTraceMessage(mode, tracePointId, stamp!!))
      context.publish?.(outputTopics.arch, createArchMessage(isArchActive, steering))
    }, 1000 / frequency) 
    
    return () => {
      clearInterval(markersInterval)
    }
  }, [frequency])

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Visualization is in progress. Click settings icon to configure it</h2>
    </div>
  );
}

export function initVisualizationPanel(context: PanelExtensionContext): () => void {
  ReactDOM.render(<ExamplePanel context={context} />, context.panelElement);

  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
