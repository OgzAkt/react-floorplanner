"use strict";

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import {
  ReactSVGPanZoom,
  TOOL_NONE,
  TOOL_PAN,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  TOOL_AUTO,
} from "react-svg-pan-zoom";
import * as constants from "../../constants";
import State from "./state";
import Cursor from "../../assets/images/Cursor.svg";
import Hand from "../../assets/images/Hand.svg";
import ZoomIn from "../../assets/images/ZoomIn.svg";
import ZoomOut from "../../assets/images/ZoomOut.svg";
import FullScreen from "react-icons/lib/md/fullscreen";

function mode2Tool(mode) {
  switch (mode) {
    case constants.MODE_2D_PAN:
      return TOOL_PAN;
    case constants.MODE_2D_ZOOM_IN:
      return TOOL_ZOOM_IN;
    case constants.MODE_2D_ZOOM_OUT:
      return TOOL_ZOOM_OUT;
    case constants.MODE_IDLE:
      return TOOL_AUTO;
    default:
      return TOOL_NONE;
  }
}

function mode2PointerEvents(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
      return { pointerEvents: "none" };

    default:
      return {};
  }
}

function mode2Cursor(mode) {
  switch (mode) {
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_ITEM:
      return { cursor: "move" };

    case constants.MODE_ROTATING_ITEM:
      return { cursor: "ew-resize" };

    case constants.MODE_WAITING_DRAWING_LINE:
    case constants.MODE_DRAWING_LINE:
      return { cursor: "crosshair" };
    default:
      return { cursor: "default" };
  }
}

function mode2DetectAutopan(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
      return true;

    default:
      return false;
  }
}

function extractElementData(node) {
  while (
    !node.attributes.getNamedItem("data-element-root") &&
    node.tagName !== "svg"
  ) {
    node = node.parentNode;
  }
  if (node.tagName === "svg") return null;

  return {
    part: node.attributes.getNamedItem("data-part")
      ? node.attributes.getNamedItem("data-part").value
      : undefined,
    layer: node.attributes.getNamedItem("data-layer").value,
    prototype: node.attributes.getNamedItem("data-prototype").value,
    selected: node.attributes.getNamedItem("data-selected").value === "true",
    id: node.attributes.getNamedItem("data-id").value,
  };
}

export default function Viewer2D(
  { state, width, height, viewOnly },
  {
    viewer2DActions,
    linesActions,
    holesActions,
    verticesActions,
    itemsActions,
    areaActions,
    projectActions,
    catalog,
  }
) {
  let { viewer2D, mode, scene } = state;

  let layerID = scene.selectedLayer;

  let mapCursorPosition = ({ x, y }) => {
    return { x, y: -y + scene.height };
  };

  let onMouseMove = (viewerEvent) => {
    //workaround that allow imageful component to work
    var evt = new Event("mousemove-planner-event");
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    projectActions.updateMouseCoord({ x, y });

    switch (mode) {
      case constants.MODE_DRAWING_LINE:
        linesActions.updateDrawingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_HOLE:
        holesActions.updateDrawingHole(layerID, x, y);
        break;

      case constants.MODE_DRAWING_ITEM:
        itemsActions.updateDrawingItem(layerID, x, y);
        break;

      case constants.MODE_DRAGGING_HOLE:
        holesActions.updateDraggingHole(x, y);
        break;

      case constants.MODE_DRAGGING_LINE:
        linesActions.updateDraggingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_VERTEX:
        verticesActions.updateDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        itemsActions.updateDraggingItem(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        itemsActions.updateRotatingItem(x, y);
        break;
    }

    viewerEvent.originalEvent.stopPropagation();
  };

  let onMouseDown = (viewerEvent) => {
    let event = viewerEvent.originalEvent;

    //workaround that allow imageful component to work
    var evt = new Event("mousedown-planner-event");
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    if (mode === constants.MODE_IDLE) {
      let elementData = extractElementData(event.target);
      if (!elementData || !elementData.selected) return;

      switch (elementData.prototype) {
        case "lines":
          linesActions.beginDraggingLine(
            elementData.layer,
            elementData.id,
            x,
            y,
            state.snapMask
          );
          break;

        case "vertices":
          verticesActions.beginDraggingVertex(
            elementData.layer,
            elementData.id,
            x,
            y,
            state.snapMask
          );
          break;

        case "items":
          if (elementData.part === "rotation-anchor")
            itemsActions.beginRotatingItem(
              elementData.layer,
              elementData.id,
              x,
              y
            );
          else
            itemsActions.beginDraggingItem(
              elementData.layer,
              elementData.id,
              x,
              y
            );
          break;

        case "holes":
          holesActions.beginDraggingHole(
            elementData.layer,
            elementData.id,
            x,
            y
          );
          break;

        default:
          break;
      }
    }
    event.stopPropagation();
  };

  let onMouseUp = (viewerEvent) => {
    let event = viewerEvent.originalEvent;

    var evt = new Event("mouseup-planner-event");
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    switch (mode) {
      case constants.MODE_IDLE:
        let elementData = extractElementData(event.target);

        if (elementData && elementData.selected) return;

        switch (elementData ? elementData.prototype : "none") {
          case "areas":
            areaActions.selectArea(elementData.layer, elementData.id);
            break;

          case "lines":
            linesActions.selectLine(elementData.layer, elementData.id);
            break;

          case "holes":
            holesActions.selectHole(elementData.layer, elementData.id);
            break;

          case "items":
            itemsActions.selectItem(elementData.layer, elementData.id);
            break;

          case "none":
            projectActions.unselectAll();
            break;
        }
        break;

      case constants.MODE_WAITING_DRAWING_LINE:
        linesActions.beginDrawingLine(layerID, x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_LINE:
        linesActions.endDrawingLine(x, y, state.snapMask);
        linesActions.beginDrawingLine(layerID, x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_HOLE:
        holesActions.endDrawingHole(layerID, x, y);
        break;

      case constants.MODE_DRAWING_ITEM:
        itemsActions.endDrawingItem(layerID, x, y);
        break;

      case constants.MODE_DRAGGING_LINE:
        linesActions.endDraggingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_VERTEX:
        verticesActions.endDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        itemsActions.endDraggingItem(x, y);
        break;

      case constants.MODE_DRAGGING_HOLE:
        holesActions.endDraggingHole(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        itemsActions.endRotatingItem(x, y);
        break;
    }

    event.stopPropagation();
  };

  let onChangeValue = (value) => {
    if (viewOnly) {
      viewer2DActions.selectToolPan();
    }
    projectActions.updateZoomScale(value.a);
    return viewer2DActions.updateCameraView(value);
  };

  let onChangeTool = (tool) => {
    switch (tool) {
      case TOOL_NONE:
        projectActions.selectToolEdit();
        break;

      case TOOL_PAN:
        viewer2DActions.selectToolPan();
        break;

      case TOOL_ZOOM_IN:
        viewer2DActions.selectToolZoomIn();
        break;

      case TOOL_ZOOM_OUT:
        viewer2DActions.selectToolZoomOut();
        break;
    }
  };

  const customToolBar = (props) => {
    return (
      <div
        style={{
          backgroundColor: "white",
          position: "absolute",
          display: "flex",
          border: "1px solid rgba(204, 204, 204, 1)",
          flexDirection: "row",
          justifyContent: "space-around",
          top: 15,
          padding: 15,
          color: "rgba(128, 128, 128, 1)",
          left: 20,
          borderRadius: 15,
          paddingLeft: 35,
          paddingRight: 35,
        }}
      >
        {!viewOnly && (
          <label
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 25,
              cursor: "pointer",
              borderRadius: 5,

              backgroundColor:
                props.tool === "auto" ? "rgba(142, 67, 231, 1)" : "white",
            }}
            onClick={() => props.onChangeTool(TOOL_NONE)}
          >
            <img
              style={{
                width: "16px",
              }}
              src={Cursor}
            />
          </label>
        )}

        <label
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 25,
            cursor: "pointer",
            borderRadius: 5,
            backgroundColor:
              props.tool === TOOL_PAN ? "rgba(142, 67, 231, 1)" : "white",
          }}
          onClick={() => props.onChangeTool(TOOL_PAN)}
        >
          <img
            style={{
              width: "20px",
            }}
            src={Hand}
          />
        </label>
        <label
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 25,
            cursor: "pointer",
            borderRadius: 5,
            backgroundColor:
              props.tool === TOOL_ZOOM_IN ? "rgba(142, 67, 231, 1)" : "white",
          }}
          onClick={() => props.onChangeTool(TOOL_ZOOM_IN)}
        >
          <img
            style={{
              width: "20px",
            }}
            src={ZoomIn}
          />
        </label>
        <label
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 25,
            cursor: "pointer",
            borderRadius: 5,
            backgroundColor:
              props.tool === TOOL_ZOOM_OUT ? "rgba(142, 67, 231, 1)" : "white",
          }}
          onClick={() => props.onChangeTool(TOOL_ZOOM_OUT)}
        >
          <img
            style={{
              width: "17px",
            }}
            src={ZoomOut}
          />
        </label>
        <label
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => {}}
        >
          <FullScreen size={30} />
        </label>
      </div>
    );
  };

  return (
    <ReactSVGPanZoom
      width={width}
      height={height}
      value={viewer2D.isEmpty() ? null : viewer2D.toJS()}
      onChangeValue={(value) => {
        onChangeValue(value);
      }}
      tool={mode2Tool(mode)}
      onChangeTool={onChangeTool}
      detectAutoPan={mode2DetectAutopan(mode)}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      background="#fff"
      miniaturePosition="none"
      toolbarPosition="top"
      customToolbar={customToolBar}
    >
      <svg width={scene.width} height={scene.height}>
        <g style={Object.assign(mode2Cursor(mode), mode2PointerEvents(mode))}>
          <State state={state} catalog={catalog} />
        </g>
      </svg>
    </ReactSVGPanZoom>
  );
}

Viewer2D.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

Viewer2D.contextTypes = {
  viewer2DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  verticesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  areaActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired,
};
