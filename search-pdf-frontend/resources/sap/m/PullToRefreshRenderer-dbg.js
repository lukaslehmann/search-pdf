/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

jQuery.sap.declare("sap.m.PullToRefreshRenderer");
jQuery.sap.require("sap.ui.core.IconPool"); // TODO: consider making this conditional 
sap.ui.core.IconPool.insertFontFaceStyle();

/**
 * @class PullToRefresh renderer. 
 * @static
 */
sap.m.PullToRefreshRenderer = {
};

/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.m.PullToRefreshRenderer.render = function(oRm, oControl){

	// do not render invisible P2R
	if(!oControl.getVisible()) return;
	
	var bShowIcon = oControl.getShowIcon();
	var sCustomIcon = oControl.getCustomIcon();

	oRm.write("<div");
	oRm.writeControlData(oControl);
	oRm.addClass("sapMPullDown");
	if (!oControl._bTouchMode) {
		oRm.addClass("sapMPullDownNontouch");
	} else {
		oRm.addClass("sapMPullDownTouch");
	}
	if(bShowIcon && !sCustomIcon){ // if no custom icon is provided, use SAP logo as background
		oRm.addClass("sapMPullDownLogo");
	}
	oRm.writeClasses();
	oRm.write(">"); // div element

	if(bShowIcon && sCustomIcon){
		var oCustomImage = oControl.getCustomIconImage();
		if(oCustomImage){
			oRm.write("<div class=\"sapMPullDownCI\">");
			oRm.renderControl(oCustomImage);
			oRm.write("</div>");
		}
	}

	// Pull down arrow icon
	oRm.write("<span class=\"sapMPullDownIcon\"></span>");

	// Busy Indicator
	oRm.write("<span class=\"sapMPullDownBusy\">");
	oRm.renderControl(oControl._oBusyIndicator);
	oRm.write("</span>");

	// Text - Pull down to refresh
	oRm.write("<span id=" + oControl.getId() + "-T class=\"sapMPullDownText\">");
	oRm.writeEscaped(oControl.oRb.getText(oControl._bTouchMode ? "PULL2REFRESH_PULLDOWN" : "PULL2REFRESH_REFRESH"));
	oRm.write("</span>");

	// Info - last updated at xx:xx:xx
	oRm.write("<span id=" + oControl.getId() + "-I class=\"sapMPullDownInfo\">");
	oRm.writeEscaped(oControl.getDescription());
	oRm.write("</span>");

	oRm.write("</div>");
};
