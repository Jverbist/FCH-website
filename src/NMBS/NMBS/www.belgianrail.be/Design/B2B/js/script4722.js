blockTimeout = null;

$(document).ready(function () {
    $("#colorbox").prependTo("form#mainform");
    $("#cboxOverlay").prependTo("form#mainform");
    $('.chosen').chosen();

    enableRangeCheckBoxes();

    $(".CustomerReferences,.TravelerDetails,.TravelDetails,#confirmRequest,.MassUpdate,.contacts-line,#webpage_main_bd").find($("input:text")).on("keydown", function (e) {
        if (e.shiftKey && (e.which == 188 || e.which == 190)) {
            e.preventDefault();
        }
    });

    $(".contacts-line").find($("textarea")).on("keydown", function (e) {
        if (e.shiftKey && (e.which == 188 || e.which == 190)) {
            e.preventDefault();
        }
    });

    
});



/* Ajax Progress Bar */
function initializeRequest(sender, args) {
    blockTimeout = window.setTimeout(showProgressBar, 200);
}

function pageLoaded(sender, args) {
    clearTimeout(blockTimeout);
    var ajaxProgressBarControlId = $('#hf_AjaxProgessbarInControl').val();
    if (ajaxProgressBarControlId) {
        $('#' + ajaxProgressBarControlId).unblock();
    } else {
        $.unblockUI();
    }


    //do on any page load (also after AJAX call)
    LoadShoppingBasketBehaviour();
    ShowProgressBarOnClick();
    RestyleDisabledButtons();
    B2BHighlightClientValidation();
    LoadEmployeePicker();
    LoadScrollToTopBehaviour();
    InitializeUpload();
    InitializeCommitShoppingBasket();

}

function InitializeUpload() {
    // Add events
    $('#fileUploader').on('change', prepareUpload);
    $('#triggerUpload').on('click', uploadFiles);
}

function InitializeCommitShoppingBasket() {
    $('#triggerCommit').on('click', commitShoppingBasket);
}

function endRequest(sender, args) {
    if (args.get_error() != undefined) {
        clearTimeout(blockTimeout);
        var ajaxProgressBarControlId = $('#hf_AjaxProgessbarInControl').val();
        if (ajaxProgressBarControlId) {
            $('#' + ajaxProgressBarControlId).unblock();
        } else {
            $.unblockUI();
        }
        showAjaxError(args);
    }
    ScrollToValidationSummaryIfPresent();



}

/* B2B General */

function enableRangeCheckBoxes() {
    var $chkboxes = $(':checkbox');
    var lastChecked = null;

    $chkboxes.click(function (e) {
        if (!lastChecked) {
            lastChecked = this;
            return;
        }

        if (e.shiftKey) {
            var start = $chkboxes.index(this);
            var end = $chkboxes.index(lastChecked);

            $chkboxes.slice(Math.min(start, end), Math.max(start, end) + 1).prop('checked', lastChecked.checked);
        }
        lastChecked = this;
    });
}

function showProgressBar() {
    var ajaxProgressBarControlId = $('#hf_AjaxProgessbarInControl').val();
    if (ajaxProgressBarControlId) {
        $.blockUI.defaults.css = {};
        $('#' + ajaxProgressBarControlId).block({ message: $('#AjaxProgressBarInControl'), css: { border: 'none', padding: '10px', position: 'static' }, overlayCSS: { opacity: 0 } });
    } else {
        $.blockUI({ message: $('#AjaxProgressBar'), css: { border: 'none', padding: '20px' } });
    }

}

function showAjaxError(args) {
    var errorMessage = args.get_error().message;
    args.set_errorHandled(true);
    //$('#AjaxFailedRequestMessage').html(errorMessage);
    $.blockUI({ message: $('#AjaxFailedRequest'), css: { border: 'none', padding: '20px' } });
}

function hideAjaxError() {
    $.unblockUI();
};

function CloseDialog() {
    $.colorbox.close();
}

function ShowProgressBarOnClick() {
    $('.jq-showprogressbar').click(function () {
        showProgressBar();
    });
}

function RestyleDisabledButtons() {
    $("div.btn-orange").has("input:disabled").switchClass("btn-orange", "btn-gray");
    $("div.btn-orange").has("a.aspNetDisabled").switchClass("btn-orange", "btn-gray");
}

function LoadScrollToTopBehaviour() {
    $('.gototop').on('click', function () {
        $('html,body').animate({ scrollTop: 0 }, 'slow');
    });
}

/*B2B Highlight Validation*/
/*based on http://www.codedigest.com/Articles/ASPNET/414_Highlight_Input_Controls_when_Validation_fails_in_AspNet_Validator_controls.aspx */
function B2BHighlightClientValidation() {
    $('.jq-visualvalidation').click(function () {
        ClearValidationClasses();
        SetValidationClasses();
        ScrollToFirstError();
    });
    UpdateValidationClassesOnBlur();
}

function ClearValidationClasses() {
    if (typeof (Page_Validators) == "undefined") return;
    for (var i = 0; i < Page_Validators.length; i++) {
        $('#' + Page_Validators[i].controltovalidate).removeClass("jq-error");
    }
}

function SetValidationClasses() {
    if (typeof (Page_Validators) == "undefined") return;
    for (var i = 0; i < Page_Validators.length; i++) {
        var validator = Page_Validators[i];
        if (validator != null && !validator.isvalid) {
            $('#' + Page_Validators[i].controltovalidate).addClass("jq-error");
        }
    }
}

function UpdateValidationClassesOnBlur() {
    if (typeof (Page_Validators) == "undefined") return;

    //get the distinct controls to validate
    var distinctControlsToValidate = [];
    $.each(Page_Validators, function (index, value) {
        if ($.inArray(value.controltovalidate, distinctControlsToValidate) == -1) {
            distinctControlsToValidate.push(value.controltovalidate);
        }
    });

    //on blur append event to update validation classes
    $.each(distinctControlsToValidate, function (index, value) {
        $('#' + value).blur(function () {
            UpdateValidationClass($(this));
        });
    });
}

function UpdateValidationClass(controltovalidate) {
    //check if all validators for the control are valid
    var isValid = true;
    for (var j = 0; j < Page_Validators.length; j++) {
        if (Page_Validators[j].controltovalidate == controltovalidate.attr("id")) {
            isValid = isValid && Page_Validators[j].isvalid;
        }
    }

    //change css class accordingly
    if (!isValid) {
        controltovalidate.addClass("jq-error");
    }
    else {
        controltovalidate.removeClass("jq-error");
    }
}

function ScrollToFirstError() {
    //if page is invalid and no validationsummary is shown, scroll to highest control on screen

    if (Page_IsValid == false && $('.validation-summary ul').length == 0) {
        var topMostValidator;
        var lastOffsetTop;
        for (var i = 0; i < Page_Validators.length; i++) {
            var vld = Page_Validators[i];
            if (vld.isvalid == false) {
                var controlToValidate = $('#' + vld.controltovalidate);
                if (controlToValidate.offset().top < lastOffsetTop || lastOffsetTop == undefined) {
                    topMostValidator = controlToValidate;
                    lastOffsetTop = controlToValidate.offset().top;
                }
            }
        }
        scrollToElement(topMostValidator);
        topMostValidator.focus();
    }
}

function ScrollToValidationSummaryIfPresent() {
    if ($('.validation-summary .aspNetValidationSummary:visible').length > 0) {
        scrollToElement($('.validation-summary'));
    }
}

//script needed to make sure only one radiobutton can be selected at a time
function SetUniqueRadioButton(nameregex, current) {
    var re = new RegExp(nameregex);
    for (var i = 0; i < document.forms[0].elements.length; i++) {
        var elm = document.forms[0].elements[i];
        if (elm.type == 'radio') {
            if (re.test(elm.name)) {
                elm.checked = false;
            }
        }
    }
    current.checked = true;
}

function getQueryStringParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* B2B Datepickers */

function AddDatePicker(dateInput) {
    dateInput.datepicker({
        dateFormat: 'dd/mm/yy',
        defaultDate: "+0d"
    }).next('a').click(function () {
        jQuery(this).prev('input').datepicker('show');
    });
}

function AddDatePickerForRange(dateFromInput, dateToInput, minDate) {
    dateFromInput.datepicker({
        dateFormat: 'dd/mm/yy',
        defaultDate: "+0d",
        changeYear: true,
        beforeShowDay: function (dateValue) { return IsValidDate(dateValue, minDate); },
        onClose: function (selectedDate) {
            dateToInput.datepicker("option", "minDate", selectedDate);
        }
    }).next('a').click(function () {
        jQuery(this).prev('input').datepicker('show');
    });

    dateToInput.datepicker("option", "minDate", dateFromInput.val());

    dateToInput.datepicker({
        dateFormat: 'dd/mm/yy',
        defaultDate: "+0d",
        changeYear: true,
        beforeShowDay: function (dateValue) { return IsValidDate(dateValue, minDate); },
        onClose: function (selectedDate) {
            dateFromInput.datepicker("option", "maxDate", selectedDate);
        }
    }).next('a').click(function () {
        jQuery(this).prev('input').datepicker('show');
    });

    dateFromInput.datepicker("option", "maxDate", dateToInput.val());
}

function IsValidDate(date, minDate) {
    if (!minDate)
        return [true];

    //var today = new Date();
    //today.setHours(0, 0, 0, 0);
    //var minDate = new Date(today.getFullYear()-2, 0,1);

    if (date < minDate)
        return [false];
    else
        return [true];
}

/* B2B ORDERFLOW */

function scrollToElement(ele) {
    $(window).scrollTop(ele.offset().top).scrollLeft(ele.offset().left);
}

function initializeDatePicker(instance, dateFormat) {
    var originalValue = $(instance).val();
    var toAdd = $(instance).attr("durationMinimum"); //minimum amount of time that may be selected, fe 1
    var toAddUnit = $(instance).attr("durationMinimumUnit"); //minimum amount of time that may be selected, fe MON/DAY/WK
    var minDate = $(instance).attr("fromDate");
    var maxDate = $(instance).attr("toDate"); // this is the maxDate set from contract coming from OrderFields


    if (minDate) {
        $(instance).datepicker("option", "minDate", minDate);
    }

    if (maxDate) {
        if (toAdd && toAddUnit) {
            maxDate = addToDateString(maxDate, -(parseInt(toAdd)), toAddUnit, dateFormat);
        }
        $(instance).datepicker("option", "maxDate", maxDate);
    }

    $(instance).val(originalValue);
}



function updateEndDateRange(endDateInstance, startDateString, dateFormat) {
    var toAddMin = $(endDateInstance).attr("durationMinimum"); //minimum amount of time that may be selected, fe 1
    var toAddMinUnit = $(endDateInstance).attr("durationMinimumUnit"); //minimum amount of time that may be selected, fe MON/DAY/WK
    var toAddMax = $(endDateInstance).attr("durationLimit");
    var toAddMaxUnit = $(endDateInstance).attr("durationLimitUnit");

    var currentEndDate = jQuery.datepicker.parseDate('dd/mm/yy', jQuery(endDateInstance).val());
    var currentStartDate = jQuery.datepicker.parseDate('dd/mm/yy', startDateString);

    if (!toAddMin || !toAddMinUnit) {
        if (!currentEndDate || currentEndDate > currentStartDate) {
            jQuery(endDateInstance).val(startDateString);
        }
        jQuery(endDateInstance).datepicker("option", "minDate", startDateString);
    } else {
        var newMinDate = addToDateString(startDateString, parseInt(toAddMin), toAddMinUnit, dateFormat);
        if (!jQuery(endDateInstance).val() || currentEndDate < newMinDate) {
            jQuery(endDateInstance).val(newMinDate);
        }
        jQuery(endDateInstance).datepicker("option", "minDate", newMinDate);
    }

    if (toAddMax && toAddMaxUnit) {
        var newMaxDate = addToDateString(startDateString, parseInt(toAddMax), toAddMaxUnit, dateFormat);
        jQuery(endDateInstance).datepicker("option", "maxDate", newMaxDate);
    }

    return false;
};

function addToDateString(oldDateString, toAdd, toAddUnit, dateFormat) {
    var oldDate = $.datepicker.parseDate(dateFormat, oldDateString);
    var newDate = new Date();
    switch (toAddUnit.toUpperCase()) {
        case "MON":
            newDate = new Date(new Date(oldDate).setMonth(oldDate.getMonth() + toAdd));
            break;
        case "YR":
            newDate = new Date(new Date(oldDate).setFullYear(oldDate.getFullYear() + toAdd));
            break;
        case "DAY":
            newDate = new Date(new Date(oldDate).setDate(oldDate.getDate() + toAdd));
            break;
        case "WK":
            newDate = new Date(new Date(oldDate).setDate(oldDate.getDate() + (toAdd * 7)));
            break;
    }
    //dateFormat = "dd/mm/yy";
    if (toAddUnit !== "") {
        newDate = new Date(new Date(newDate).setDate(newDate.getDate() - 1));
    }
    return jQuery.datepicker.formatDate(dateFormat, newDate);
};

function validateDay(input, dateValue) {
    var constrainedDateRange = input.attr("constrainedDateRange");

    if (!constrainedDateRange)
        return [true];

    var date = formatDate(dateValue.getDate()) + '/' + formatDate(dateValue.getMonth() + 1) + '/' + dateValue.getFullYear();
    var allowedDates = input.attr("allowedDates");

    if (allowedDates && jQuery.inArray(date, JSON.parse(allowedDates)) > -1) {
        //If an allowed date list is specified, make sure the end date can only be in the same validity range
        //as the selected start date
        if ($('input.jq-enddate').get(0) != undefined && input.get(0).id == $('input.jq-enddate').get(0).id) {
            var startdate = $('input.jq-startdate').val();
            if (startdate) {
                var startDateValue = jQuery.datepicker.parseDate('dd/mm/yy', startdate);
                if (startDateValue > dateValue) {
                    return [false];
                }
                if (jQuery.inArray(startdate, JSON.parse(allowedDates)) > -1) {
                    for (var dt = new Date(startDateValue); dt <= new Date(jQuery.datepicker.parseDate('dd/mm/yy', date)); dt.setDate(dt.getDate() + 1)) {
                        var dtString = formatDate(dt.getDate()) + '/' + formatDate(dt.getMonth() + 1) + '/' + dt.getFullYear();
                        if (jQuery.inArray(dtString, JSON.parse(allowedDates)) == -1) {
                            return [false];
                        }
                    }
                }
            }
        }

        return [true];
    }

    return [false];
}

var formatDate = function (partdate) {
    if (partdate >= 0 && partdate < 10)
        return "0" + partdate;
    else
        return partdate;
};

function ReapplyWatermarks() {
    //LTE9: watermarks disappear on open of datepicker, reapply
    ApplyAddressWatermarks();
    jQuery('.jq-station input').watermark($b2bDictionaryValues[1]);
    jQuery('.jq-parking input').watermark($b2bDictionaryValues[1]);
}

/* orderFlow object */
window.orderFlow = window.orderFlow || {};
orderFlow.datePickers = {
    init: function () {
        jQuery('.jq-startdate').datepicker({
            beforeShowDay: function (dateValue) { return validateDay($('input.jq-startdate'), dateValue); },
            onSelect: function (dateValue) {
                jQuery(this).removeClass("jq-error");
                var datereturnpicker = jQuery('input.jq-enddate');
                updateEndDateRange(datereturnpicker, dateValue, 'dd/mm/yy'); //todo sk test
                //return onStartDateSelect(dateValue);
            },
            onClose: function () { ReapplyWatermarks(); },
            dateFormat: 'dd/mm/yy',
            firstDay: 1
        });

        initializeDatePicker(jQuery('.jq-startdate'), 'dd/mm/yy');
        jQuery('.jq-enddate').datepicker({
            beforeShowDay: function (dateValue) { return validateDay($('input.jq-enddate'), dateValue); },
            onSelect: function () {
                jQuery(this).removeClass("jq-error");
            },
            onClose: function () { ReapplyWatermarks(); },
            dateFormat: 'dd/mm/yy',
            firstDay: 1
        });
        initializeDatePicker(jQuery('.jq-enddate'), 'dd/mm/yy');


        jQuery('.jq-bdate').datepicker({
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            onSelect: function () {
                jQuery(this).removeClass("jq-error");
            },
            onClose: function () { ReapplyWatermarks(); },
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+0",
            maxDate: +0,
            defaultDate: '01/01/1980'
        });
        jQuery('a.jq-date').click(function () {
            jQuery(this).prev('input.jq-date:not(.aspNetDisabled)').datepicker('show');
        });
        jQuery('a.jq-bdate').click(function () {
            jQuery(this).prev('input.jq-bdate:not(.aspNetDisabled)').datepicker('show');
        });




    }
};

orderFlow.stationSelectors = {
    init: function () {
        jQuery('.jq-station-departure input').watermark($b2bDictionaryValues[1]);
        jQuery('.jq-station-arrival input').watermark($b2bDictionaryValues[1]);
        jQuery('.jq-station-via input').watermark($b2bDictionaryValues[1]);
        //start autocomplete of stations and save id in hidden field
        jQuery('.jq-station-departure input').autocomplete({
            source: function (request, response) {
                var term = $.ui.autocomplete.escapeRegex(request.term)
                    , startsWithMatcher = new RegExp("^" + term, "i")
                    , startsWith = $.grep($b2bAutocompleteAllowedDepartureStations, function (value) {
                        return startsWithMatcher.test(value.label || value.value || value);
                    })
                    , containsMatcher = new RegExp(term, "i")
                    , contains = $.grep($b2bAutocompleteAllowedDepartureStations, function (value) {
                        return $.inArray(value, startsWith) < 0 &&
                            containsMatcher.test(value.label || value.value || value);
                    });

                response(startsWith.concat(contains));
            },
            minLength: 2,
            select: function (event, ui) {
                jQuery(this).parent().find('input:hidden:first').val(ui.item.id);
                jQuery(this).val(ui.item.label); //will trigger change event again in FF...
                jQuery(this).change();
            },
            autoFocus: true,
        });
        //when something is typed in, try to fill corresponding station id in hidden field
        jQuery('.jq-station-departure input').change(function (e) {
            //be carefull when changing, we need to allow ctrl+A
            if (!e.ctrlKey) {
                var input = jQuery(this);
                var hiddenInput = jQuery(this).parent().find('input:hidden:first');
                var station = FindStation($b2bAutocompleteAllowedDepartureStations, input.val());
                if (station != null) {
                    input.val(station.label);
                    hiddenInput.val(station.id);
                    jQuery(this).removeClass("jq-error");
                } else {
                    hiddenInput.val('');
                }
            }
        });
        jQuery('.jq-station-arrival input').autocomplete({
            source: function (request, response) {
                var term = $.ui.autocomplete.escapeRegex(request.term)
                    , startsWithMatcher = new RegExp("^" + term, "i")
                    , startsWith = $.grep($b2bAutocompleteAllowedArrivalStations, function (value) {
                        return startsWithMatcher.test(value.label || value.value || value);
                    })
                    , containsMatcher = new RegExp(term, "i")
                    , contains = $.grep($b2bAutocompleteAllowedArrivalStations, function (value) {
                        return $.inArray(value, startsWith) < 0 &&
                            containsMatcher.test(value.label || value.value || value);
                    });

                response(startsWith.concat(contains));
            },
            minLength: 2,
            select: function (event, ui) {
                jQuery(this).parent().find('input:hidden:first').val(ui.item.id);
                jQuery(this).val(ui.item.label); //will trigger change event again in FF...
                jQuery(this).change();
            },
            autoFocus: true
        });
        //when something is typed in, try to fill corresponding station id in hidden field
        jQuery('.jq-station-arrival input').change(function (e) {
            //be carefull when changing, we need to allow ctrl+A
            if (!e.ctrlKey) {
                var input = jQuery(this);
                var hiddenInput = jQuery(this).parent().find('input:hidden:first');
                var station = FindStation($b2bAutocompleteAllowedArrivalStations, input.val());
                if (station != null) {
                    input.val(station.label);
                    hiddenInput.val(station.id);
                    jQuery(this).removeClass("jq-error");
                } else {
                    hiddenInput.val('');
                }
            }
        });
        jQuery('.jq-station-via input').autocomplete({
            source: function (request, response) {
                var term = $.ui.autocomplete.escapeRegex(request.term)
                    , startsWithMatcher = new RegExp("^" + term, "i")
                    , startsWith = $.grep($b2bAutocompleteAllowedViaStations, function (value) {
                        return startsWithMatcher.test(value.label || value.value || value);
                    })
                    , containsMatcher = new RegExp(term, "i")
                    , contains = $.grep($b2bAutocompleteAllowedViaStations, function (value) {
                        return $.inArray(value, startsWith) < 0 &&
                            containsMatcher.test(value.label || value.value || value);
                    });

                response(startsWith.concat(contains));
            },
            minLength: 2,
            select: function (event, ui) {
                jQuery(this).parent().find('input:hidden:first').val(ui.item.id);
                jQuery(this).val(ui.item.label); //will trigger change event again in FF...
                jQuery(this).change();
            },
            autoFocus: true
        });
        //when something is typed in, try to fill corresponding station id in hidden field
        jQuery('.jq-station-via input').change(function (e) {
            //be carefull when changing, we need to allow ctrl+A
            if (!e.ctrlKey) {
                var input = jQuery(this);
                var hiddenInput = jQuery(this).parent().find('input:hidden:first');
                var station = FindStation($b2bAutocompleteAllowedViaStations, input.val());
                if (station != null) {
                    input.val(station.label);
                    hiddenInput.val(station.id);
                    jQuery(this).removeClass("jq-error");
                } else {
                    hiddenInput.val('');
                }
            }
        });
    }
};
orderFlow.address = {
    init: function () {
        ApplyAddressWatermarks();
    }
};
orderFlow.returnOptions = {
    init: function () {
        ApplyAddressWatermarks();
    }
};
orderFlow.applyMasks = function () {
    jQuery('.jq-socialsecurity').mask("999999-999-99");
    jQuery('.jq-gsm').mask("9999/999999");
    jQuery('.jq-mobibnr').mask("*******************"); //19 alphanumerics
};
orderFlow.growl = function (title, description) {
    $.growlUI(title, description);
};
orderFlow.PrefillDeliveryEmailAddress = function () {
    if (jQuery('.jq-delivery-email') != "undefined" && jQuery('.jq-delivery-email').val() == ''
        && jQuery('.jq-traveller-email') != "undefined" && jQuery('.jq-traveller-email').val() != '') {
        jQuery('.jq-delivery-email').val(jQuery('.jq-traveller-email').val());
    }
};

function PageClientValidate(validationGroup) {
    if (validationGroup) Page_ClientValidate(validationGroup);
    else Page_ClientValidate();

    Page_BlockSubmit = false; //do not block updatepanels
};

function LoadOrderFlowProperties() {
    orderFlow.datePickers.init();
    orderFlow.stationSelectors.init();
    orderFlow.address.init();
    orderFlow.applyMasks();
    orderFlow.PrefillDeliveryEmailAddress();

    if ($("#DeliveryMethodOverrideDialog").length > 0) {
        $.colorbox({
            inline: true,
            fixed: true,
            href: "#DeliveryMethodOverrideDialog",
            height: "190px",
            maxWidth: "500px"
        });
    }

    if ($("#AddedToBasketDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#AddedToBasketDialog",
            height: "260px",
            maxWidth: "500px"
        });
    }

    $('.jq-traveller-email').change(function () {
        if ($('#FieldControl_DeliveryEmail').val() == '')
            $('#FieldControl_DeliveryEmail').val($(this).val());
    });

    if ($('#FieldControl_DeliveryEmail').val() == '')
        $('#FieldControl_DeliveryEmail').val($('.jq-traveller-email').val());
}

function LoadMassUpdate() {
    //for delivery step
    orderFlow.applyMasks();
    $('.jq-sendcopy').change(SetMassUpdateSendCopyCheckbox);
    SetMassUpdateSendCopyCheckbox();
    $('.jq-sendcopy-selectall input').change(function () {
        var checkboxes = $('.jq-sendcopy input');
        if ($(this).is(':checked')) {
            checkboxes.attr('checked', 'checked');
        } else {
            checkboxes.removeAttr('checked');
        }
    });
    $('.jq-selectallproducts input').change(function () {
        var checkboxes = $('.jq-productselection input');
        if ($(this).is(':checked')) {
            checkboxes.attr('checked', 'checked');
        } else {
            checkboxes.removeAttr('checked');
        }
    });
    $('.jq-productselection input').change(SetMassUpdateProductCheckbox);
    SetMassUpdateProductCheckbox();
}

function LoadMassUpdateForOrders() {
    //for travel details step
    orderFlow.datePickers.init();
    orderFlow.stationSelectors.init();
}

function SetMassUpdateSendCopyCheckbox() {
    if ($('.jq-sendcopy input:checked').length == $('.jq-sendcopy input').length) {
        $('.jq-sendcopy-selectall input').attr('checked', 'checked');
    } else {
        $('.jq-sendcopy-selectall input').removeAttr('checked');
    }
}

/* SHOPPING BASKET */
function ToggleProductDetails(productCode) {
    var tableId = productCode + "Table";
    var imgID = productCode + "Img";

    var display = $('#' + tableId).css('display');

    var displayStyle = 'table-row';
    if ($.browser.msie && parseFloat($.browser.version) < 8) {
        displayStyle = 'block';
    }

    if (display == displayStyle) {
        //panel is visible at the moment: hide it
        $('#' + tableId).css('display', 'none');
        $('#' + imgID).attr('src', '/Design/B2B/img/website/collapseplus.gif');
        $('#' + imgID).attr('alt', 'Open');
    } else {
        //panel is not visible at the moment: make it visible
        $('#' + tableId).css('display', displayStyle);
        $('#' + imgID).attr('src', '/Design/B2B/img/website/collapseminus.gif');
        $('#' + imgID).attr('alt', 'Close');
    }
}

function LoadShoppingBasketBehaviour() {
    $(".jq-toggle-warnings").hover(function () {
        var panel = "#Warnings_" + $(this).attr("data-item");
        $(panel).toggle();
    });
    $(".jq-toggle-errors").hover(function () {
        var panel = "#Errors_" + $(this).attr("data-item");
        $(panel).toggle();
    });
    $(".jq-toggle-infoandpricedetails").hover(function () {
        var panel = "#Info_" + $(this).attr("data-item");
        $(panel).toggle();
    });
    $('div.productDetails.Full, div.productDetails.MassUpdate').bind("mouseover", function () {
        var color = $(this).css("background-color");

        $(this).css("background", "#e4f2fb");

        $(this).bind("mouseout", function () {
            $(this).css("background", color);
        });
    });
}

function SetMassUpdateProductCheckbox() {
    if ($('.jq-productselection input:checked').length == $('.jq-productselection input').length) {
        $('.jq-selectallproducts input').attr('checked', 'checked');
    } else {
        $('.jq-selectallproducts input').removeAttr('checked');
    }
}

/* TPA DETAIL */
/* tpaFlow object */
window.tpaFlow = window.tpaFlow || {};
tpaFlow.datePickers = {
    init: function () {
        jQuery('.jq-startdate').datepicker({
            beforeShowDay: function (dateValue) { return validateDay($('input.jq-startdate'), dateValue); },
            onSelect: function (dateValue) { return onStartDateSelect(dateValue); },
            onClose: function () { ReapplyWatermarks(); },
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            defaultDate: +0,
            minDate: 0
        });
        initializeDatePicker(jQuery('.jq-startdate'), 'dd/mm/yy');

        jQuery('.jq-startdate-month').datepicker({
            //Datepicker with limit to 1 month in future
            beforeShowDay: function (dateValue) { return validateDay($('input.jq-startdate-month'), dateValue); },
            onSelect: function (dateValue) { return onStartDateSelect(dateValue); },
            onClose: function () { ReapplyWatermarks(); },
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            defaultDate: +0,
            minDate: 0,
            maxDate: moment().add(31, 'day').toDate()
        });
        initializeDatePicker(jQuery('.jq-startdate-month'), 'dd/mm/yy');

        jQuery('.jq-enddate').datepicker({
            beforeShowDay: function (dateValue) { return validateDay($('input.jq-enddate'), dateValue); },
            onClose: function () { ReapplyWatermarks(); },
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            defaultDate: +0
        });
        initializeDatePicker(jQuery('.jq-enddate'), 'dd/mm/yy');
        jQuery('.jq-bdate').datepicker({
            onClose: function () { ReapplyWatermarks(); },
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+0",
            maxDate: +0,
            defaultDate: '01/01/1980'
        });
        jQuery('.jq-bdateDelayedValidation').datepicker({
            onClose: function () { ReapplyWatermarks(); },
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+0",
            maxDate: +0,
            defaultDate: '01/01/1980'
        });
        jQuery('a.jq-date').click(function () {
            jQuery(this).prev('input.jq-date:not(.aspNetDisabled)').datepicker('show');
        });
        jQuery('a.jq-bdate').click(function () {
            jQuery(this).prev('input.jq-bdate:not(.aspNetDisabled)').datepicker('show');
        });
        jQuery('a.jq-bdateDelayedValidation').click(function () {
            jQuery(this).prev('input.jq-bdateDelayedValidation').datepicker('show');
        });
    }
};
tpaFlow.stationSelectors = {
    init: function () {
        jQuery('.jq-station input').watermark($b2bDictionaryValues[1]);
        //start autocomplete of stations and save id in hidden field
        jQuery('.jq-station input').autocomplete({
            source: function (request, response) {
                var term = $.ui.autocomplete.escapeRegex(request.term)
                    , startsWithMatcher = new RegExp("^" + term, "i")
                    , startsWith = $.grep($b2bAutocompleteStations, function (value) {
                        return startsWithMatcher.test(value.label || value.value || value);
                    })
                    , containsMatcher = new RegExp(term, "i")
                    , contains = $.grep($b2bAutocompleteStations, function (value) {
                        return $.inArray(value, startsWith) < 0 &&
                            containsMatcher.test(value.label || value.value || value);
                    });

                response(startsWith.concat(contains));
            },
            minLength: 2,
            select: function (event, ui) {
                jQuery(this).removeClass("jq-error");
                jQuery(this).parent().find('input:hidden:first').val(ui.item.id);
                jQuery(this).val(ui.item.label); //will trigger change event again in FF...
                jQuery(this).change();
            },
            autoFocus: true
        });
        //when something is typed in, try to fill corresponding station id in hidden field
        jQuery('.jq-station input').change(function (e) {
            //be carefull when changing, we need to allow ctrl+A
            if (!e.ctrlKey) {
                var input = jQuery(this);
                var hiddenInput = jQuery(this).parent().find('input:hidden:first');
                var station = FindStation($b2bAutocompleteStations, input.val());
                if (station != null) {
                    input.val(station.label);
                    hiddenInput.val(station.id);
                } else {
                    hiddenInput.val('');
                }
            }
        });
    }
};
tpaFlow.parkingSelectors = {
    init: function () {
        jQuery('.jq-parking').change(function (e) {
            HideOrShowParkingBadgeInfo();
        });
    }
};

function HideOrShowParkingBadgeInfo() {
    var input = jQuery('#ddlParkingStation');
    var panel = $('#divMobibCardChargeFor');

    if (input != null && panel != null) {
        var stationfound = false;
        jQuery.each($b2bAutocompleteParkings, function (index, value) {
            if (input.val() != undefined && input.val().toUpperCase() == value.id) {//removed second condition because of ff behavior which led to valid station indicated as invalid
                if (value.badge === 'X')
                    panel.css('display', 'block');
                else
                    panel.css('display', 'none');
                stationfound = true;
            }
        });

        //if we get here no station is found
        if (!stationfound) {
            panel.css('display', 'none');
        }
    }
}




function LoadTpaFlowStep1() {
    tpaFlow.datePickers.init();
    tpaFlow.stationSelectors.init();
    tpaFlow.parkingSelectors.init();
    ApplyAddressWatermarks();
    if ($("#AddedToBasketDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#AddedToBasketDialog",
            height: "260px",
            maxWidth: "500px"
        });
    }

    $('#Person_txtEmail').change(function () {
        $('#Recipients_txtEmail').val($('#Person_txtEmail').val());
    });
}

function FindStation(stationArray, stationName) {
    var station = null;
    jQuery.each(stationArray, function (index, value) {
        if (stationName.replace('\t', '').toUpperCase() == value.label) {
            station = value;
            return; //stop each loop
        }
    });

    /*if (station != null) {
    alert("FindStation *text = " + input.val() + "*station.id = " + station.id + " *station.label = " + station.label);
    } else {
    alert("FindStation *text = " + input.val() + "*station.id = NULL *station.label = NULL");
    }*/

    return station;
}

/* functions for client side validation of routes; place after FindStation method! */
function FromStationIdValidate(source, arguments) {
    var station = FindStation($b2bAutocompleteAllowedDepartureStations, arguments.Value);
    arguments.IsValid = arguments.Value == "" || (arguments.Value != "" && station != null);
}

function ToStationIdValidate(source, arguments) {
    var station = FindStation($b2bAutocompleteAllowedArrivalStations, arguments.Value);
    arguments.IsValid = arguments.Value == "" || (arguments.Value != "" && station != null);
}

function ViaStationIdValidate(source, arguments) {
    var station = FindStation($b2bAutocompleteAllowedViaStations, arguments.Value);
    arguments.IsValid = arguments.Value == "" || (arguments.Value != "" && station != null);
}


/* functions for client side validation of routes; place after FindStation method! */
function ValidateStationTpa(source, arguments) {
    var station = FindStation($b2bAutocompleteStations, arguments.Value);
    arguments.IsValid = arguments.Value == "" || (arguments.Value != "" && station != null);
}

function FromStationIdEqualsToStationIdValidate(source, arguments) {
    arguments.IsValid = !(jQuery("#HiddenFromStation").val() != '' && jQuery("#HiddenToStation").val() != '' && jQuery("#HiddenFromStation").val() == jQuery("#HiddenToStation").val());
}

function FromStationIdEqualsViaStationIdValidate(source, arguments) {
    arguments.IsValid = !(jQuery("#HiddenFromStation").val() != '' && jQuery("#HiddenViaStation").val() != '' && jQuery("#HiddenFromStation").val() == jQuery("#HiddenViaStation").val());
}

function ToStationIdEqualsViaStationIdValidate(source, arguments) {
    arguments.IsValid = !(jQuery("#HiddenToStation").val() != '' && jQuery("#HiddenViaStation").val() != '' && jQuery("#HiddenToStation").val() == jQuery("#HiddenViaStation").val());
}

function AndOrFromStationIdEqualsAndOrToStationIdValidate(source, arguments) {
    arguments.IsValid = !(jQuery("#HiddenFromBisStation").val() != '' && jQuery("#HiddenToBisStation").val() != '' && jQuery("#HiddenFromBisStation").val() == jQuery("#HiddenToBisStation").val());
}

function AndOrFromStationIdWithAndOrToStationIdRequiredValidate(source, arguments) {
    var validAndOrFromStation = jQuery('#HiddenFromBisStation').val() != '' && jQuery('#Travel_txtAndOrFrom').val() != '';
    var validAndOrToStation = jQuery('#HiddenToBisStation').val() != '' && jQuery('#Travel_txtAndOrTo').val() != '';
    var emptyAndOrFromStation = jQuery('#HiddenFromBisStation').val() == '' && jQuery('#Travel_txtAndOrFrom').val() == '';
    var emptyAndOrToStation = jQuery('#HiddenToBisStation').val() == '' && jQuery('#Travel_txtAndOrTo').val() == '';

    arguments.IsValid = (validAndOrFromStation && validAndOrToStation) ||
        (emptyAndOrFromStation && emptyAndOrToStation);
}

function ParkingStationIdValidate(source, arguments) {
    arguments.IsValid = jQuery("#ddlParkingStation").val() != "";
}

function ValidateChkListPeriodChecked(sender, arguments) {
    var val = document.getElementById("Travel_chkPeriodList");
    var col = val.getElementsByTagName("*");
    if (col != null) {
        for (i = 0; i < col.length; i++) {
            if (col.item(i).tagName == "INPUT") {
                if (col.item(i).checked) {
                    arguments.IsValid = true;
                    return;
                }
            }
        }
    }
    arguments.IsValid = false;
}

function ValidateParkingChkPeriodListChecked(sender, arguments) {
    var val = document.getElementById("chkPeriodList");
    var col = val.getElementsByTagName("*");
    if (col != null) {
        for (i = 0; i < col.length; i++) {
            if (col.item(i).tagName == "INPUT") {
                if (col.item(i).checked) {
                    arguments.IsValid = true;
                    return;
                }
            }
        }
    }
    arguments.IsValid = false;
}

/* INVOICE OVERVIEW */
function LoadInvoiceOverview() {
    jQuery('#TextBoxDateFrom').datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1
    });
    jQuery('#TextBoxDateTo').datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1
    });
    jQuery('a.jq-date').click(function () {
        jQuery(this).prev('input.jq-date:not(.aspNetDisabled)').datepicker('show');
    });
    //for chosen plugin, make some upper divs overflow:visible
    jQuery('#webpage_main_bd, #webpage_main_pop-in-grid').css("overflow", "visible");
    jQuery('#ContractsListBox').chosen({ "disable_search": true });
    jQuery('#DropDownListInvoiceType').chosen({ "disable_search": true, allow_single_deselect: true });
    jQuery('#DropDownListIsPayed').chosen({ "disable_search": true });
    jQuery('#DropDownListIsDue').chosen({ "disable_search": true });
}

/* EMPLOYEE DETAILS */
function LoadEmployeeDetails() {
    jQuery('#BirthDateTextBox').datepicker({
        onClose: function () { ReapplyWatermarks(); },
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        defaultDate: +0,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+0"
    });

    jQuery('a.jq-date').click(function () {
        jQuery(this).prev('input.jq-date:not(.aspNetDisabled)').datepicker('show');
    });
    jQuery('#DropDownListLanguages').chosen({ "disable_search": false, allow_single_deselect: true });
    jQuery('#TitleDropDown').chosen({ "disable_search": true, allow_single_deselect: true });

    jQuery('#DropDownListCountries').chosen({ "disable_search": false, allow_single_deselect: true });
    jQuery('.jq-toggle-privacydetails').hover(function () {
        $('#PrivacyDetailsPH').toggle();
    });
    if ($("#EmployeeInfoDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#EmployeeInfoDialog",
            maxWidth: "500px"
        });
        $("#cboxClose").hide();
    }
    ApplyAddressWatermarks();
}

/* CREATE USER */
function LoadCreateUser() {
    jQuery('.jq-date').datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        defaultDate: +0,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+0"
    });
    jQuery('a.jq-date').click(function () {
        jQuery(this).prev('input.jq-date:not(.aspNetDisabled)').datepicker('show');
    });
    if ($("#UserInfoDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#UserInfoDialog",
            maxWidth: "500px"
        });
        $("#cboxClose").hide();
    }
}

/* PROFILE DETAILS */
function LoadProfileDetails() {
    jQuery('#BirthDateTextBox').datepicker({
        onClose: function () { ReapplyWatermarks(); },
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        defaultDate: +0,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+0"
    });
    jQuery('a.jq-date').click(function () {
        jQuery(this).prev('input.jq-date:not(.aspNetDisabled)').datepicker('show');
    });
}

function LoadProfileDetailsDisabled() {
    jQuery('#BirthDateTextBox').datepicker({
        onClose: function () { ReapplyWatermarks(); },
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        defaultDate: +0,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+0"
    });
    jQuery('a.jq-date').click(function () {
        jQuery(this).prev('input.jq-date').datepicker('disabled');
    });
}

/* ORGANIZATIONPICKER */
function LoadOrganizationPicker() {
    $('#OrganizationDropDownList').chosen({ "disable_search": true, allow_single_deselect: true });
    if ($("#switchOrganisationDialog").length > 0) {
        $("#OrganizationDropDownList").change(function () {
            $.colorbox({
                inline: true, fixed: true,
                href: "#switchOrganisationDialog",
                maxWidth: "500px"
            });
            $("#cboxClose").hide();
        });

    }
}

/* EMPLOYEE PICKER */

function LoadEmployeePicker() {
    jQuery('.jq-OpenSimpleEmployeePicker, .jq-OpenMultipleEmployeePicker').colorbox({
        inline: true, fixed: true,
        href: "#SelectEmployeeDialog",
        open: false,
        close: "x",
        width: '900px',
        height: '600px'
    });
    jQuery('.jq-OpenSimpleEmployeePicker').click(function () {
        jQuery('#EmployeePickerMultipleSelection').val('false');
    });
    jQuery('.jq-OpenMultipleEmployeePicker').click(function () {
        jQuery('#EmployeePickerMultipleSelection').val('true');
    });
}

/* SUCCESS SUMMARY */
function FadeInSuccessSummary() {
    jQuery('#SuccessSummaryContent').delay(1000).fadeOut(1000);
}

/* MOBIB MANAGEMENT */
function LoadRailCardManagement() {
    jQuery('#ContractsListBox').chosen({ "disable_search": true });
    jQuery('#TravelersListBox').chosen({ "disable_search": true });
    if ($("#suspendDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#suspendDialog",
            maxWidth: "500px"
        });
    }
    if ($("#reactivateDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#reactivateDialog",
            maxWidth: "500px"
        });
    }
    if ($("#confirmationDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#confirmationDialog",
            maxWidth: "500px"
        });
    }

    jQuery('#SuspendDate', '#ReactivateDate').datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        minDate: 0,
        defaultDate: +0
    });
    jQuery('a.jq-date').click(function () {
        jQuery(this).prev('input.jq-date:not(.aspNetDisabled)').datepicker('show');
    });
}

function ApplyNumericMask() {
    jQuery('.jq-numeric').numeric({ decimal: false, negative: false }, function () { alert("Positive integers only"); this.value = ""; this.focus(); });
}

function ApplyAddressWatermarks() {
    jQuery('.jq-street').watermark($b2bDictionaryValues[2]);
    jQuery('.jq-nr').watermark($b2bDictionaryValues[3]);
    jQuery('.jq-box').watermark($b2bDictionaryValues[4]);
    jQuery('.jq-postalcode').watermark($b2bDictionaryValues[5]);
    jQuery('.jq-municipality').watermark($b2bDictionaryValues[6]);
    jQuery('.jq-country').watermark($b2bDictionaryValues[7]);
}

/* AttestRequestDetail page */

function ShowOrHideTravelTpaPanels() {
    // on page load after select employee, the panels are always hidden by default, if contain value show them again
    if (jQuery("#Travel_txtVia") != "undefined" && jQuery("#Travel_txtVia").val() != '') {
        ShowViaStationPanel();
    }

    if ((jQuery("#Travel_txtAndOrFrom") != "undefined" && jQuery("#Travel_txtAndOrFrom").val() != '') ||
        (jQuery("#Travel_txtAndOrTo") != "undefined" && jQuery("#Travel_txtAndOrTo").val() != '')) {
        ShowAddTrajectPanels();
    }
}

function ShowViaStationPanel() {
    $("#Travel_pnlVia").show();
    $("#Travel_pnlRemoveViaStation").show();
    $("#Travel_pnlAddViaStation").hide();

    //document.getElementById("Travel_txtViaValidator").setAttribute("disabled", "false");
    //ShowTecIfPossible();
}

function ShowAddTrajectPanels() {
    $("#Travel_pnlRemoveTraject").show();
    $("#Travel_pnlAndOrFrom").show();
    $("#Travel_pnlAndOrTo").show();
    $("#Travel_pnlAddTraject").hide();
}

function LoadEmployeeOverview() {
    if ($("#DeleteEmployeeDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#DeleteEmployeeDialog",
            height: "150px",
            maxWidth: "500px"
        });
    }
    if ($("#EmployeeFeedbackDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#EmployeeFeedbackDialog",
            maxWidth: "500px"
        });
    }
}

function LoadUserOverview() {
    if ($("#UserFeedbackDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#UserFeedbackDialog",
            maxWidth: "500px"
        });
    }
    if ($("#ChangeLockUserDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#ChangeLockUserDialog",
            maxWidth: "500px"
        });
    }
    if ($("#RequestResetPasswordDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#RequestResetPasswordDialog",
            maxWidth: "500px"
        });
    }
    if ($("#DeleteUserDialog").length > 0) {
        $.colorbox({
            inline: true, fixed: true,
            href: "#DeleteUserDialog",
            maxWidth: "500px"
        });
    }
}

function ConfirmSameAsOrganisationDialog() {
    $('#pnlOrganisations').colorbox({
        inline: true, fixed: true,
        open: true,
        width: "350px",
        height: "180px",
        href: "#ConfirmSameAsOrganisationDialog"
    });
}

function InitializeContractPartnerAccordions() {
    $('.jq-accordionCompany').multiOpenAccordion({
        // activate accordion on stored tab index (default 0) (see hidden field)
        active: GetActiveTabs($('#HiddenAccordionCompanyTab')),
        tabShown: function (event, ui) {
            jQuery('#HiddenAccordionCompanyTab').val($(".jq-accordionCompany").multiOpenAccordion("getActiveTabs"));
        },
        tabHidden: function (event, ui) {
            jQuery('#HiddenAccordionCompanyTab').val($(".jq-accordionCompany").multiOpenAccordion("getActiveTabs"));
        },
    });
    $('.jq-accordionContacts').multiOpenAccordion({
        // activate accordion on stored tab index (default 0) (see hidden field)
        active: GetActiveTabs($('#HiddenAccordionContactsTab')),
        tabShown: function (event, ui) {
            jQuery('#HiddenAccordionContactsTab').val($(".jq-accordionContacts").multiOpenAccordion("getActiveTabs"));
        },
        tabHidden: function (event, ui) {
            jQuery('#HiddenAccordionContactsTab').val($(".jq-accordionContacts").multiOpenAccordion("getActiveTabs"));
        },
    });
}

function GetActiveTabs(hiddenField) {
    var indexes = hiddenField.val().split(",");
    var tabs = new Array();
    for (var index = 0; index < indexes.length; index++) {
        tabs[index] = parseInt(indexes[index]);
    }
    return tabs;
}

function ShowTicketExpirationWarningDialog() {
    $.colorbox({
        inline: true, fixed: true,
        href: "#TicketExpiredDialog",
        maxWidth: "500px"
    });
}

function ShowDeletedItemFromShoppingBasketDialog() {
    if ($("#DeleteItemsDialog").length > 0) {
        $.colorbox({
            inline: true,
            fixed: true,
            href: "#DeleteItemsDialog",
            height: "150px",
            maxWidth: "500px"
        });
    }
}

function HandleInputMethods() {

    if ($('#inputMethodExist').length > 0) {
        var inputFieldIsFileUpload = $("[id*='InputFieldIsFileUpload']").val().toLowerCase();
        if (inputFieldIsFileUpload == "True".toLowerCase()) {
            $("[id*='main_0_ContentPlaceHolder_content_0_InputMethod_0']").prop("disabled", "disabled");
            $("[id*='main_0_ContentPlaceHolder_content_0_InputMethod_1']").prop("disabled", "disabled");
            $("[id*='main_0_ContentPlaceHolder_content_0_InputMethod_2']").prop("disabled", "disabled");
        }
        else if (inputFieldIsFileUpload == "False".toLowerCase()) {
            $($("#main_0_ContentPlaceHolder_content_0_InputMethod").find("input")).each(function (index) {
                if ($($("#main_0_ContentPlaceHolder_content_0_InputMethod").find("input")[index]).attr("value") == "3") {
                    $("#" + $($("#main_0_ContentPlaceHolder_content_0_InputMethod").find("input")[index]).attr("id")).prop("disabled", "disabled");
                }
            });
        }
    }
    else {
        $("[id*='main_0_ContentPlaceHolder_content_0_InputMethod_0']").prop("disabled", "");
        $("[id*='main_0_ContentPlaceHolder_content_0_InputMethod_1']").prop("disabled", "");
        $("[id*='main_0_ContentPlaceHolder_content_0_InputMethod_2']").prop("disabled", "");
    }
}

function ShowDeleteNotificationConfirmationDialog() {
    if ($("#DeleteNotificationConfirmationDialog").length > 0) {
        $.colorbox({
            inline: true,
            fixed: true,
            href: "#DeleteNotificationConfirmationDialog",
            height: "150px",
            maxWidth: "500px"
        });
    }
}

function ShowDeleteDropBoxItemConfirmationDialog() {
    if ($("#DeleteDropBoxItemConfirmationDialog").length > 0) {
        $.colorbox({
            inline: true,
            fixed: true,
            href: "#DeleteDropBoxItemConfirmationDialog",
            height: "150px",
            maxWidth: "500px"
        });
    }
}

function ValidateSocialSecurityNumber(source, arguments) {
    if (arguments.Value == null || arguments.Value == "")
        arguments.IsValid = false;
    else {
        var pattern1 = new RegExp("^\\d{11}$");
        var pattern2 = new RegExp("^\\d{6}-?\\d{3}-?\\d{2}$");
        if (pattern1.test(arguments.Value) || pattern2.test(arguments.Value)) {
            var ssn = arguments.Value.replace(/-/g, "");
            var ssnWithoutControl = ssn.substring(0, 9);
            var control = ssn.substring(9);

            var day = parseInt(ssn.substring(4, 6));
            var month = parseInt(ssn.substring(2, 4));
            var year = parseInt(ssn.substring(0, 2));

            var today = new Date();
            if (year >= 0 && year <= today.getFullYear() - 2000)
                ssnWithoutControl = "2" + ssnWithoutControl;

            var ssnWithoutControlNumber = parseInt(ssnWithoutControl);
            var controlNumberExpected = 97 - (ssnWithoutControlNumber % 97);
            var controlNumberReceived = parseInt(control);

            arguments.IsValid = !(controlNumberReceived != controlNumberExpected || day > 31 || month > 12);
        } else
            arguments.IsValid = false;
    }

    //TODO there should be a better way to get this working correctly
    var x = source.controltovalidate;
    if (arguments.IsValid) {
        $("#" + x).removeClass("jq-error");
    } else {
        $("#" + x).addClass("jq-error");
    }
}


//upload scripts for excel upload

// Variable to store your files
var files;
var urlProtocolAndHostname = location.protocol + "//" + window.location.hostname;
var urlBatchOrderHandler = urlProtocolAndHostname + "/Handler/B2BOrder.ashx";

//to stop the update of the progress when done or error
var timerProgress;

// Grab the files and set them to our variable
function prepareUpload(event) {
    files = event.target.files;
}

// Catch the form submit and upload the files
function uploadFiles() {
    initUploadFiles();
    $("#container").hide();
    //var interval = 5000;

    var data = new FormData();
    data.append("action", "upload");
    data.append("file", files[0], files[0].name);
    data.append("orderType", $('input[id$=hiddenOrderType]').val());
    data.append("contractOrganismNumber", $('input[id$=hiddenContractOrganismNumber]').val());
    data.append("productSapId", $('input[id$=hiddenProductSapId]').val());
    data.append("contractProductNumber", $('input[id$=hiddenContractProductNumber]').val());
    data.append("sapUserId", $('input[id$=hiddenSapUserId]').val());
    data.append("sapOrganisationId", $('input[id$=hiddenSapOrganisationId]').val());
    var isError = false;
    $.ajax({
        url: urlBatchOrderHandler,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        responseType: 'json',
        success: function (data, textStatus, request) {
            var jobId = request.getResponseHeader('location');

            // Set hidden field in order to pass it to codebehind
            $("#hiddenJobId").val(jobId);
            $("#faiDialogInfo").dialog({
                close: function (event, ui) { location.reload(); window.scrollTo(0, 0); },
                modal: true,
                title: $("[id$=faiDialogTitle]").val(),
                width: 400,
                resizable: false,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                        location.reload();
                        window.scrollTo(0, 0);
                    }
                }
            });
            //checkProgressJob(jobId);

            // timerProgress = setInterval(function () {
            // checkProgressJob(jobId);
            // }, interval);

            $("#spinner").hide();


        },
        error: function (jqXHR, textStatus, errorType) {
            var errorMessage = "Error processing batch. Try again. If the problem persists, please contact NMBS/SNCB. Error: " + errorType;
            //+ ": " + (jqXHR.responseText || textStatus)
            //setUploadProgress(100, errorMessage, "error"); 
            isError = true;
            //$(".dialogueContent").text(errorMessage);
            //clearInterval(timerProgress);
            //$(".ui-dialog:first").hide();
            $("#container").find("div").text(errorMessage);
            $("#container").show();

            $("#spinner").hide();
            toggleUploadButton(true);
            //toggleCompleteButton(false);
        }
    });







}

function initUploadFiles() {
    event.stopPropagation(); // Stop stuff happening
    event.preventDefault(); // Totally stop stuff happening

    // Initialize progressbar
    $(".progressContainer").show();
    $(".progressBarValue").show();

    setUploadProgress(0, 'Uploading...');

    // Show spinner
    $("#spinner").show();

    // Remove click event to prevent double clicking
    toggleUploadButton(false);
}

function toggleCompleteButton(enable) {
    if (enable) {
        $("#btnNextStep").parent('div').parent('div').css("display", "");
        $("#triggerUpload").off('click');
        $("#triggerUpload").parent('div').parent('div').css('display', 'none');
    } else {
        $("#btnNextStep").parent('div').parent('div').css("display", "none");
    }
}

function toggleUploadButton(enable) {
    if (enable) {
        $("#triggerUpload").on('click', uploadFiles);
        $("#triggerUpload").parent('div').attr('class', 'btn-orange');
    } else {
        $("#triggerUpload").off('click');
        $("#triggerUpload").parent('div').attr('class', 'btn-gray');
    }
}

var missedStatusMessageCount = 0;

function checkProgressJob(jobId) {


    var queryString = "?action=status&jobId=" + jobId;

    $.ajax({
        url: urlBatchOrderHandler + queryString,
        type: 'GET',
        data: null,
        cache: false,
        contentType: false,
        processData: false,
        responseType: 'json',
        success: function (data) {
            updateProgress(data);
            missedStatusMessageCount = 0;
        },
        error: function (jqXHR, textStatus) {
            if (++missedStatusMessageCount >= 5) {
                var errorMessage = "Unable to retrieve status... If this continues for a couple minutes, please retry. Error: " + textStatus;
                setUploadProgress(100, errorMessage, "inconclusive");
                missedStatusMessageCount = 0;
            }
        }
    });
}

function checkProgressCommit(shoppingBasketId) {


    var queryString = "?action=status&type=commit&jobId=" + shoppingBasketId;
    var checkoutUrl = urlProtocolAndHostname + $("#checkoutUrl").val();

    $.ajax({
        url: urlBatchOrderHandler + queryString,
        type: 'GET',
        data: null,
        cache: false,
        contentType: false,
        processData: false,
        responseType: 'json',
        success: function (response) {
            if (response.status == 'committed') {
                clearInterval(timerProgress);
                //$.unblockUI(); check if this does not block redirect
                window.location.href = checkoutUrl;
            }
            missedStatusMessageCount = 0;
        },
        error: function (jqXHR, textStatus) {
            if (++missedStatusMessageCount >= 20) {
                errorSummary.show();
                errorList.append('<ul>' + $b2bDictionaryConfirmShoppingbasket['ShoppingBasket.Errors.CommittingShoppingBasketFailed'] + ' (status) </ul>');

                clearInterval(timerProgress);
                missedStatusMessageCount = 0;
                $.unblockUI();
            }
        }
    });
}

function updateProgress(data) {
    var percentage = data.percentage;
    var isCompleteWithPrice = data.isCompleteWithPrice;

    if (data.errorMessage) {
        setUploadProgress(100, data.errorMessage, "error");
        clearInterval(timerProgress);
        completeBatchOrder(false);
    } else if (percentage >= 100 && isCompleteWithPrice) {
        // Process is finished, stop timer
        setUploadProgress(100, null, "success");
        clearInterval(timerProgress);
        completeBatchOrder(true);
    } else {
        setUploadProgress(percentage, data.currentAction);
    }
}

function completeBatchOrder(success) {
    $("#spinner").hide();
    toggleUploadButton(!success);
    toggleCompleteButton(success);
}

function setUploadProgress(percentage, message, type) {
    var percentageText = (percentage || 0) + "%";
    $(".progressBar").width(percentageText);
    $(".progressBarValue").text(message || percentageText);
    $(".progressBar").removeClass("error success inconclusive").addClass(type);
}

function ValidatePage() {

    if (typeof (Page_ClientValidate) == 'function') {
        Page_ClientValidate();
    }

    if (Page_IsValid) {
        return true;
    }
    else {
        return false;
    }
}

function commitShoppingBasket() {
    var errorSummary = $("#jsValidationSummary");
    var errorList = $("#errorList");

    errorSummary.hide();


    if (!ValidatePage()) {
        $.unblockUI();
        return;
    }
    $.blockUI();
    var interval = 5000;

    var queryString = "?action=commitshoppingbasket";
    var isFileUpload = $("input[name*='InputFieldIsFileUpload']").val() == 'True'
    var data = new FormData();
    data.append("action", "CommitShoppingBasket");
    data.append("customerReference", $('#CustomerReference').val());
    data.append("password", $('#Password').val());


    $.ajax({
        url: urlBatchOrderHandler + queryString,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        responseType: 'json',
        success: function (data, textStatus, request) {
            errorSummary.hide();
            if (!isFileUpload) {
                var shoppingBasketId = request.getResponseHeader('location');
                timerProgress = setInterval(function () {
                    checkProgressCommit(shoppingBasketId);
                }, interval);
            }

            //$.unblockUI();
        },
        error: function (jqXHR, textStatus, errorType) {
            errorSummary.show();
            errorList.append('<ul>' + $b2bDictionaryConfirmShoppingbasket['ShoppingBasket.Errors.CommittingShoppingBasketFailed'] + '</ul>');
            $(".ui-dialog-buttonset").find("button").unbind("click").bind("click", function () {
                $("#faiConfirmationDialog").dialog("close");
            });

            $(".ui-dialog-titlebar").find("a").unbind("click").bind("click", function () {
                $("#faiConfirmationDialog").dialog("close");
            });

            $(".dialogueContent").text("Something went wrong.");
            $.unblockUI();
        }
    });
    if (isFileUpload) {
        $.unblockUI();
        $("#faiConfirmationDialog").dialog({
            close: function (event, ui) {
                $.blockUI();
                window.location.replace(document.location.origin + "/" + $('html').attr('lang') + "/b2b/buy");
                //var shoppingBasketId = request.getResponseHeader('location');
                // timerProgress = setInterval(function () {
                // checkProgressCommit(shoppingBasketId);
                // }, interval);
            },
            modal: true,
            title: $("[id$=faiConfirmDialogTitle]").val(),
            width: 400,
            resizable: false,
            buttons: {
                Ok: function () {
                    $(this).dialog("close");
                    //location.reload();
                    //window.scrollTo(0, 0);
                    window.location.replace(document.location.origin + "/" + $('html').attr('lang') + "/b2b/buy");
                    //var shoppingBasketId = request.getResponseHeader('location');
                    // timerProgress = setInterval(function () {
                    //checkProgressCommit(shoppingBasketId);
                    // }, interval);
                }
            }
        });
    }
}


