import React, { Component } from "react";
import PropTypes from "prop-types";
import * as SharedStyle from "../../shared-style";

//http://www.cssportal.com/css-tooltip-generator/

const STYLE = {
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "5px",
  fontSize: "25px",
  position: "relative",
  cursor: "pointer",
};

const STYLE_TOOLTIP = {
  position: "absolute",
  width: "140px",
  color: SharedStyle.COLORS.white,
  background: SharedStyle.COLORS.black,
  height: "30px",
  lineHeight: "30px",
  textAlign: "center",
  visibility: "visible",
  borderRadius: "6px",
  opacity: "0.8",
  left: "100%",
  top: "50%",
  marginTop: "-15px",
  marginLeft: "15px",
  zIndex: "999",
  fontSize: "12px",
};

const STYLE_TOOLTIP_PIN = {
  position: "absolute",
  top: "50%",
  right: "100%",
  marginTop: "-8px",
  width: "0",
  height: "0",
  borderRight: "8px solid #000000",
  borderTop: "8px solid transparent",
  borderBottom: "8px solid transparent",
};

export default class ToolbarButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { active: false };
  }

  render() {
    let { state, props } = this;
    let { name } = props;
    let color =
      props.active || state.active
        ? SharedStyle.SECONDARY_COLOR.icon
        : SharedStyle.PRIMARY_COLOR.icon;

    if (name)
      return (
        <div
          onClick={props.onClick}
          onMouseOver={(event) => this.setState({ active: true })}
          onMouseOut={(event) => this.setState({ active: false })}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "between",
            flexDirection: "row",
            paddingLeft: "10px",
            paddingRight: "10px",
            marginBottom: "10px",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderRadius: 15,
            cursor: "pointer",
            backgroundColor: "white",
          }}
        >
          <i
            style={{
              backgroundColor: "black",
              width: "40px",
              height: "40px",
              borderRadius: "100%",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
            }}
          >
            {props.children}
          </i>
          <p
            className="text-base font-bold"
            style={{
              fontWeight: 500,
            }}
          >
            {name}
          </p>
        </div>
      );
    else return <div></div>;
  }
}

ToolbarButton.propTypes = {
  active: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

/*
    return (
      <div
        style={STYLE}
        onMouseOver={(event) => this.setState({ active: true })}
        onMouseOut={(event) => this.setState({ active: false })}
      >
        <div style={{ color }} onClick={props.onClick}>
          {props.children}
        </div>

        {state.active ? (
          <div style={STYLE_TOOLTIP}>
            <span style={STYLE_TOOLTIP_PIN} />
            {props.tooltip}
          </div>
        ) : null}
      </div>
    ); */
