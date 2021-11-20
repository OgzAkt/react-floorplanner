import React, { Component } from "react";
import PropTypes from "prop-types";
import CatalogItem from "./catalog-item";
import CatalogBreadcrumb from "./catalog-breadcrumb";
import CatalogPageItem from "./catalog-page-item";
import CatalogTurnBackPageItem from "./catalog-turn-back-page-item";
import ContentContainer from "../style/content-container";
import ContentTitle from "../style/content-title";
import IconNext from "react-icons/lib/md/navigate-next";
import * as SharedStyle from "../../shared-style";

const containerStyle = {
  position: "absolute",
  width: "100vw",
  height: "100vh",
  backgroundColor: "#FFF",
  padding: "1em",
  overflowY: "auto",
  overflowX: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
};

const itemsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(14em, 1fr))",
  gridGap: "10px",
  marginTop: "1em",
};

const searchContainer = {
  width: "100%",
  height: "3em",
  padding: "0.625em",
  background: "#f7f7f9",
  border: "1px solid #e1e1e8",
  cursor: "pointer",
  position: "relative",
  boxShadow: "0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)",
  borderRadius: "2px",
  transition: "all .2s ease-in-out",
  WebkitTransition: "all .2s ease-in-out",
  marginBottom: "1em",
};

const searchText = {
  width: "8em",
  display: "inline-block",
};

const searchInput = {
  width: "calc( 100% - 10em )",
  height: "2em",
  margin: "0",
  padding: "0 1em",
  border: "1px solid #EEE",
};

const historyContainer = {
  ...searchContainer,
  padding: "0.2em 0.625em",
};

const historyElementStyle = {
  width: "auto",
  height: "2em",
  lineHeight: "2em",
  textAlign: "center",
  borderRadius: "1em",
  display: "inline-block",
  cursor: "pointer",
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  color: SharedStyle.PRIMARY_COLOR.text_main,
  textTransform: "capitalize",
  margin: "0.25em",
  padding: "0 1em",
};

export default class CatalogList extends Component {
  constructor(props, context) {
    super(props);

    let page = props.state.catalog.page;
    let currentCategory = context.catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements.filter((element) =>
      element.info.visibility ? element.info.visibility.catalog : true
    );

    this.state = {
      categories: currentCategory.categories,
      elements: elementsToDisplay,
      matchString: "",
      matchedElements: [],
    };
  }

  flattenCategories(categories) {
    let toRet = [];

    for (let x = 0; x < categories.length; x++) {
      let curr = categories[x];
      toRet = toRet.concat(curr.elements);
      if (curr.categories.length)
        toRet = toRet.concat(this.flattenCategories(curr.categories));
    }

    return toRet;
  }

  matcharray(text) {
    let array = this.state.elements.concat(
      this.flattenCategories(this.state.categories)
    );

    let filtered = [];

    if (text != "") {
      let regexp = new RegExp(text, "i");
      for (let i = 0; i < array.length; i++) {
        if (regexp.test(array[i].info.title)) {
          filtered.push(array[i]);
        }
      }
    }

    this.setState({
      matchString: text,
      matchedElements: filtered,
    });
  }

  select(element) {
    switch (element.prototype) {
      case "lines":
        this.context.linesActions.selectToolDrawingLine(element.name);
        break;
      case "items":
        this.context.itemsActions.selectToolDrawingItem(element.name);
        break;
      case "holes":
        this.context.holesActions.selectToolDrawingHole(element.name);
        break;
    }

    this.context.projectActions.pushLastSelectedCatalogElementToHistory(
      element
    );
  }

  render() {
    let page = this.props.state.catalog.page;
    let currentCategory = this.context.catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements.filter((element) =>
      element.info.visibility ? element.info.visibility.catalog : true
    );

    let breadcrumbComponent = null;

    if (page !== "root") {
      let breadcrumbsNames = [];

      this.props.state.catalog.path.forEach((pathName) => {
        breadcrumbsNames.push({
          name: this.context.catalog.getCategory(pathName).label,
          action: () => projectActions.goBackToCatalogPage(pathName),
        });
      });

      breadcrumbsNames.push({ name: currentCategory.label, action: "" });

      breadcrumbComponent = <CatalogBreadcrumb names={breadcrumbsNames} />;
    }

    let pathSize = this.props.state.catalog.path.size;

    let turnBackButton =
      pathSize > 0 ? (
        <CatalogTurnBackPageItem
          key={pathSize}
          page={
            this.context.catalog.categories[
              this.props.state.catalog.path.get(pathSize - 1)
            ]
          }
        />
      ) : null;

    let selectedHistory = this.props.state.get("selectedElementsHistory");
    let selectedHistoryElements = selectedHistory.map((el, ind) => (
      <div
        key={ind}
        style={historyElementStyle}
        title={el.name}
        onClick={() => this.select(el)}
      >
        {el.name}
      </div>
    ));

    return (
      <div style={{ ...containerStyle, ...this.props.style }}>
        <div
          style={{
            display: "flex",
            margin: "auto",
            flexDirection: "column",
            width: 450,
            height: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "5px",
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            <h5
              className="text-2xl font-bold font-manrope text-secondary"
              style={{
                fontSize: 25,
                padding: 0,
                margin: 0,
              }}
            >
              Eşyalar
            </h5>
            <button
              className="flex justify-center w-8 min-w-11 min-h-11 h-11 bg-ghost-default text-primary1"
              style={{
                borderRadius: "100%",
                height: 45,
                width: 45,
                border: 0,
                backgroundColor: "#8E43E7",
                color: "white",
                fontSize: 20,
              }}
            >
              <span className="text-primary1">
                <IconNext />
              </span>
            </button>
          </div>
          <div
            style={{
              marginBottom: "auto",
              marginTop: 20,
            }}
          >
            <input
              className={
                "relative block w-full p-4 text-base font-medium bg-white border-black border-solid text-primary-default border-primary border-default font-manrope focus:outline-none rounded rounded-12 "
              }
              onChange={(e) => {
                this.matcharray(e.target.value);
              }}
              style={{
                width: "100%",
                padding: 5,
                paddingBottom: 10,
                paddingTop: 10,
                borderRadius: 5,
                border: "1px solid #CCCCCC",
              }}
            />
          </div>

          {/* selectedHistory.size ? (
            <div style={historyContainer}>
              <span>{this.context.translator.t("Last Selected")}</span>
              {selectedHistoryElements}
            </div>
          ) : null */}
          <div style={itemsStyle}>
            {this.state.matchString === ""
              ? [
                  turnBackButton,
                  Object.values(this.state.categories).map((category) => {
                    return category.elements.map((elem, i) => {
                      return <CatalogItem key={elem.name} element={elem} />;
                    });
                  }),
                  elementsToDisplay.map((elem) => {
                    return <CatalogItem key={elem.name} element={elem} />;
                  }),
                ]
              : this.state.matchedElements.map((elem) => (
                  <CatalogItem key={elem.name} element={elem} />
                ))}
          </div>
        </div>
      </div>
    );
  }
}

CatalogList.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object,
};

CatalogList.contextTypes = {
  catalog: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
};
