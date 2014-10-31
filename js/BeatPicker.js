function BeatPicker(options) {
    var byRef = {};
    $.extend(true, byRef, this, options);
    $.extend(this, byRef);
    this.constructor();
}
BeatPicker.prototype = {
    dateInputNode: null,
    pickerNode: null,
    daysSimple: ["Su" , "Mo" , "Tu" , "We" , "Th" , "Fr" , "Sa"],
    daysFull: [],
    monthsSimple: ["Jan" , "Feb" , "Mar" , "Apr"  , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec"],
    monthsFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    startDate: new Date(),
    currentDate: new Date(),
    //["DD" , "MM" , "YYYY"]//["MM" , "DD" , "YYYY"]//["DD" , "NM" , "YYYY"]
    //["YYYY" , "MM" , "DD"]
    dateFormat: {
        separator: "-",
        format: ["YYYY" , "MM" , "DD"]
    },
    modules: {
        header: true,
        footer: true,
        daysOfTheWeek: true,
        navBar: true,
        today: true,
        gotoDate: true,
        icon: true,
        clear: true
    },
    selectionRule: {
        single: true,
        range: false,
        rangeDisableSelect: false
    },
    className: {
        beatPicker: "beatpicker",
        header: "header",
        footer: "footer",
        days: "days",
        inputParent: "input-parent",
        headerNavBarParent: "header-navbar-container",
        headerNavBarButton: "header-navbar-button",
        weekDaysAliasCell: "week-alias-cell",
        weekDaysAliasCellParent: "week-alias-cell-parent",
        input: "beatpicker-input",
        inputTo: "beatpicker-input-to",
        betweenRange: "between-range",
        inputFrom: "beatpicker-input-from",
        daysCell: "days-cell",
        monthsCell: "months-cell",
        yearsCell: "years-cell",
        yearsRangeCell: "years-range-cell",
        daysCellParent: "days-cell-parent",
        todayButton: "today",
        todayBox: "today-box",
        gotoDateParent: "goto-date-parent",
        gotoDateInput: "goto-date",
        gotoDateButton: "goto-date-button",
        selected: "selected",
        disabled: "disabled",
        clear: "beatpicker-clear",
        _inner: {
            beatPicker: "beatpicker",
            inputContainer: "input-container",
            cell: "cell",
            cellM: "cell-months",
            cellY: "cell-years",
            cellYR: "cell-years-range",
            cellParent: "cell-parent",
            headerNavBar: "main-nav",
            headerNavBarBtn: "nav-btn",
            headerNavBarBtnNext: "next",
            headerNavBarBtnPrev: "prev",
            inputNode: "beatpicker-inputnode",
            dateInputTo: "beatpicker-inputnode-to",
            betweenDateNode: "between-range",
            dateInputFrom: "beatpicker-inputnode-from",
            headerNavBarBtnMonthIndicator: "current-indicator",
            notNotable: "not-notable",
            todayButton: "today",
            gotoDateInput: "date-input",
            gotoDateButton: "date-input-button",
            gotoDateContainer: "goto-date-container",
            footer: "footer",
            todayInGrid: "notable-today",
            selectedDate: "selected-date",
            disableDate: "date-disabled",
            clearButton: "beatpicker-clearButton",
            defaultButton: "button"
        }
    },
    view: {
        display: "days",
        alwaysVisible: false,
        position: ["bottom" , "left"],
        showOn: "click",
        hideOn: "click",
        isInputIsReadonly: true,
        iconImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAANAA0DASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgQF/8QAIxAAAQQBBAIDAQAAAAAAAAAAAQIDBBEFABIhQQYxExQiUf/EABQBAQAAAAAAAAAAAAAAAAAAAAX/xAAbEQACAgMBAAAAAAAAAAAAAAABIQAEFUFhMf/aAAwDAQACEQMRAD8Af5PxCZHiwYeRzUBuMwHPqoU0sJRdqXzVXwa9cCheqT4dl8zj4RXm4smIy3sjflwbU3yOe+K6raB1p/k8VFyTjJl/MoNhaQhLhSk7hRsD2a761lePSnV4dCo+1ptLzraUrtZoKuyomySSST/TpHK2EwuDfsOxddovp1P/2Q=="
    },
    labels: {
        today: "Today",
        gotoDateInput: "YYYY/MM/DD",
        gotoDateButton: "GO",
        clearButton: "Clear"
    },
    events: {
        select: "select",
        change: "change",
        show: "show",
        hide: "hide",
        clear: "clear"
    },
    disablingRules: [],

    //PRIVATE FIELD DONT TRY TO MANIPULATE THESE IF YOU DONT KNOW WHAT ARE YOU DOING
    _inputParentNode: null,
    _dateInputToNode: null,
    _dateRows: [],
    _monthsRows: [],
    _yearsRows: [],
    _yearsRangeRows: [],
    _monthUnit: "MM",
    _yearUnit: "YYYY",
    _dayUnit: "DD",
    _todayNode: null,
    _calendarMainNode: null,
    _selectedDateNode: null,
    _selectedDate: null,
    _startRangeSelectedDate: null,
    _startRangeSelectedDateBk: null,
    _startRangeSelectedNode: null,
    _endRangeSelectedDate: null,
    _endRangeSelectedDateBk: null,
    _endRangeSelectedNode: null,
    _isFromDateOpened: false,
    _isToDateOpened: false,
    _isHide: true,
    _disableDateMap: [],
    _displaySet: {days: "days", months: "months", years: "years"},
    _briefDateScope: {briefDate: "BRIEFDATE", yearName: "YEARNAME", yearsRange: "YEARSRANGE"},
    _rulesCharacterSet: {"<": "<", ">": ">", "*": "*"},
    //TOPIC MAP
    _topicMap: {},

    constructor: function () {
        !window.beatPickerList && (window.beatPickerList = []);
        window.beatPickerList.push(this);
        this._enhanceLibFunctions();
        this._setStartDate(this.startDate);
        this._disablingRuleEngine();
        this._prepareInput();
        //MAIN
        var calendar = this._calendarMainNode = this.pickerNode = this._baseDom();
        this._eventAndPositioning();
        //MODULES
        if (this.modules.header) {
            var header = this._createHeader();
            calendar.prepend(header);
        }
        if (this.modules.navBar && header)
            calendar.append(this._createNavBar(header));

        calendar.append(this._createDateMatrices());

        if (this.modules.footer) {
            var footer = this._createFooter();
            calendar.append(footer);
        }

        if (this.modules.footer && this.modules.today)
            this._createToday(footer);

        if (this.modules.footer && this.modules.gotoDate)
            this._createGotoDate(footer);

        if (this.modules.icon)
            this._createIcon();

        if (this.modules.clear)
            this._createClear();

        this._getDecisionOnEvents();

        this.view.alwaysVisible && this.show();

    },
    //**********************************************//
    //**********************************************//
    //*************INITIAL BASE VALUES**************//
    //**********************************************//
    //**********************************************//
    _setStartDate: function (dateOb) {

        if (typeof dateOb === "string")
            this.startDate = new Date(dateOb);
        else if (dateOb instanceof Array)
            this.startDate = new Date(this.startDate[0], this.startDate[1] - 1, this.startDate[2]);
        else if (dateOb instanceof Object)
            this.startDate = dateOb;
        this.currentDate = this.startDate;

    },
    _prepareInput: function () {

        this.dateInputNode.after(this._inputParentNode = this._domGenerator("div", {
            class: this._addClass(this.className.inputParent, this.className._inner.inputContainer)
        }));

        this.dateInputNode.appendTo(this._inputParentNode)
            .addClass(this._addClass(this.className.input, this.className._inner.inputNode));

        this.selectionRule.range && this.dateInputNode.addClass(this._addClass(this.className.inputFrom, this.className._inner.dateInputFrom)).after(
            this._dateInputToNode = this._domGenerator("input", {
                type: 'text',
                class: this._addClass(this.className.inputTo, this.className._inner.dateInputTo, this.className.input, this.className._inner.inputNode)
            }, this._inputParentNode)
        );

        this.view.isInputIsReadonly && this.dateInputNode.add(this.selectionRule.range ? this._dateInputToNode : {}).attr("readonly", true);
    },

    //**********************************************//
    //**********************************************//
    //***************MODULE CREATION****************//
    //**********************************************//
    //**********************************************//
    _baseDom: function () {
        return this._domGenerator("div", {class: this._addClass(this.className.beatPicker, this.className._inner.beatPicker) }, this.view.alwaysVisible ? this._inputParentNode : $("body"));
    },
    _createClear: function () {
        var self = this;
        var elem = this._domGenerator("button", {class: this._addClass(this.className.clear, this.className._inner.clearButton, this.className._inner.defaultButton) , type:"button"}, null, this.labels.clearButton);
        elem.on("click", function () {
            if (self._selectedDate || self._startRangeSelectedDate || self._endRangeSelectedDate) {
                var options = {timeStamp: new Date().getTime()};
                if (self.selectionRule.range)
                    $.extend(options, {
                        startDate: self._startRangeSelectedDate,
                        startDateString: self._startRangeSelectedDate ? self._dateFormatting(self._startRangeSelectedDate) : null,
                        endDate: self._endRangeSelectedDate,
                        endDateString: self._endRangeSelectedDate ? self._dateFormatting(self._endRangeSelectedDate) : null
                    });
                else if (self.selectionRule.single)
                    $.extend(options, {
                        date: self._selectedDate,
                        string: self._dateFormatting(self._selectedDate)
                    });

                self._notifySubscribers(self.events.clear, options);
                self.reset();
            }
        });
        this._inputParentNode.append(elem);
    },
    _createIcon: function () {
        this.dateInputNode.add(this._dateInputToNode).css("background-image", "url('" + this.view.iconImage + "')")
    },
    _createNavBar: function (header) {
        var self = this;
        var navBarParent =
            this._domGenerator("div", {class: this._addClass(this.className.headerNavBarParent, this.className._inner.headerNavBar) }, header, "", true);

        this._domGenerator("a", {
            class: this._addClass(this.className.headerNavBarButton, this.className._inner.headerNavBarBtn, this.className._inner.headerNavBarBtnNext, this.className._inner.defaultButton)  }, navBarParent, ">")
            .on("click", function () {
                self._increaseUnity(false);
            });

        var currentIndicator = this._currentIndicator = this._domGenerator("a", {
            class: this._addClass(this.className.headerNavBarButton, this.className._inner.headerNavBarBtn, this.className._inner.headerNavBarBtnMonthIndicator, this.className._inner.defaultButton)
        }, navBarParent)
            .on('click', function () {
                self._ExpandOrCollapse(true)
            });

        this._currentBriefDateSet(currentIndicator, this._briefDateScope.briefDate);

        this._domGenerator("a", {
            class: this._addClass(this.className.headerNavBarButton, this.className._inner.headerNavBarBtn, this.className._inner.headerNavBarBtnPrev, this.className._inner.defaultButton)}, navBarParent, "<")
            .on("click", function (e) {
                self._increaseUnity(true);
            });

    },
    _createHeader: function () {
        var headerContainer = this._domGenerator("div", {"class": this.className.header});
        this.modules.daysOfTheWeek && headerContainer.append(this._createDaysOfTheWeek(this.daysSimple));
        return headerContainer;

    },
    _createDaysOfTheWeek: function (days) {
        if (days instanceof Array) {
            var ul = this._weekDayParent = this._domGenerator("ul", {class: this.className.weekDaysAliasCellParent + " " + this.className._inner.cellParent});
            this.forEach(days, function (index, item) {
                this._domGenerator("li", {class: this.className.weekDaysAliasCell + " " + this.className._inner.cell}, ul, item);
            }, this);
            return ul;
        }
    },
    _createFooter: function () {
        return this._footerNode = this._domGenerator("div", {"class": this._addClass(this.className.footer, this.className._inner.footer)});

    },
    _createToday: function (footer) {
        var self = this;
        this._domGenerator("a", {class: this._addClass(this.className.todayButton, this.className._inner.todayButton, this.className._inner.defaultButton)}, footer, this.labels.today)
            .on("click", function (e) {
                self.currentDate = new Date();
                self._updateDateMatricesExactDate(self.currentDate);
            })
    },
    _createGotoDate: function (footer) {
        var self = this;
        var container = this._domGenerator("div", {
            class: this._addClass(this.className.gotoDateParent, this.className._inner.gotoDateContainer)
        }, footer);

        var go = this._domGenerator("input", {
            type: "text",
            class: this._addClass(this.className.gotoDateInput, this.className._inner.gotoDateInput),
            placeholder: this.labels.gotoDateInput
        }, container).on("keydown", function (e) {
            if (e.keyCode === 13)
                self._jumpToDateFromInput(go);
        });

        this._domGenerator("a", {
            type: "button",
            class: this._addClass(this.className.gotoDateButton, this.className._inner.gotoDateButton, this.className._inner.defaultButton)
        }, container, this.labels.gotoDateButton).on("click", function () {
            self._jumpToDateFromInput(go);
        });

    },
    _createDateMatrices: function () {
        var self = this;
        this._notifySubscribers(this.events.change, {date: this.currentDate, timeStamp: new Date().getTime()});
        if (!this._daysBody) {
            var daysBody = this._daysBody = this._domGenerator("div", {class: this.className.days});
        }
        this._daysCellParent && this._daysCellParent.empty();
        this._dateRows.length = this._monthsRows.length = this._yearsRows.length = 0;
        if (!this._daysCellParent)
            var daysCellParent = this._daysCellParent = this._domGenerator("ul", {class: this.className.daysCellParent + " " + this.className._inner.cellParent}, this._daysBody);
        if (this.view.display === this._displaySet.days) {
            this._weekDayParent && this._weekDayParent.show();
            this._daysBody.find(daysCellParent).empty();
            for (var i = 0; i < 42; i++) {
                var li = this._domGenerator("li", {class: this.className.daysCell + " " + this.className._inner.cell}, this._daysCellParent);
                this._dateRows.push(li);
                var dayCheck = this._bindDateToRows(i, li);
                li.data("click-behaviour", dayCheck.isNextMonth);
                li.on("click", function (e) {
                    var clickBehaviour = $(this).data("click-behaviour");
                    var isDisabled = $(this).data("disabled");
                    !isDisabled && self._dateSelect(e);
                    clickBehaviour !== "not-avail" && self._updateDateMatrices(clickBehaviour ? 1 : -1, self._monthUnit);
                });
                li.text(dayCheck.day);
                this.selectionRule.single && this._findSelectedDate(this._dateRows[i].data("date"), this._dateRows[i])

            }
            this._markToday(new Date());
            if (this.selectionRule.range)
                this._addClassToRange(this._startRangeSelectedDate, this._endRangeSelectedDate);
        } else {
            if (this.view.display === this._displaySet.months) {
                this._createMonths();
                this._currentBriefDateSet(this._currentIndicator, this._briefDateScope.yearName);
            }

            else if (this.view.display === this._displaySet.years) {
                this._currentBriefDateSet(this._currentIndicator, this._briefDateScope.yearsRange);
                this._createYears();
            }
        }
        return daysBody;
    },
    _createMonths: function () {
        var self = this;
        this._weekDayParent && this._weekDayParent.hide();
        for (var i = 0; i <= 11; i++) {
            var li = this._domGenerator("li", {
                class: this._addClass(this.className.monthsCell, this.className._inner.cell, this.className._inner.cellM)
            }, this._daysCellParent, this.monthsSimple[i])
                .on("click", function () {
                    self.view.display = self._displaySet.months;
                    self._ExpandOrCollapse(false, $(this).data("date"));
                });
            this._monthsRows.push(li);
            li.data("date", this._setAppropriateDate(i, true));
        }
    },
    _createYears: function () {
        var self = this;
        this._weekDayParent && this._weekDayParent.hide();
        var years = this._getYearsRange(this.currentDate.getFullYear());
        for (var i = 0; i <= 11; i++) {
            var li = this._domGenerator("li", {
                class: this._addClass(this.className.yearsCell, this.className._inner.cell, this.className._inner.cellY)
            }, this._daysCellParent, years[i]).on("click", function () {
                self.view.display = self._displaySet.years;
                self._ExpandOrCollapse(false, $(this).data("date"));
            });
            this._yearsRows.push(li);
            li.data("date", this._setAppropriateDate(years[i], false));
        }
    },
    _updateMonths: function () {
        for (var i in this._monthsRows) {
            this._monthsRows[i].data("date", this._setAppropriateDate(i, true));
        }
    },
    _updateYears: function () {
        var years = this._getYearsRange(this.currentDate.getFullYear());

        for (var i in this._yearsRows) {
            this._yearsRows[i].data("date", this._setAppropriateDate(years[i], false));
            this._yearsRows[i].text("").text(years[i])
        }
    },
    /***********************************************/



    //**********************************************//
    //**********************************************//
    //***************POSITION DATEPICKER************//
    //**********************************************//
    //**********************************************//
    _eventAndPositioning: function () {
        var self = this;
        if (!this.view.alwaysVisible) {
            self._calendarMainNode.css("display", "none");
            $('html,body').on(this.view.hideOn, function (e) {
                !self._isHide && self.hide();
            });
            this._calendarMainNode.on("click", function (e) {
                e.stopPropagation();
            })
        }

        var elem = this.dateInputNode;
        this.selectionRule.range && (elem = this.dateInputNode.add(this._dateInputToNode));
        elem.on(this.view.showOn, function (e) {
            e.stopPropagation();
            if (self._isHide || self.selectionRule.range) {
                var filter = $.grep(window.beatPickerList, function (item , index) {
                    return item !== self && !item.view.alwaysVisible
                });
                self.forEach(filter, function (index, item) {
                    !item.isHide() && item.hide();
                }, self);
                self.show(e);
            }
        });
    },
    _positionThisNodePlease: function (currentTarget, pos) {
        var geometry = this._positionCalculation(currentTarget, pos);
        this._calendarMainNode.css({left: geometry.x, top: geometry.y});
    },
    _positionCalculation: function (currentTarget, pos) {
        var dynamicsGeometry = this._dynamicsGeometry(currentTarget);
        var x = (pos && pos.x) || this.view.position[0];
        var y = (pos && pos.y) || this.view.position[1];
        var self = this;
        var calculationMap = {
            rightTop: function () {
                x = this._rightCommon();
                y = this._topCommon() - self._calendarMainNode.outerHeight();
            },
            rightMiddle: function () {
                x = this._rightCommon();
                y = this._topCommon() - (self._calendarMainNode.outerHeight() / 2 ) + self.dateInputNode.outerHeight() / 2
            },
            rightBottom: function () {
                x = this._rightCommon();
                y = this._topCommon();
            },
            leftTop: function () {
                x = this._leftCommon();
                y = this._topCommon() - self._calendarMainNode.outerHeight();
            },
            leftMiddle: function () {
                x = this._leftCommon();
                y = this._topCommon() - (self._calendarMainNode.outerHeight() / 2 ) + self.dateInputNode.outerHeight() / 2;
            },
            leftBottom: function () {
                x = this._leftCommon();
                y = this._topCommon()
            },
            bottomRight: function () {
                y = this._bottomCommon();
                x = this._rightCommon() - self._calendarMainNode.outerWidth();
            },
            bottomMiddle: function () {
                y = this._bottomCommon();
                x = this._leftCommon() + (dynamicsGeometry.width / 2) + self._calendarMainNode.width() / 2;
            },
            bottomLeft: function () {
                y = this._bottomCommon();
                x = this._leftCommon() + self._calendarMainNode.outerWidth();
            },
            topRight: function () {
                y = this._topCommon() - (self._calendarMainNode.outerHeight());
                x = this._rightCommon() - self._calendarMainNode.outerWidth();
            },
            topMiddle: function () {
                y = this._topCommon() - (self._calendarMainNode.outerHeight());
                x = this._leftCommon() + (dynamicsGeometry.width / 2) + self._calendarMainNode.width() / 2;
            },
            topLeft: function () {
                y = this._topCommon() - self._calendarMainNode.outerHeight();
                x = this._leftCommon() + self._calendarMainNode.outerWidth();
            },
            left: function () {
                x = this._leftCommon();
                y = this._topAutoCommon();
            },
            top: function () {
                y = this._topCommon() - self._calendarMainNode.outerHeight();
                x = this._leftAutoCommon();
            },
            right: function () {
                x = this._rightCommon();
                y = this._topAutoCommon();
            },
            bottom: function () {
                y = this._bottomCommon();
                x = this._leftAutoCommon();
            },
            "**": function () {
                y = this._topAutoCommon();
                x = this._leftAutoCommon();
            },
            customAdjustment: function () {
                y = dynamicsGeometry.y + (+y);
                x = dynamicsGeometry.x + (+x);
            },
            _rightCommon: function () {
                return dynamicsGeometry.x + dynamicsGeometry.width;
            },
            _bottomCommon: function () {
                return dynamicsGeometry.y + dynamicsGeometry.height;
            },
            _leftCommon: function () {
                return dynamicsGeometry.x - self._calendarMainNode.outerWidth();
            },
            _topCommon: function () {
                return dynamicsGeometry.y;
            },
            _topAutoCommon: function () {
                var y;
                if (+(this._topCommon() + self._calendarMainNode.outerHeight() - $(window).scrollTop()) > $(window).height()) {
                    y = ($(window).height() + $(window).scrollTop()) - self._calendarMainNode.outerHeight();
                    if ($(window).height() < self._calendarMainNode.outerHeight())
                        y = $(window).scrollTop();
                } else
                    y = this._topCommon();
                return Math.floor(y);
            },
            _leftAutoCommon: function () {
                var x;
                var offsetLeft = this._leftCommon() + self._calendarMainNode.outerWidth();
                if (offsetLeft + self._calendarMainNode.outerWidth() > $(window).width()) {
                    x = $(window).width() - self._calendarMainNode.outerWidth();
                    if (x <= 0)
                        x = $(window).scrollLeft();
                } else
                    x = offsetLeft;
                return Math.floor(x);
            }
        };
        if (isNaN(x) && isNaN(y)) {
            var firstFunctionWord = x;
            var lastFunctionWord = y.substr(0, 1).toUpperCase() + this.view.position[1].substr(1);
            var func = (x === "*" && y === "*") ? "**" : y == "*" ? firstFunctionWord : firstFunctionWord + lastFunctionWord;
            if (func === "**" && this.view.alwaysVisible)
                func = "bottomLeft";
            func in calculationMap && calculationMap[func]();
        } else if (!isNaN(x) && !isNaN(y)) {
            calculationMap.customAdjustment();
        }
        return {y: y, x: x};
    },
    /**************************************************/


    //**********************************************//
    //**********************************************//
    //****DATEPICKER DATES CORE FUNCTIONALITY*******//
    //**********************************************//
    //**********************************************//
    _dateSelect: function (e) {
        var elem = $(e.currentTarget || e.originalEvent.currentTarget);
        var dateObj = elem.data("date");
        var date = this._dateFormatting(dateObj);
        var optionToNotify = {};
        if (this.selectionRule.single) {
            this._selectedDateNode && this._removeClassFromSelectedDate(this._selectedDateNode);
            this._selectedDate = new Date(dateObj.getTime());
            this.dateInputNode.val(date);
            this._selectedDateNode = elem;
            !this.view.alwaysVisible && this.hide();
            this._addClassToSelectedDate(this._selectedDateNode);
            optionToNotify = {dateObj: dateObj, string: date, timeStamp: new Date().getDate()};
            this._notifySubscribers(this.events.select, optionToNotify);
        } else if (this.selectionRule.range) {
            if (this._isFromDateOpened) {
                this._startRangeSelectedDateBk = dateObj;
                this._resetRules(true);
            } else if (this._isToDateOpened) {
                this._endRangeSelectedDateBk = dateObj;
                this._resetRules(false);
            }
            if (this.selectionRule.rangeDisableSelect || !this._checkForRangeDisable(this._startRangeSelectedDateBk, this._endRangeSelectedDateBk, this._isFromDateOpened)) {
                optionToNotify = {fromDate: this._startRangeSelectedDate, toDate: this._endRangeSelectedDate, timeStamp: new Date().getTime()};
                if (this._isFromDateOpened) {
                    this._startRangeSelectedNode && this._removeClassFromSelectedDate(this._startRangeSelectedNode);
                    this._startRangeSelectedNode = elem;
                    this._startRangeSelectedDate = this._startRangeSelectedDateBk = dateObj;
                    $.extend(optionToNotify, {fromDate: this._startRangeSelectedDate});
                    this._notifySubscribers(this.events.select, optionToNotify);
                    this.dateInputNode.val(date);
                    this.show({currentTarget: this._dateInputToNode[0]});
                } else if (this._isToDateOpened) {
                    this._endRangeSelectedNode && this._removeClassFromSelectedDate(this._endRangeSelectedNode);
                    this._endRangeSelectedNode = elem;
                    this._endRangeSelectedDate = this._endRangeSelectedDateBk = dateObj;
                    $.extend(optionToNotify, {toDate: this._endRangeSelectedDate});
                    this._notifySubscribers(this.events.select, optionToNotify);
                    this._dateInputToNode.val(date);
                    this._closeIfFill() && !this._startRangeSelectedDate && this.show(this.dateInputNode);
                }
                this._addClassToSelectedDate(elem);
                (this._startRangeSelectedDate && this._endRangeSelectedDate ) &&
                this._addClassToRange(this._startRangeSelectedDate, this._endRangeSelectedDate);
            } else {
                this._endRangeSelectedDateBk = this._endRangeSelectedDate ? new Date(this._endRangeSelectedDate.getTime()) : null;
                this._startRangeSelectedDateBk = this._startRangeSelectedDate ? new Date(this._startRangeSelectedDate.getTime()) : null;
            }
        }

    },
    _currentBriefDateSet: function (currentIndicator, type) {
        if (currentIndicator) {
            if (type === this._briefDateScope.briefDate)
                (currentIndicator || this._currentIndicator)["text"](this.monthsFull[this.currentDate.getMonth()] + " " + this.currentDate.getFullYear());
            else if (type === this._briefDateScope.yearName)
                (currentIndicator || this._currentIndicator)["text"](this.currentDate.getFullYear());
            else if (type === this._briefDateScope.yearsRange) {
                var years = this._getYearsRange(this.currentDate.getFullYear());
                (currentIndicator || this._currentIndicator)["text"](years[0] + "-" + years[years.length - 1]);
            }
        }
    },
    _updateDateMatrices: function (value, unit, isInner) {
        var unitMap = {
            YYYY: "FullYear",
            MM: "Month",
            DD: "Date"
        };
        var currentValue = this.currentDate["get" + unitMap[unit]]();
        var dateBackUp = new Date(this.currentDate.getTime());
        if (this.currentDate.getDate() === 31 && unit === this._monthUnit)
            this.currentDate.setDate(28);
        this.currentDate["set" + unitMap[unit]](currentValue + value);
        if (this.currentDate.getFullYear() >= 0)
            this._updateDateMatricesCommon(isInner);
        else
            this.currentDate = new Date(dateBackUp.getTime());
    },
    _updateDateMatricesExactDate: function (exactDate, currentIndicator, isInner) {
        this.currentDate = new Date(exactDate.getTime());
        this._updateDateMatricesCommon(isInner);
    },
    _updateDateMatricesCommon: function (isInner) {
        !isInner &&
        this._notifySubscribers(this.events.change, {date: this.currentDate, string: this._dateFormatting(this.currentDate), timeStamp: new Date().getTime()});

        if (this.view.display === this._displaySet.days) {

            this._selectedDateNode && this._removeClassFromSelectedDate(this._selectedDateNode);
            if (this.selectionRule.range) {
                if (this._isFromDateOpened)
                    this._endRangeSelectedDate && this._disableDates(this._endRangeSelectedDate, false);
                else if (this._isToDateOpened)
                    this._startRangeSelectedDate && this._disableDates(this._startRangeSelectedDate, true);
            }
            for (var i in this._dateRows) {
                var objectDateInfo = this._bindDateToRows(+i, this._dateRows[i]);
                this._dateRows[i].data("click-behaviour", objectDateInfo.isNextMonth);
                $(this._dateRows[i]).text("").text(objectDateInfo.day);
                this.selectionRule.single && this._findSelectedDate(this._dateRows[i].data("date"), this._dateRows[i])
            }
            if (this.selectionRule.range)
                this._addClassToRange(this._startRangeSelectedDate, this._endRangeSelectedDate);
            this._markToday(new Date());
            this._currentBriefDateSet(this._currentIndicator, this._briefDateScope.briefDate);

        } else {
            if (this.view.display === this._displaySet.months) {
                this._updateMonths();
                this._currentBriefDateSet(this._currentIndicator, this._briefDateScope.yearName);

            }
            else if (this.view.display === this._displaySet.years) {
                this._updateYears();
                this._currentBriefDateSet(this._currentIndicator, this._briefDateScope.yearsRange);
            }
        }
    },
    _markToday: function (date) {
        if (this.modules.today) {
            date = date || this.currentDate;
            this._todayNode && this._todayNode.removeClass(this.className._inner.todayInGrid).removeClass(this.className.todayBox);
            for (var i in this._dateRows) {
                if (this._dateEqualsTo(this._dateRows[i].data("date"), date)) {
                    this._todayNode = this._dateRows[i];
                    $(this._dateRows[i]).addClass(this.className._inner.todayInGrid).addClass(this.className.todayBox);
                }
            }
        }

    },
    _findSelectedDate: function (date, elem) {

        if (this._selectedDate && this._dateEqualsTo(date, this._selectedDate)) {
            this._selectedDateNode = elem;
            this._addClassToSelectedDate(elem);
        }

    },
    _bindDateToRows: function (day, dom) {
        var self = this;
        var date = new Date(this.currentDate.getTime());
        dom.removeClass(this.className._inner.notNotable);
        var daysNumber = this._numberOfDaysInMonth(date);
        var currentDateInfo = this._currentDateExpose(date);
        var isNextMonth = false;
        if (day >= currentDateInfo.firstDay && day < daysNumber.nowMonthDays + currentDateInfo.firstDay) {
            day = day - currentDateInfo.firstDay + 1;
            isNextMonth = "not-avail";
            if (date.getDate() == day - 1 && date.getHours() == 0 && currentDateInfo.month == 2) {//DayLightSaving
                date = new Date(currentDateInfo.year, currentDateInfo.month, currentDateInfo.date + 1, 2)
            } else
                date.setDate(day);
        } else if (day < currentDateInfo.firstDay) {
            var calPrevDay = daysNumber.prevMonthDays - (currentDateInfo.firstDay - day - 1);
            date.setMonth(date.getMonth() - 1);
            date.setDate(calPrevDay);
            dom.addClass(this.className._inner.notNotable);
            day = calPrevDay;
        } else if (day >= daysNumber.nowMonthDays + currentDateInfo.firstDay) {
            var calNextDay = ( day + 1 ) - (currentDateInfo.firstDay + daysNumber.nowMonthDays);
            date.setMonth(date.getMonth() + 1);
            date.setDate(calNextDay);
            dom.addClass(this.className._inner.notNotable);
            isNextMonth = true;
            day = calNextDay;
        }
        dom.data("date", date);
        this._checkDisabling(date, dom);
        return {day: day, isNextMonth: isNextMonth};
    },
    _currentDateExpose: function (date) {
        var backUpDate = new Date(date.getTime());
        backUpDate.setDate(1);
        return { firstDay: backUpDate.getDay(), date: date.getDate(), day: date.getDay(), month: date.getMonth(), year: date.getFullYear()}
    },
    _numberOfDaysInMonth: function (date) {
        var month = date.getMonth();
        var year = date.getFullYear();
        return {
            prevMonthDays: this._getNumberOfDays(month - 1 < 0 ? 11 : month - 1, month - 1 < 0 ? year - 1 : year),
            nowMonthDays: this._getNumberOfDays(month, year),
            nextMonthDays: this._getNumberOfDays(month + 1 > 11 ? 1 : month, month + 1 > 11 ? year + 1 : year)
        }
    },
    _getNumberOfDays: function getDaysInMonth(m, y) {
        if (/8|3|5|10/.test(m)) return 30;
        if (m != 1) return 31;
        if (( y % 4 == 0 && y % 100 != 0 ) || y % 400 == 0) return 29;
        return 28;
    },

    //FORMATTING
    _dateFormatting: function (date) {
        var day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
        var isNM = this.dateFormat.format[0] == 'NM' || this.dateFormat.format[1] == 'NM' || this.dateFormat.format[2] == 'NM';
        var dateMap = {
            DD: +day >= 10 || isNM ? +day : "0" + day,
            MM: month >= 10 ? month : "0" + month,
            YYYY: year,
            YY: String(year).substr(2),
            NM: this.monthsFull[+month - 1]
        };
        var dateSeparator = this.dateFormat.separator;
        var dateString = "";
        this.forEach(this.dateFormat.format, function (index, elem) {
            dateMap[elem] && ( dateString += dateMap[elem] + (index < 2 ? dateSeparator : ""));
        }, this);
        return dateString;
    },


    //DISABLING RULES ENGINE IMPLS//

    _disableDates: function (compareDate, fromOrTo) {
        var rule = this._interpretRule(compareDate, compareDate);
        for (var i in this._dateRows) {
            var elem = this._dateRows[i];
            var date = elem.data("date");
            this._removeDisableClass(elem);
            elem.data("disabled", false);
            var dateInfo = this._currentDateExpose(date);
            if (this[fromOrTo ? "_isLessThan" : "_isBiggerThan"](dateInfo, rule, true)) {
                this._addDisableClass(elem);
                elem.data("disabled", true);
            }
        }
    },
    _backToNormalDisableRule: function () {
        for (var i in this._dateRows) {
            var elemDate = this._dateRows[i].data("date");
            this._checkDisabling(elemDate, this._dateRows[i]);
        }

    },
    _resetRules: function (fromDate) {
        if (fromDate === "BOTH") {
            delete this._disableDateMap[this._lastIndexOfFromDate];
            delete this._disableDateMap[this._lastIndexOfToDate]
        } else {
            if (fromDate) {
                delete this._disableDateMap[this._lastIndexOfFromDate]
            } else {
                delete this._disableDateMap[this._lastIndexOfToDate]
            }
        }

    },
    _addRule: function (from, to, fromDate) {
        var rule = this._interpretRule(from, to);
        if (rule) {
            this._resetRules(fromDate);
            this._disableDateMap.unshift(rule);
            var index = 0;
            if (fromDate) {
                this._lastIndexOfToDate === 0 && (this._lastIndexOfToDate = 1);
                this._lastIndexOfFromDate = index
            } else {
                this._lastIndexOfFromDate === 0 && (this._lastIndexOfFromDate = 1);
                this._lastIndexOfToDate = index
            }
        }
    },
    _disablingRuleEngine: function () {
        for (var i in this.disablingRules) {
            var obj = this.disablingRules[i];
            var from = obj.from;
            var to = obj.to;
            if (isNaN(Date.parse(obj.from))) {
                if (!this._isInRuleCharset(from))
                    return;
            }
            else
                from = new Date(from);

            if (isNaN(Date.parse(obj.to))) {
                if (!to instanceof Array && !to in this._rulesCharacterSet)
                    return
            } else
                to = new Date(obj.to);

            var ruleMap = this._interpretRule(obj.from, obj.to);
            ruleMap && this._disableDateMap.push(ruleMap);
        }
    },

    _interpretRule: function (from, to) {
        var fromIsDate = !isNaN(Date.parse(from)) || from instanceof Date;
        var toIsDate = !isNaN(Date.parse(to)) || to instanceof Date;

        var fromIsArray = this._isArray(from);
        var toIsArray = this._isArray(to);

        var fromIsString = this._isString(from);
        var toIsString = this._isString(to);

        var talkingLanguage = {
            fromDate: null, toDate: null,
            fromMonth: null, toMonth: null,
            fromYear: null, toYear: null
        };
        var fromDateInfo;
        var toDateInfo;
        if (fromIsDate && toIsDate) {
            fromDateInfo = this._currentDateExpose(new Date(from));
            toDateInfo = this._currentDateExpose(new Date(to));
        } else {
            fromDateInfo = fromIsDate ? this._currentDateExpose(new Date(from)) : this._giveMeRules(from);
            toDateInfo = toIsDate ? this._currentDateExpose(new Date(to)) : this._giveMeRules(to);
        }

        talkingLanguage.fromDate = fromDateInfo.date;
        talkingLanguage.fromMonth = fromDateInfo.month;
        talkingLanguage.fromYear = fromDateInfo.year;
        talkingLanguage.toDate = toDateInfo.date;
        talkingLanguage.toMonth = toDateInfo.month;
        talkingLanguage.toYear = toDateInfo.year;
        return talkingLanguage;

    },
    _giveMeRules: function (rule) {
        var rules = {};
        if (rule instanceof Array) {
            rules.date = rule[2];
            rules.month = isNaN(+rule[1]) ? rule[1] : +rule[1] - 1;
            rules.year = rule[0]
        }
        typeof rule === "string" && (rules.date = rules.month = rules.year = rule);
        return rules
    },
    _isInRuleCharset: function (array) {
        if (!array instanceof Array) return false;
        var seemsIsThere = false;
        for (var i in array)
            if (array[i] in this._rulesCharacterSet)
                seemsIsThere = true;
        return seemsIsThere;
    },
    _isMatchToStringRule: function (dateInfo, rule) {
        var self = this;
        var dateMapRuleFuntion = {
            ">": this._isBiggerThan,
            "<": this._isLessThan,
            "*": function (infoDate, ruleSet) { //Factorial state for complex query implementaion
                if (self._isBiggerThan(dateInfo, rule, true) || rule.fromYear === "*")
                    if (ruleSet.toYear === "*") {
                        if (ruleSet.toMonth === "*") {
                            if (ruleSet.toDate === "*")
                                return true;
                            else
                                return infoDate.date == ruleSet.toDate;
                        } else {
                            if (ruleSet.toDate === "*")
                                return infoDate.month == ruleSet.toMonth;
                            else
                                return infoDate.month == ruleSet.toMonth && infoDate.date == ruleSet.toDate;
                        }
                    } else {
                        if (ruleSet.toMonth === "*") {

                            if (ruleSet.toDate === "*") {
                                return infoDate.year == ruleSet.toYear;
                            } else
                                return infoDate.year == ruleSet.toYear && infoDate.date == ruleSet.toDate

                        } else {
                            if (ruleSet.toDate === "*") {
                                return infoDate.year == ruleSet.toYear && infoDate.month == ruleSet.toMonth;
                            } else
                                return infoDate.year == ruleSet.toYear && infoDate.month == ruleSet.toMonth && infoDate.date == ruleSet.toDate

                        }

                    }

            }
        };
        for (var i in rule) {
            if (rule[i] === ">" || rule[i] === "<")
                return dateMapRuleFuntion[rule.toDate](dateInfo, rule, true);
            if (rule[i] === "*")
                return dateMapRuleFuntion[rule[i]](dateInfo, rule)
        }
    },
    _isMatchingToDisableRule: function (date) {

        var dateInfo = this._currentDateExpose(date);
        var disabled = false;
        for (var i in this._disableDateMap) {
            var rule = this._disableDateMap[i];
            rule && (disabled = this._isInRuleCharset(rule) ? this._isMatchToStringRule(dateInfo, rule) : this._isBiggerThan(dateInfo, rule, true) && this._isLessThan(dateInfo, rule, false));
            if (disabled)
                return disabled;
        }
        return disabled;
    },

    _checkDisabling: function (date, dateRow) {
        if (this._isMatchingToDisableRule(date)) {
            dateRow.data("disabled", true);
            this._addDisableClass(dateRow);
        }
        else {
            dateRow.data("disabled", false);
            this._removeDisableClass(dateRow);
        }

    },
    _checkForRangeDisable: function (from, to, isFromDateOpened) {
        if (from && to) {
            var toBackUp = new Date(to.getTime());
            var fromBackUp = new Date(from.getTime());
            isFromDateOpened ? toBackUp.setDate(toBackUp.getDate() - 1) : fromBackUp.setDate(fromBackUp.getDate() + 1);
            var dates = this._getRangeDates(fromBackUp, toBackUp);
            for (var i in dates) {
                if (this._isMatchingToDisableRule(dates[i]))
                    return true;
            }
            return false;
        }
        return false;
    },
    //**********************************************//
    //**********************************************//
    //***********INNER UTILS FUNCTION***************//
    //**********************************************//
    //**********************************************//

    //DISABLING RULES UTILS HANDY FUNCTIONS//
    _isBiggerThan: function (dateInfo, rule, isFrom) {
        var helper = isFrom ? "from" : "to";
        if (dateInfo.year > rule[helper + "Year"]) return true;
        if (dateInfo.year == rule[helper + "Year"] && dateInfo.month > rule[helper + "Month"]) return true;
        return dateInfo.date >= rule[helper + "Date"] && rule[helper + "Year"] == dateInfo.year && rule[helper + "Month"] == dateInfo.month;

    },
    _isLessThan: function (dateInfo, rule, isFrom) {
        var helper = isFrom ? "from" : "to";
        if (dateInfo.year < rule[helper + "Year"]) return true;
        if (dateInfo.year == rule[helper + "Year"] && dateInfo.month < rule[helper + "Month"]) return true;
        return dateInfo.date <= rule[helper + "Date"] && rule[helper + "Year"] == dateInfo.year && rule[helper + "Month"] == dateInfo.month;
    },
    _isEqual: function (dateInfo, rule, isFrom) {
        var helper = isFrom ? "from" : "to";
        return dateInfo.date == rule[helper + "Date"] && rule[helper + "Year"] == dateInfo.year && rule[helper + "Month"] == dateInfo.month;
    },
    _enhanceLibFunctions: function () {
        this.forEach = function (arr, callBack, scope) {
            $.each(arr, function (index, elem) {
                callBack.call(scope ? scope : this, index, elem);
            })
        };
    },

    //DOM FACTORY FOR SATISFY DOM GENERATION IN A RELIABLE WAY
    _domGenerator: function (type, attr, parent, textOrVal, prepend) {
        var elem = $(type.indexOf("<") === -1 ? "<" + type + ">" : type);
        return elem.attr(attr)[elem[0].value ? "val" : "text"](textOrVal)[parent ? (prepend ? "prependTo" : "appendTo") : "andSelf"](parent ? parent : undefined);
    },
    _addClass: function () {
        var classes = "";
        var _addClassArgs = arguments;
        this.forEach(arguments, function (index, item) {
            classes += item + (index !== _addClassArgs.length - 1 && _addClassArgs.length !== 1 ? " " : "" );
        }, this);
        return classes;
    },
    _dynamicsGeometry: function (currentTarget) {

        var windowHeight = $(window).outerHeight();
        var windowWidth = $(window).outerWidth();
        var offsetTopOfTarget = $(currentTarget)[this.view.alwaysVisible ? "position" : "offset"]().top;
        var offsetLeftOfTarget = $(currentTarget)[this.view.alwaysVisible ? "position" : "offset"]().left;
        var targetHeight = $(currentTarget).outerHeight();
        var targetWidth = $(currentTarget).outerWidth();
        return {
            height: targetHeight, width: targetWidth,
            x: offsetLeftOfTarget, y: offsetTopOfTarget,
            winHeight: windowHeight, winWidth: windowWidth
        };
    },
    _getDecisionOnEvents: function () {
        var self = this;
        this.on(this.events.hide, function (data) {
            ( self._selectedDate || self._startRangeSelectedDate) && self._updateDateMatricesExactDate(self._selectedDate || self._startRangeSelectedDate, true);
            self._markToday(new Date());
        });
    },
    _rangeStatesManager: function (e) {
        this._isToDateOpened = false;
        this._isFromDateOpened = true;
        if (e && e.currentTarget === this._dateInputToNode[0]) {
            this._isToDateOpened = true;
            this._isFromDateOpened = false;
            this._resetRules(false);
            this._startRangeSelectedDate && this._addRule(this._startRangeSelectedDate, "<", true);
        } else {
            delete this._disableDateMap[this._lastIndexOfFromDate];
            this._endRangeSelectedDate && this._addRule(this._endRangeSelectedDate, ">", false);
        }
        this._backToNormalDisableRule();
        this._positionThisNodePlease(e && this.selectionRule.range && e.currentTarget === this._dateInputToNode[0] ? this._dateInputToNode[0] : this.dateInputNode);
    },
    _increaseUnity: function (minusOrPlus) {
        if (this.view.display === this._displaySet.days)
            this._updateDateMatrices(minusOrPlus ? -1 : 1, this._monthUnit);
        else if (this.view.display === this._displaySet.months)
            this._updateDateMatrices(minusOrPlus ? -1 : 1, this._yearUnit);
        else if (this.view.display === this._displaySet.years)
            this._updateDateMatrices(minusOrPlus ? -12 : 12, this._yearUnit);
    },
    _setAppropriateDate: function (yearOrMonthUnit, monthOrYear) {
        var date = new Date();
        date.setMonth(monthOrYear);
        if (monthOrYear) {
            date.setFullYear(this.currentDate.getFullYear());
            date.setMonth(yearOrMonthUnit);
        }
        else {
            date.setFullYear(yearOrMonthUnit);
            date.setMonth(1);
        }

        date.setDate(1);
        return date
    },
    _closeIfFill: function () {
        if (this._dateInputToNode.val() && this.dateInputNode.val()) {
            !this.view.alwaysVisible && this.hide();
            return this.view.alwaysVisible;
        }
        return true
    },
    _getYearsRange: function (year) {
        var estimateRange = year / 12;
        var exactRangeStartPoint = (Math.floor(estimateRange) * 12) + 1;
        var arr = [];
        arr.push(exactRangeStartPoint);
        for (var i = 1; i <= 11; i++) {
            arr.push(exactRangeStartPoint + i);
        }
        return arr;
    },

    _ExpandOrCollapse: function (increase, date) {
        var self = this;
        var displayMap = {
            1: function () {
                self._currentBriefDateSet(self._currentIndicator, self._briefDateScope.briefDate);
                self.view.display = self._displaySet.days;
            },
            2: function () {
                self._currentBriefDateSet(self._currentIndicator, self._briefDateScope.yearName);
                self.view.display = self._displaySet.months;
            },
            3: function () {
                self._currentBriefDateSet(self._currentIndicator, self._briefDateScope.yearsRange);
                self.view.display = self._displaySet.years;
            }
        };

        var levelMap = {
            days: 1,
            months: 2,
            years: 3,
            yearsRange: 4
        };
        var stateFunc = increase ? displayMap[levelMap[this.view.display] + 1] : displayMap[levelMap[this.view.display ] - 1];
        if (stateFunc) {
            this.currentDate = date ? new Date(date.getTime()) : this.currentDate;
            stateFunc();
            this._createDateMatrices();
        }

    },
    _jumpToDateFromInput: function (go) {
        var dateToGo = go.val();
        if (dateToGo) {
            var dateArray = go.val().split("/");
            var dateToGoPlain = new Date();

            if (dateArray.length === 1) {
                this.view.display = this._displaySet.years;
                dateToGoPlain.setFullYear(dateArray[0]);
            } else if (dateArray.length === 2) {
                this.view.display = this._displaySet.months;
                dateToGoPlain.setFullYear(dateArray[0]);
                dateToGoPlain.setMonth(dateArray[1]);
            } else if (dateArray.length === 3) {
                this.view.display = this._displaySet.days;
                dateToGoPlain.setFullYear(dateArray[0]);
                dateToGoPlain.setMonth(dateArray[1]);
                dateToGoPlain.setDate(dateArray[2]);
            }
            this.currentDate = new Date(dateToGoPlain.getTime());
            this._createDateMatrices(dateToGoPlain);
        }
    },
    _dateEqualsTo: function (compare, compareTo) {
        return compare.getFullYear() === compareTo.getFullYear() && compare.getMonth() === compareTo.getMonth() && compare.getDate() === compareTo.getDate();
    },
    _getRangeDates: function (from, to) {
        var dateArray = [];
        var currentDate = from;
        while (currentDate <= to) {
            dateArray.push(new Date(currentDate));
            currentDate = this._addDays(currentDate, 1);
        }
        return dateArray;
    },
    _addDays: function (date, days) {
        var dat = new Date(date.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    },
    _addClassToSelectedDate: function (elem) {
        elem.addClass(this.className.selected + " " + this.className._inner.selectedDate);
    },
    _removeClassFromSelectedDate: function (elem) {
        elem.removeClass(this.className.selected + " " + this.className._inner.selectedDate);
    },
    _removeDisableClass: function (elem) {
        elem.removeClass(this.className.disabled + " " + this.className._inner.disableDate);
    },
    _addDisableClass: function (elem) {
        elem.addClass(this.className.disabled + " " + this.className._inner.disableDate);
    },
    _addClassToRange: function (from, to) {
        if (from && to) var rule = this._interpretRule(from, to);
        for (var i in this._dateRows) {
            var elem = $(this._dateRows[i]);
            var date = elem.data("date");
            this._removeClassFromSelectedDate(elem);
            if (from && to) {
                elem.removeClass(this.className.betweenRange + " " + this.className._inner.betweenDateNode);
                var dateExpose = this._currentDateExpose(date);
                if (this._isEqual(dateExpose, rule, true) || this._isEqual(dateExpose, rule, false)) {
                    this._addClassToSelectedDate(elem);
                } else if (this._isBiggerThan(dateExpose, rule, true) && this._isLessThan(dateExpose, rule, false)) {
                    elem.addClass(this.className.betweenRange + " " + this.className._inner.betweenDateNode);
                }
            } else if (from) {
                if (this._dateEqualsTo(this._startRangeSelectedDate, date))
                    this._addClassToSelectedDate(elem);
            }
            else if (to) {
                if (this._dateEqualsTo(this._endRangeSelectedDate, date))
                    this._addClassToSelectedDate(elem);
            }
        }
    },
    _removeClassFromRange: function () {
        for (var i in this._dateRows)
            this._dateRows[i].removeClass(this.className.betweenRange + " " + this.className._inner.betweenDateNode);

    },
    _notifySubscribers: function (topic, details) {
        var topicArray = this._topicMap[topic];
        if (topicArray) {
            this.forEach(topicArray, function (index, item) {
                item.func.call(item.scope, details)
            }, this)
        }
    },
    //CHECK FOR INSTANCE TYPE
    _isDate: function (date) {
        return date instanceof Date;
    },
    _isArray: function (date) {
        return date instanceof Array;
    },
    _isString: function (date) {
        return typeof date === "string";
    },

    //**********************************************//
    //**********************************************//
    //********************APIS**********************//
    //**********************************************//
    //**********************************************//

    on: function (topic, callBack, scope) {
        if ((topic && typeof topic === "string") && callBack) {
            !this._topicMap[topic] && (this._topicMap[topic] = []);
            this._topicMap[topic].push({func: callBack, scope: scope ? scope : this._calendarMainNode});
        }
    },
    show: function (e) {
        this._calendarMainNode.css("display", "");
        this._isHide = false;
        !this.view.alwaysVisible && this._notifySubscribers(this.events.show);
        this.selectionRule.range ? this._rangeStatesManager(e) : this._positionThisNodePlease(this.dateInputNode);
    },
    hide: function () {
        this._calendarMainNode.css("display", "none");
        this._isHide = true;
        this._notifySubscribers(this.events.hide);
    },
    today: function () {
        this.currentDate = new Date();
        this._updateDateMatricesExactDate(self.currentDate);
    },
    reset: function () {
        if (this.selectionRule.range) {
            (this._startRangeSelectedNode || this._endRangeSelectedNode) && this._removeClassFromSelectedDate(this[this._startRangeSelectedNode ? "_startRangeSelectedNode" : "_endRangeSelectedNode"].add(this._endRangeSelectedNode));
            this._resetRules("BOTH");
            delete this._disableDateMap[this._lastIndexOfFromDate];
            delete this._disableDateMap[this._lastIndexOfToDate];
            this._endRangeSelectedDate =
                this._endRangeSelectedNode = this._startRangeSelectedDate =
                    this._startRangeSelectedNode = this._lastIndexOfFromDate =
                        this._lastIndexOfToDate = this._endRangeSelectedDateBk =
                            this._startRangeSelectedDateBk = null;
            this._updateDateMatricesCommon();
            this._removeClassFromRange();

        } else {
            this._removeClassFromSelectedDate(this._selectedDateNode);
            this._selectedDateNode = this._selectedDate = null;
        }
        this.dateInputNode.add(this._dateInputToNode).val("");
    },
    setDate: function (date) {
        if (!isNaN(Date.parse(date)))
            this._updateDateMatricesExactDate(this._isDate(date) ? date : new Date(Date.parse(date)))
    },
    selectDate: function (date) {

        if (!isNaN(Date.parse(date))) {
            var dt = this._isDate(date) ? date : new Date(Date.parse(date));
            this._updateDateMatricesExactDate(dt , null , true);
            if (this._dateRows && this._dateRows.length)
                for (var i in this._dateRows)
                    if (this._dateEqualsTo(this._dateRows[i].data("date") , dt))
                        return this._dateRows[i].click();
        }
    },
    selectRangeOfDate: function (start, end) {
        this.reset();
        var rule = this._interpretRule(start, end);
        if (this._isBiggerThan(this._currentDateExpose(end), rule , true)) {
            this._isFromDateOpened = true;
            this._isToDateOpened = false;
            this.selectDate(start);
            this._isFromDateOpened = false;
            this._isToDateOpened = true;
            this.selectDate(end);
            this.hide();
        }
    },
    setPos: function (node, posObject) {
        this._positionThisNodePlease(node, posObject)
    },
    isHide: function () {
        return this._isHide;
    },
    isDisable: function (date) {
        return !isNaN(Date.parse(date)) ? this._isMatchingToDisableRule(new Date(Date.parse(date))) : date;
    },
    getPickerNodes: function () {
        return this.dateInputNode.add(this._dateInputToNode);
    },
    getSelectedStartDate: function () {
        return this._startRangeSelectedDate;
    },
    getSelectedEndDate: function () {
        return this._endRangeSelectedDate;
    },
    getSelectedDate: function () {
        return this._selectedDate;
    },
    getCurrentDate: function () {
        return this.currentDate;
    }
};
//Declarative syntax interpretation
var beatPickerIncrementalId = 0;
initializeBitCal = function () {
    var elems = $("*").filter(function () {
        return $(this).data("beatpicker")
    });
    $(elems).each(function () {
        var elem = $(this);
        var options = {dateInputNode: elem};
        $.extend(true, options,
            _interpretExtraOptions(elem),
            _interpretPosition(elem),
            _interpretDisableRules(elem),
            _interpretRange(elem),
            _interpretDateFormat(elem),
            _interpretDisablingModule(elem));

        _initialization(elem, options);

    });
};
_initialization = function (elem, options) {
    var id = elem.data("beatpicker-id");
    if (id)
        window[id] = new BeatPicker(options);
    else {
        id = "beatpicker-" + beatPickerIncrementalId++;
        window[id] = new BeatPicker(options);
        elem.attr("data-beatpicker-id", id);
    }
};
_interpretDisableRules = function (elem) {
    var dDates = elem.data("beatpicker-disable");
    if (!dDates) return {};
    var datesMap = [];
    dDates = dDates.replace(/\s+/g, '');
    var dDatesArr = dDates.split("}");
    dDatesArr = dDatesArr.filter(function (item) {
        return item !== ""
    });
    for (var i in dDatesArr) {
        var item = dDatesArr[i] += "}";
        if (item.indexOf(",") === 0)
            item = item.substr(1);
        datesMap.push(_parseJsonEngine(item, ["from" , "to"]));
    }
    return {disablingRules: datesMap};
};
_interpretPosition = function (elem) {
    var pos = elem.data("beatpicker-position");
    if (!pos) return {};
    return {view: {position: _parseJsonEngine(pos, [])}};
};
_interpretRange = function (elem) {
    var isRange = elem.data("beatpicker-range");
    if (isRange === undefined) return {};
    isRange = String(isRange);
    var range , canSelectDisableDate;
    isRange = isRange.replace(/\s+/g, '');
    var booleans = isRange.split(',');
    range = booleans[0] === 'true';
    canSelectDisableDate = booleans[1] === 'true';
    return {selectionRule: {range: range, rangeDisableSelect: canSelectDisableDate, single: !range}};
};
_interpretDateFormat = function (elem) {
    var dateFormat = elem.data("beatpicker-format");
    if (!dateFormat) return {};
    dateFormat = dateFormat.replace(/\s+/g, '');
    var iDateArray = dateFormat.indexOf("]");
    var dateFormatArray = dateFormat.substr(0, iDateArray + 1);
    var separator = dateFormat.substr(iDateArray + 2, dateFormat.length);
    return {dateFormat: $.extend({format: _parseJsonEngine(dateFormatArray, [])}, separator ? _parseJsonEngine("{" + separator + "}", ["separator"]) : {separator: "-"})};
};
_interpretExtraOptions = function (elem) {
    var extraOptions = elem.data("beatpicker-extra");
    if (!extraOptions) return null;
    if (!window[extraOptions]) return null;
    return window[extraOptions];
};
_interpretDisablingModule = function (elem) {
    var modules = elem.data("beatpicker-module");
    if (!modules) return;
    var modulesArr;
    modules = modules.replace(/\s+/g, '');
    modulesArr = modules.split(",");
    var disablingModule = {modules: {}};
    for (var i in modulesArr) {
        var module = modulesArr[i];
        disablingModule.modules[module] = false;
    }
    return disablingModule;
};
_parseJsonEngine = function (item, words) {
    for (var i in words) {
        item = item.replace(words[i], '"' + words[i] + '"');
    }
    return typeof item === "string" ? JSON.parse(item.replace(/'/g, '"')) : item;

};
try{
    $(document).ready(function () {
        initializeBitCal();
    });

}catch(e){
    if(module)
        module.exports=BeatPicker.prototype;
}
