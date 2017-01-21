import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "html": {
        "width": "100%",
        "height": "100%"
    },
    "body": {
        "width": "100%",
        "height": "100%",
        "fontFamily": "\"Source Sans Pro\",\"Helvetica Neue\",Helvetica,Arial,sans-serif"
    },
    "text-vertical-center": {
        "display": "table-cell",
        "textAlign": "center",
        "verticalAlign": "middle"
    },
    "text-vertical-center h1": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0,
        "fontSize": 4.5,
        "fontWeight": "700"
    },
    "btn-dark": {
        "borderRadius": 0,
        "color": "#fff",
        "backgroundColor": "rgba(0,0,0,0.4)"
    },
    "btn-dark:hover": {
        "color": "#fff",
        "backgroundColor": "rgba(0,0,0,0.7)"
    },
    "btn-dark:focus": {
        "color": "#fff",
        "backgroundColor": "rgba(0,0,0,0.7)"
    },
    "btn-dark:active": {
        "color": "#fff",
        "backgroundColor": "rgba(0,0,0,0.7)"
    },
    "btn-light": {
        "borderRadius": 0,
        "color": "#333",
        "backgroundColor": "rgb(255,255,255)"
    },
    "btn-light:hover": {
        "color": "#333",
        "backgroundColor": "rgba(255,255,255,0.8)"
    },
    "btn-light:focus": {
        "color": "#333",
        "backgroundColor": "rgba(255,255,255,0.8)"
    },
    "btn-light:active": {
        "color": "#333",
        "backgroundColor": "rgba(255,255,255,0.8)"
    },
    "hrsmall": {
        "maxWidth": 100
    },
    "sidebar-wrapper": {
        "zIndex": 1000,
        "position": "fixed",
        "right": 0,
        "width": 250,
        "height": "100%",
        "transform": "translateX(250px)",
        "overflowY": "auto",
        "background": "#222",
        "WebkitTransition": "all 0.4s ease 0s",
        "MozTransition": "all 0.4s ease 0s",
        "MsTransition": "all 0.4s ease 0s",
        "OTransition": "all 0.4s ease 0s",
        "transition": "all 0.4s ease 0s"
    },
    "sidebar-nav": {
        "position": "absolute",
        "top": 0,
        "width": 250,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0,
        "listStyle": "none"
    },
    "sidebar-nav li": {
        "textIndent": 20,
        "lineHeight": 40
    },
    "sidebar-nav li a": {
        "display": "block",
        "textDecoration": "none",
        "color": "#999"
    },
    "sidebar-nav li a:hover": {
        "textDecoration": "none",
        "color": "#fff",
        "background": "rgba(255,255,255,0.2)"
    },
    "sidebar-nav li a:active": {
        "textDecoration": "none"
    },
    "sidebar-nav li a:focus": {
        "textDecoration": "none"
    },
    "sidebar-nav > sidebar-brand": {
        "height": 55,
        "fontSize": 18,
        "lineHeight": 55
    },
    "sidebar-nav > sidebar-brand a": {
        "color": "#999"
    },
    "sidebar-nav > sidebar-brand a:hover": {
        "color": "#fff",
        "background": "none"
    },
    "menu-toggle": {
        "zIndex": 1,
        "position": "fixed",
        "top": 0,
        "right": 0
    },
    "sidebar-wrapperactive": {
        "right": 250,
        "width": 250,
        "WebkitTransition": "all 0.4s ease 0s",
        "MozTransition": "all 0.4s ease 0s",
        "MsTransition": "all 0.4s ease 0s",
        "OTransition": "all 0.4s ease 0s",
        "transition": "all 0.4s ease 0s"
    },
    "toggle": {
        "marginTop": 5,
        "marginRight": 5,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "header": {
        "display": "table",
        "position": "relative",
        "width": "100%",
        "height": "100%",
        "background": "url(/client/content/images/storm-background.jpg) no-repeat center center scroll",
        "WebkitBackgroundSize": "cover",
        "MozBackgroundSize": "cover",
        "backgroundSize": "cover",
        "OBackgroundSize": "cover"
    },
    "about": {
        "paddingTop": 50,
        "paddingRight": 0,
        "paddingBottom": 50,
        "paddingLeft": 0
    },
    "services": {
        "paddingTop": 50,
        "paddingRight": 0,
        "paddingBottom": 50,
        "paddingLeft": 0
    },
    "service-item": {
        "marginBottom": 30
    },
    "callout": {
        "display": "table",
        "width": "100%",
        "height": 400,
        "color": "#fff",
        "background": "url(/client/content/images/acconting-main.jpg) no-repeat center center scroll",
        "WebkitBackgroundSize": "cover",
        "MozBackgroundSize": "cover",
        "backgroundSize": "cover",
        "OBackgroundSize": "cover"
    },
    "portfolio": {
        "paddingTop": 50,
        "paddingRight": 0,
        "paddingBottom": 50,
        "paddingLeft": 0
    },
    "portfolio-item": {
        "marginBottom": 30
    },
    "img-portfolio": {
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto"
    },
    "img-portfolio:hover": {
        "opacity": 0.8
    },
    "call-to-action": {
        "paddingTop": 50,
        "paddingRight": 0,
        "paddingBottom": 50,
        "paddingLeft": 0
    },
    "call-to-action btn": {
        "marginTop": 10,
        "marginRight": 10,
        "marginBottom": 10,
        "marginLeft": 10
    },
    "map": {
        "height": 500
    },
    "map iframe": {
        "pointerEvents": "none"
    },
    "footer": {
        "paddingTop": 100,
        "paddingRight": 0,
        "paddingBottom": 100,
        "paddingLeft": 0
    },
    "to-top": {
        "display": "none",
        "position": "fixed",
        "bottom": 5,
        "right": 5
    }
});