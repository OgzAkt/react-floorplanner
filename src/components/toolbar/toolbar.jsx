import React, { Component } from "react";
import PropTypes from "prop-types";
import IconNewFile from "react-icons/lib/fa/file-o";
import IconPointer from "react-icons/lib/fa/mouse-pointer";
import Icon3DFirstPerson from "react-icons/lib/md/directions-run";
import IconCatalog from "react-icons/lib/fa/plus";
import IconUndo from "react-icons/lib/md/undo";
import IconConfigure from "react-icons/lib/md/settings";
import ToolbarButton from "./toolbar-button";
import ToolbarSaveButton from "./toolbar-save-button";
import ToolbarLoadButton from "./toolbar-load-button";
import If from "../../utils/react-if";
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT,
} from "../../constants";
import * as SharedStyle from "../../shared-style";

const Icon2D = () => (
  <p
    style={{
      fontSize: "19px",
      textDecoration: "none",
      fontWeight: "bold",
      margin: "0px",
    }}
  >
    2D
  </p>
);

const Icon3D = () => (
  <p
    style={{
      fontSize: "19px",
      textDecoration: "none",
      fontWeight: "bold",
      margin: "0px",
    }}
  >
    3D
  </p>
);

const ASIDE_STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  padding: "10px",
  width: 300,
};

const sortButtonsCb = (a, b) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapButtonsCb = (el, ind) => {
  return (
    <If key={ind} condition={el.condition} style={{ position: "relative" }}>
      {el.dom}
    </If>
  );
};

export default class Toolbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.state.mode !== nextProps.state.mode ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width
    );
  }

  render() {
    let {
      props: { state, width, height, toolbarButtons, allowProjectFileSupport },
      context: { projectActions, viewer3DActions, translator },
    } = this;

    let mode = state.get("mode");

    let sorter = [
      /*{
        index: 0,
        condition: allowProjectFileSupport,
        dom: (
          <ToolbarButton
            active={false}
            tooltip={translator.t("New project")}
            onClick={(event) =>
              confirm(translator.t("Would you want to start a new Project?"))
                ? projectActions.newProject()
                : null
            }
          >
            <IconNewFile />
          </ToolbarButton>
        ),
      },*/
      {
        name: "Kaydet",
        index: 1,
        condition: true,
        dom: <ToolbarSaveButton name={"Kaydet"} state={state} />,
      },
      /*{
        name:'Kaydet',
        index: 2,
        condition: allowProjectFileSupport,
        dom: <ToolbarLoadButton state={state} />,
      }, */
      {
        name: "Esyalar",
        index: 3,
        condition: true,
        dom: (
          <ToolbarButton
            name="Esyalar"
            active={[MODE_VIEWING_CATALOG].includes(mode)}
            tooltip={translator.t("Open catalog")}
            onClick={(event) => projectActions.openCatalog()}
          >
            <IconCatalog />
          </ToolbarButton>
        ),
      },
      {
        name: "3D Kamerayı Kullan",
        index: 4,
        condition: true,
        dom: (
          <ToolbarButton
            name="3D Kamerayı Kullan"
            active={[MODE_3D_VIEW].includes(mode)}
            tooltip={translator.t("3D View")}
            onClick={(event) => viewer3DActions.selectTool3DView()}
          >
            <Icon3D />
          </ToolbarButton>
        ),
      },
      {
        name: "2D Kamerayı Kullan",
        index: 5,
        condition: true,
        dom: (
          <ToolbarButton
            name="2D Kamerayı Kullan"
            active={[MODE_IDLE].includes(mode)}
            tooltip={translator.t("2D View")}
            onClick={(event) => projectActions.rollback()}
          >
            {[MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode) ? (
              <Icon2D />
            ) : (
              <IconPointer />
            )}
          </ToolbarButton>
        ),
      },
      {
        name: "3D Kullanıcı Kamerası",
        index: 6,
        condition: true,
        dom: (
          <ToolbarButton
            name="3D Kullanıcı Kamerası"
            active={[MODE_3D_FIRST_PERSON].includes(mode)}
            tooltip={translator.t("3D First Person")}
            onClick={(event) => viewer3DActions.selectTool3DFirstPerson()}
          >
            <Icon3DFirstPerson />
          </ToolbarButton>
        ),
      },
      {
        name: "Geri Al",
        index: 7,
        condition: true,
        dom: (
          <ToolbarButton
            name="Geri Al"
            active={false}
            tooltip={translator.t("Undo (CTRL-Z)")}
            onClick={(event) => projectActions.undo()}
          >
            <IconUndo />
          </ToolbarButton>
        ),
      },
      {
        index: 8,
        condition: true,
        dom: (
          <ToolbarButton
            name="Proje Ayarlari"
            active={[MODE_CONFIGURING_PROJECT].includes(mode)}
            tooltip={translator.t("Configure project")}
            onClick={(event) => projectActions.openProjectConfigurator()}
          >
            <IconConfigure />
          </ToolbarButton>
        ),
      },
    ];

    sorter = sorter.concat(
      toolbarButtons.map((Component, key) => {
        return Component.prototype //if is a react component
          ? {
              condition: true,
              dom: React.createElement(Component, { mode, state, key }),
            }
          : {
              //else is a sortable toolbar button
              index: Component.index,
              condition: Component.condition,
              dom: React.createElement(Component.dom, { mode, state, key }),
            };
      })
    );

    return (
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(246, 246, 246)",
          width: "40%",
          padding: 15,
        }}
      >
        <span
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            borderBottom: "1px solid rgb(204,204,204)",
            paddingBottom: "2rem",
          }}
        >
          Harita Editörü
        </span>
        <div
          style={{
            paddingBottom: 10,
          }}
        >
          <h5
            style={{
              fontSize: 20,
            }}
          >
            Şablonlar
          </h5>

          {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
        </div>
      </div>
    );

    return (
      <aside
        style={{ ...ASIDE_STYLE, maxWidth: width, maxHeight: height }}
        className="toolbar"
      >
        {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
      </aside>
    );
  }
}

Toolbar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  allowProjectFileSupport: PropTypes.bool.isRequired,
  toolbarButtons: PropTypes.array,
};

Toolbar.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
