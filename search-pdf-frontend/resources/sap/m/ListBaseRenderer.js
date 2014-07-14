/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.m.ListBaseRenderer");jQuery.sap.require("sap.ui.core.theming.Parameters");sap.m.ListBaseRenderer={};
sap.m.ListBaseRenderer.render=function(r,c){if(!c.getVisible()){return}r.write("<div");r.addClass("sapMList");r.writeControlData(c);r.writeAttribute("tabindex","-1");if(c.getInset()){r.addClass("sapMListInsetBG")}if(c.getWidth()){r.addStyle("width",c.getWidth())}if(c.setBackgroundDesign){r.addClass("sapMListBG"+c.getBackgroundDesign())}this.renderContainerAttributes(r,c);r.writeStyles();r.writeClasses();r.write(">");var h=c.getHeaderText();var H=c.getHeaderToolbar();if(H){c.addNavSection(H.getId());H.setDesign(sap.m.ToolbarDesign.Transparent,true);r.renderControl(H)}else if(h){r.write("<div class='sapMListHdr'>");r.writeEscaped(h);r.write("</div>")}var i=c.getInfoToolbar();if(i){c.addNavSection(i.getId());i.setDesign(sap.m.ToolbarDesign.Info,true);r.renderControl(i)}this.renderListStartAttributes(r,c);r.addClass("sapMListUl");r.writeAttribute("tabindex","-1");r.writeAttribute("id",c.getId("listUl"));r.addClass("sapMListShowSeparators"+c.getShowSeparators());r.addClass("sapMListMode"+c.getMode());c.getInset()&&r.addClass("sapMListInset");r.writeClasses();r.write(">");this.renderListHeadAttributes(r,c);var I=c.getItems();var R=this.shouldRenderItems(c);R&&I.forEach(function(o){c._applySettingsToItem(o,true);r.renderControl(o)});if((!R||!I.length)&&c.getShowNoData()){this.renderNoData(r,c)}this.renderListEndAttributes(r,c);if(c.getGrowing()&&c._oGrowingDelegate){c._oGrowingDelegate.render(r)}if(c.getFooterText()){r.write("<footer class='sapMListFtr'>");r.writeEscaped(c.getFooterText());r.write("</footer>")}r.write("<div tabindex='-1'");r.writeAttribute("id",c.getId("after"));r.write("></div>");r.write("</div>")};
sap.m.ListBaseRenderer.renderContainerAttributes=function(r,c){};
sap.m.ListBaseRenderer.renderListHeadAttributes=function(r,c){};
sap.m.ListBaseRenderer.renderListStartAttributes=function(r,c){r.write("<ul")};
sap.m.ListBaseRenderer.renderListEndAttributes=function(r,c){r.write("</ul>")};
sap.m.ListBaseRenderer.renderNoData=function(r,c){r.write("<li id='"+c.getId("nodata")+"' class='sapMLIB sapMListNoData'>");r.write("<span id='"+c.getId("nodata-text")+"'>");r.writeEscaped(c.getNoDataText());r.write("</span></li>")};
sap.m.ListBaseRenderer.shouldRenderItems=function(c){return true};
