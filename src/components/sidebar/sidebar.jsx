import React from "react";
import PropTypes from "prop-types";
import PanelElementEditor from "./panel-element-editor/panel-element-editor";
import PanelLayers from "./panel-layers";
import PanelGuides from "./panel-guides";
import PanelLayerElements from "./panel-layer-elements";
import * as SharedStyle from "../../shared-style";

const STYLE = {
  backgroundColor: "rgba(246, 246, 246)",
  display: "block",
  overflowY: "auto",
  overflowX: "hidden",
  paddingBottom: "20px",
};

export default function Sidebar({
  state,
  width,
  viewOnly,
  height,
  sidebarComponents,
}) {
  return (
    <div
      style={{
        width,
        ...STYLE,
        backgroundColor: "transparent",
        position: "absolute",
        right: 10,
        top: 150,
      }}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
      className="sidebar"
    >
      <div className="properties">
        <PanelElementEditor viewOnly={viewOnly} state={state} />
      </div>
    </div>
  );

  return (
    <aside
      style={{ width, height, ...STYLE }}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
      className="sidebar"
    >
      <div className="layers">
        <PanelLayers state={state} />
      </div>
      <div className="layer-elements">
        <PanelLayerElements
          mode={state.mode}
          layers={state.scene.layers}
          selectedLayer={state.scene.selectedLayer}
        />
      </div>
      <div className="properties">
        <PanelElementEditor state={state} />
      </div>
      {/*<div className="guides"><PanelGuides state={state}/></div>*/}
      {sidebarComponents.map((Component, index) => (
        <Component state={state} key={index} />
      ))}
    </aside>
  );
}

Sidebar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
