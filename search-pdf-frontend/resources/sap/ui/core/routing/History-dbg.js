/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.core.routing.History");
jQuery.sap.require("sap.ui.core.routing.HashChanger");

/**
 * 
 * Used to determine the {sap.ui.core.HistoryDirection} of the current or a future navigation, done with a 
 * {sap.ui.core.routing.Router} or {sap.ui.core.routing.HashChanger}.
 * ATTENTION: this class will not be accurate if someone does hash-replacement without the named classes above
 * If you are manipulating the hash directly this class is not supported anymore.
 * 
 * @param {sap.ui.core.routing.HashChanger} hashChanger - required without a HashChanger this class cannot work. The class needs to be aware of the hash-changes.
 * @public
 * @class
 * @name sap.ui.core.routing.History
 */
sap.ui.core.routing.History = function(oHashChanger) {
	this._iHistoryLength = window.history.length;
	this._aHistory = [];
	this._bIsInitial = true;

	if (!oHashChanger) {
		jQuery.sap.log.error("sap.ui.core.routing.History constructor was called and it did not get a hashChanger as parameter");
	}

	this._oHashChanger = oHashChanger;
	this._oHashChanger.attachEvent("hashChanged", this._onHashChange, this);
	this._oHashChanger.attachEvent("hashReplaced", this._hashReplaced, this);
	this._oHashChanger.attachEvent("hashSet", this._hashSet, this);

	this._reset();
};


/**
 * Detaches all events and cleans up this instance
 */
sap.ui.core.routing.History.prototype.destroy = function(sNewHash) {
	this._oHashChanger.detachEvent("hashChanged", this._onHashChange, this);
	this._oHashChanger.detachEvent("hashReplaced", this._hashReplaced, this);
	this._oHashChanger.detachEvent("hashSet", this._hashSet, this);

	this._oHashChanger = null;
};

/**
 * Determines what the navigation direction for a newly given hash would be
 * It will say Unknown if there is a history foo - bar (current history) - foo
 * If you now ask for the direction of the hash "foo" you get Unknown because it might be backwards or forwards.
 * For hash replacements, the history stack will be replaced at this position for the history.
 * @param sNewHash {string} - optional, if this parameter is not passed the last hashChange is taken.
 * @public
 * @returns {sap.ui.core.routing.HistoryDirection} or undefined, if no navigation has taken place yet.
 */
sap.ui.core.routing.History.prototype.getDirection = function(sNewHash) {
	//no navigation has taken place and someone asks for a direction
	if (sNewHash !== undefined && this._bIsInitial) {
		return undefined;
	}

	if (sNewHash === undefined) {
		return this._sCurrentDirection;
	}

	return this._getDirection(sNewHash);
};

/**
 * Empties the history array, and sets the instance back to the unknown state.
 * @private
 */
sap.ui.core.routing.History.prototype._reset = function() {	
	this._aHistory.length = 0;
	this._iHistoryPosition = 0;
	this._bUnknown = true;

	/*
	 * if the history is reset it should always get the current hash since - 
	 * if you go from the Unknown to a defined state and then back is pressed we can be sure that the direction is backwards.
	 * Because the only way from unknown to known state is a new entry in the history.
	 */
	this._aHistory[0] = this._oHashChanger.getHash();
}

/**
 * Determines what the navigation direction for a newly given hash would be
 * @param sNewHash {string} the new hash
 * @private
 * @returns {sap.ui.core.routing.HistoryDirection}
 */
sap.ui.core.routing.History.prototype._getDirection = function(sNewHash, bHistoryLengthIncreased) {	
	var oDirection = sap.ui.core.routing.HistoryDirection;

	//Next hash was set by the router - it has to be a new entry
	if (this._oNextHash && this._oNextHash.sHash === sNewHash) {
		return oDirection.NewEntry;
	}

	//we have not had a direction yet and the application did not trigger navigation + the browser history does not increase
	//the user is navigating in his history but we cannot determine the direction
	if (this._bUnknown) {
		return oDirection.Unknown;
	}

	//increasing the history length will add entries but we cannot rely on this as only criteria, since the history length is capped
	if (bHistoryLengthIncreased) {
		return oDirection.NewEntry;
	}

	//At this point we know the user pressed a native browser navigation button

	//both directions contain the same hash we don't know the direction
	if (this._aHistory[this._iHistoryPosition + 1] === sNewHash && this._aHistory[this._iHistoryPosition - 1] === sNewHash) {
		return oDirection.Unknown;
	}

	if (this._aHistory[this._iHistoryPosition - 1] === sNewHash) {
		return oDirection.Backwards;
	}

	if (this._aHistory[this._iHistoryPosition + 1] === sNewHash) {
		return oDirection.Forwards;
	}

	//Nothing hit, return unknown since we cannot determine what happened
	return oDirection.Unknown;
};

sap.ui.core.routing.History.prototype._onHashChange = function(oEvent) {
	this._hashChange(oEvent.getParameter("newHash"));
};

/**
 * Handles a hash change and cleans up the History
 * @private
 */
sap.ui.core.routing.History.prototype._hashChange = function(sNewHash) {
	var oDirection = sap.ui.core.routing.HistoryDirection,
		iHistoryIndex = jQuery.inArray(sNewHash, this._aHistory),
		actualHistoryLength = window.history.length,
		sDirection;

	//We don't want to record replaced hashes
	if (this._oNextHash && this._oNextHash.bWasReplaced && this._oNextHash.sHash === sNewHash) {
		//Since a replace has taken place, the current history entry is also replaced
		this._aHistory[this._iHistoryPosition] = sNewHash;
		this._oNextHash = null;
		return;
	}

	//a navigation has taken place so the history is not initial anymore.
	this._bIsInitial = false;

	sDirection = this._sCurrentDirection = this._getDirection(sNewHash, this._iHistoryLength < window.history.length);

	if (this._oNextHash && !this._oNextHash.bWasReplaced) {
		this._iHistoryLength = actualHistoryLength + 1;
	} else {
		this._iHistoryLength = actualHistoryLength;
	}

	//the next hash direction was determined - set it back
	if (this._oNextHash) {
		this._oNextHash = null;
	}

	//We don't know the state of the history, don't record it set it back to unknown, since we can't say what comes up until the app navigates again
	if (sDirection === oDirection.Unknown) {
		this._reset();
		return;
	}

	//We are at a known state of the history now, since we have a new entry / forwards or backwards
	this._bUnknown = false;

	//new history entry
	if (sDirection === oDirection.NewEntry) {
		//new item and there where x back navigations before - remove all the forward items from the history
		if (this._iHistoryPosition + 1 < this._aHistory.length) {
			this._aHistory = this._aHistory.slice(0, this._iHistoryPosition + 1);
		}
		
		this._aHistory.push(sNewHash);
		this._iHistoryPosition += 1;
		return;
	} 

	if (sDirection === oDirection.Forwards) {
		this._iHistoryPosition++;
		return;
	}

	if (sDirection === oDirection.Backwards) {
		this._iHistoryPosition--;
	}
};

/**
 * Handles a hash change and cleans up the History
 * @private
 */
sap.ui.core.routing.History.prototype._hashSet = function(oEvent) {
	this._hashChangedByApp(oEvent.getParameter("sHash"), false);
};

/**
 * Handles a hash change and cleans up the History
 * @private
 */
sap.ui.core.routing.History.prototype._hashReplaced = function(oEvent) {
	this._hashChangedByApp(oEvent.getParameter("sHash"), true);
};

/**
 * Sets the next hash that is going to happen in the hashChange function - used to determine if the app or the browserHistory/links triggered this navigation
 * @param
 */
sap.ui.core.routing.History.prototype._hashChangedByApp = function(sNewHash, bWasReplaced) {
	this._oNextHash = { sHash : sNewHash, bWasReplaced : bWasReplaced };
};

(function() {
	var instance = new sap.ui.core.routing.History(sap.ui.core.routing.HashChanger.getInstance());

	/**
	 * @public 
	 * @returns { sap.ui.core.routing.History } a global singleton that gets created as soon as the sap.ui.core.routing.History is required
	 */
	sap.ui.core.routing.History.getInstance = function() {
		return instance;
	};
}());
