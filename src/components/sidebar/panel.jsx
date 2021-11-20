import React from "react";
import * as SharedStyle from "../../shared-style";

const STYLE = {};
const STYLE_TITLE = {
  fontSize: "11px",
  color: "black",
  padding: "5px 15px 8px 15px",
  backgroundColor: "rgba(246, 246, 246)",
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
  margin: "0px",
};
const STYLE_CONTENT = {
  fontSize: "11px",
  color: "black",
  borderBottomLeftRadius: "15px",
  borderBottomRightRadius: "15px",
  padding: "0px",
  backgroundColor: "rgba(246, 246, 246)",
};

export default function Panel({ name, headComponents, children }) {
  return (
    <div style={STYLE}>
      <h3 style={STYLE_TITLE}>
        {name}
        {headComponents}
      </h3>
      <div style={STYLE_CONTENT}>{children}</div>
    </div>
  );
}
