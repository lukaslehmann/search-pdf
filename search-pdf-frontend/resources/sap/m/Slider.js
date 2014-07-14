/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.m.Slider");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Slider",{metadata:{publicMethods:["stepUp","stepDown"],library:"sap.m",properties:{"width":{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'100%'},"enabled":{type:"boolean",group:"Behavior",defaultValue:true},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"name":{type:"string",group:"Misc",defaultValue:null},"min":{type:"float",group:"Data",defaultValue:0},"max":{type:"float",group:"Data",defaultValue:100},"step":{type:"float",group:"Data",defaultValue:1},"progress":{type:"boolean",group:"Misc",defaultValue:true},"value":{type:"float",group:"Data",defaultValue:0}},events:{"change":{},"liveChange":{}}}});sap.m.Slider.M_EVENTS={'change':'change','liveChange':'liveChange'};jQuery.sap.require("sap.ui.core.EnabledPropagator");sap.ui.core.EnabledPropagator.apply(sap.m.Slider.prototype,[true]);sap.m.Slider._bRtl=sap.ui.getCore().getConfiguration().getRTL();
sap.m.Slider.prototype._cacheDomRefs=function(){this._$Slider=this.$();this._$SliderInner=this._$Slider.children("."+sap.m.SliderRenderer.CSS_CLASS+"Inner");this._$ProgressIndicator=this._$SliderInner.children("."+sap.m.SliderRenderer.CSS_CLASS+"Progress");this._$Handle=this._$SliderInner.children("."+sap.m.SliderRenderer.CSS_CLASS+"Handle");this._$Input=this._$Slider.children("input."+sap.m.SliderRenderer.CSS_CLASS+"Input")};
sap.m.Slider.prototype._destroyDomRefs=function(){this._$Slider=null;this._$SliderInner=null;this._$ProgressIndicator=null;this._$Handle=null;this._$Input=null};
sap.m.Slider.prototype._convertValueForRtlMode=function(n){return this.getMax()-n+this.getMin()};
sap.m.Slider.prototype._recalculateStyles=function(){this._fSliderWidth=this._$Slider.width();this._fSliderPaddingLeft=parseFloat(this._$Slider.css("padding-left"));this._fSliderOffsetLeft=this._$Slider.offset().left;this._fHandleWidth=this._$Handle.width()};
sap.m.Slider.prototype._getPercentFromValue=function(v){var m=this.getMin();return(((v-m)/(this.getMax()-m))*100)};
sap.m.Slider.prototype._validateN=function(n){var t=typeof n;if(t==="undefined"){return 1}else if(t!=="number"){jQuery.sap.log.warning('Warning: n needs to be a number',this);return 0}else if(Math.floor(n)===n&&isFinite(n)){return n}else{jQuery.sap.log.warning('Warning: n needs to be a finite interger',this);return 0}};
sap.m.Slider.prototype._validateProperties=function(){var m=this.getMin(),M=this.getMax(),s=this.getStep(),b=false,e=false;if(m>=M){b=true;e=true;jQuery.sap.log.warning("Warning: "+"Property wrong min: "+m+" >= max: "+M+" on ",this)}if(s<=0){jQuery.sap.log.warning("Warning: "+"The step could not be negative on ",this);s=1;this.setProperty("step",s,true)}if(s>(M-m)&&!b){e=true;jQuery.sap.log.warning("Warning: "+"Property wrong step: "+s+" > max: "+M+" - "+"min: "+m+" on ",this)}return e};
sap.m.Slider.prototype._setValue=function(n){var m=this.getMin(),M=this.getMax(),s=this.getStep(),v=this.getValue(),f=Math.abs(n%s),p;if(typeof n!=="number"||!isFinite(n)){jQuery.sap.log.error("Error:",'"fNewValue" needs to be a finite number on ',this);return this}n=f*2>=s?n+s-f:n-f;n=n>M?M:n<m?m:n;n=Number(n.toFixed(5));this.setProperty("value",n,true);if(v===this.getValue()){return this}if(this._$Slider){p=this._getPercentFromValue(n)+"%";if(this._bInputRendered){this._$Input[0].setAttribute("value",n)}if(this._bProgress){this._$ProgressIndicator[0].style.width=p}this._$Handle[0].style[sap.m.Slider._bRtl?"right":"left"]=p;this._$Handle[0].title=n;this._$Handle[0].setAttribute("aria-valuenow",n);this._$Handle[0].setAttribute("aria-valuetext",n)}return this};
sap.m.Slider.prototype._fireChangeAndLiveChange=function(p){this.fireChange(p);this.fireLiveChange(p)};
sap.m.Slider.prototype.onBeforeRendering=function(){var e=this._validateProperties();if(!e){this.setValue(this.getValue());this._sProgressValue=this._getPercentFromValue(this.getValue())+"%"}this._bProgress=this.getProgress();this._bInputRendered=!!this.getName();this._bDisabled=!this.getEnabled()};
sap.m.Slider.prototype.onAfterRendering=function(){this._cacheDomRefs();this._$Slider.css("visibility","")};
sap.m.Slider.prototype.exit=function(){this._destroyDomRefs()};
sap.m.Slider.prototype.ontouchstart=function(e){var m=this.getMin(),n;e.originalEvent._sapui_handledByControl=true;if(e.targetTouches.length>1||this._bDisabled){return}jQuery.sap.delayedCall(0,this,"handleFocus");this._recalculateStyles();this._fDiffX=this._fSliderPaddingLeft;this._fStartValue=this.getValue();this._$SliderInner.addClass(sap.m.SliderRenderer.CSS_CLASS+"Pressed");if(this._$Handle[0].contains(e.target)){this._fDiffX=e.targetTouches[0].pageX-this._$Handle.offset().left;return}n=(((e.targetTouches[0].pageX-this._fSliderPaddingLeft-this._fSliderOffsetLeft)/this._fSliderWidth)*(this.getMax()-m))+m;if(sap.m.Slider._bRtl){n=this._convertValueForRtlMode(n)}this.setValue(n);n=this.getValue();if(this._fStartValue!==n){this.fireLiveChange({value:n})}};
sap.m.Slider.prototype.ontouchmove=function(e){e.originalEvent._sapui_handledByControl=true;if(this._bDisabled){return}var m=this.getMin(),v=this.getValue(),n=(((e.targetTouches[0].pageX-this._fDiffX-this._fSliderOffsetLeft)/this._fSliderWidth)*(this.getMax()-m))+m;if(sap.m.Slider._bRtl){n=this._convertValueForRtlMode(n)}this.setValue(n);n=this.getValue();if(v!==n){this.fireLiveChange({value:n})}};
sap.m.Slider.prototype.ontouchend=function(e){e.originalEvent._sapui_handledByControl=true;var v=this.getValue();if(this._bDisabled){return}this._$SliderInner.removeClass(sap.m.SliderRenderer.CSS_CLASS+"Pressed");if(this._fStartValue!==v){this.fireChange({value:v})}};
sap.m.Slider.prototype.ontouchcancel=sap.m.Slider.prototype.ontouchend;
sap.m.Slider.prototype.onsapincrease=function(e){var v,n;e.originalEvent._sapui_handledByControl=true;e.preventDefault();if(this.getEnabled()){v=this.getValue();this.stepUp(1);n=this.getValue();if(v<n){this._fireChangeAndLiveChange({value:n})}}};
sap.m.Slider.prototype.onsapdecrease=function(e){var v,n;e.originalEvent._sapui_handledByControl=true;e.preventDefault();if(this.getEnabled()){v=this.getValue();this.stepDown(1);n=this.getValue();if(v>n){this._fireChangeAndLiveChange({value:n})}}};
sap.m.Slider.prototype.onsapexpand=sap.m.Slider.prototype.onsapincrease;sap.m.Slider.prototype.onsapcollapse=sap.m.Slider.prototype.onsapdecrease;
sap.m.Slider.prototype.onsaphome=function(e){e.originalEvent._sapui_handledByControl=true;var m=this.getMin();e.preventDefault();if(this.getEnabled()&&this.getValue()>m){this.setValue(m);this._fireChangeAndLiveChange({value:m})}};
sap.m.Slider.prototype.onsapend=function(e){e.originalEvent._sapui_handledByControl=true;var m=this.getMax();e.preventDefault();if(this.getEnabled()&&this.getValue()<m){this.setValue(m);this._fireChangeAndLiveChange({value:m})}};
sap.m.Slider.prototype.handleFocus=function(){if(sap.ui.Device.system.desktop){this._$Handle[0].focus()}};
sap.m.Slider.prototype.getFocusDomRef=function(){return this.getDomRef()?this._$Handle[0]:null};
sap.m.Slider.prototype.stepUp=function(n){return this.setValue(this.getValue()+(this._validateN(n)*this.getStep()))};
sap.m.Slider.prototype.stepDown=function(n){return this.setValue(this.getValue()-(this._validateN(n)*this.getStep()))};
sap.m.Slider.prototype.setValue=function(n){this.setValue=this._setValue;return this.setProperty("value",n,true)};
