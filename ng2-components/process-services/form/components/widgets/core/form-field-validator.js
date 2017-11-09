"use strict";
/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:component-selector  */
var moment = require("moment");
var form_field_types_1 = require("./form-field-types");
var RequiredFieldValidator = (function () {
    function RequiredFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.TEXT,
            form_field_types_1.FormFieldTypes.MULTILINE_TEXT,
            form_field_types_1.FormFieldTypes.NUMBER,
            form_field_types_1.FormFieldTypes.TYPEAHEAD,
            form_field_types_1.FormFieldTypes.DROPDOWN,
            form_field_types_1.FormFieldTypes.PEOPLE,
            form_field_types_1.FormFieldTypes.FUNCTIONAL_GROUP,
            form_field_types_1.FormFieldTypes.RADIO_BUTTONS,
            form_field_types_1.FormFieldTypes.UPLOAD,
            form_field_types_1.FormFieldTypes.AMOUNT,
            form_field_types_1.FormFieldTypes.DYNAMIC_TABLE,
            form_field_types_1.FormFieldTypes.DATE
        ];
    }
    RequiredFieldValidator.prototype.isSupported = function (field) {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            field.required;
    };
    RequiredFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field)) {
            if (field.type === form_field_types_1.FormFieldTypes.DROPDOWN) {
                if (field.hasEmptyValue && field.emptyOption) {
                    if (field.value === field.emptyOption.id) {
                        return false;
                    }
                }
            }
            if (field.type === form_field_types_1.FormFieldTypes.RADIO_BUTTONS) {
                var option = field.options.find(function (opt) { return opt.id === field.value; });
                return !!option;
            }
            if (field.type === form_field_types_1.FormFieldTypes.UPLOAD) {
                return field.value && field.value.length > 0;
            }
            if (field.type === form_field_types_1.FormFieldTypes.DYNAMIC_TABLE) {
                return field.value && field.value instanceof Array && field.value.length > 0;
            }
            if (field.value === null || field.value === undefined || field.value === '') {
                return false;
            }
        }
        return true;
    };
    return RequiredFieldValidator;
}());
exports.RequiredFieldValidator = RequiredFieldValidator;
var NumberFieldValidator = (function () {
    function NumberFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.NUMBER,
            form_field_types_1.FormFieldTypes.AMOUNT
        ];
    }
    NumberFieldValidator.isNumber = function (value) {
        if (value === null || value === undefined || value === '') {
            return false;
        }
        return !isNaN(+value);
    };
    NumberFieldValidator.prototype.isSupported = function (field) {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    };
    NumberFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field)) {
            if (field.value === null ||
                field.value === undefined ||
                field.value === '') {
                return true;
            }
            var valueStr = '' + field.value;
            var pattern = new RegExp(/^-?\d+$/);
            if (field.enableFractions) {
                pattern = new RegExp(/^-?[0-9]+(\.[0-9]{1,2})?$/);
            }
            if (valueStr.match(pattern)) {
                return true;
            }
            field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_NUMBER';
            return false;
        }
        return true;
    };
    return NumberFieldValidator;
}());
exports.NumberFieldValidator = NumberFieldValidator;
var DateFieldValidator = (function () {
    function DateFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.DATE
        ];
    }
    // Validates that the input string is a valid date formatted as <dateFormat> (default D-M-YYYY)
    DateFieldValidator.isValidDate = function (inputDate, dateFormat) {
        if (dateFormat === void 0) { dateFormat = 'D-M-YYYY'; }
        if (inputDate) {
            var d = moment(inputDate, dateFormat, true);
            return d.isValid();
        }
        return false;
    };
    DateFieldValidator.prototype.isSupported = function (field) {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    };
    DateFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field) && field.value) {
            if (DateFieldValidator.isValidDate(field.value, field.dateDisplayFormat)) {
                return true;
            }
            field.validationSummary.message = field.dateDisplayFormat;
            return false;
        }
        return true;
    };
    return DateFieldValidator;
}());
exports.DateFieldValidator = DateFieldValidator;
var MinDateFieldValidator = (function () {
    function MinDateFieldValidator() {
        this.MIN_DATE_FORMAT = 'DD-MM-YYYY';
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.DATE
        ];
    }
    MinDateFieldValidator.prototype.isSupported = function (field) {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.minValue;
    };
    MinDateFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field) && field.value) {
            var dateFormat = field.dateDisplayFormat;
            if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
                field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
                return false;
            }
            // remove time and timezone info
            var d = void 0;
            if (typeof field.value === 'string') {
                d = moment(field.value.split('T')[0], dateFormat);
            }
            else {
                d = field.value;
            }
            var min = moment(field.minValue, this.MIN_DATE_FORMAT);
            if (d.isBefore(min)) {
                field.validationSummary.message = "FORM.FIELD.VALIDATOR.NOT_LESS_THAN";
                field.validationSummary.attributes.set('minValue', field.minValue.toLocaleString());
                return false;
            }
        }
        return true;
    };
    return MinDateFieldValidator;
}());
exports.MinDateFieldValidator = MinDateFieldValidator;
var MaxDateFieldValidator = (function () {
    function MaxDateFieldValidator() {
        this.MAX_DATE_FORMAT = 'DD-MM-YYYY';
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.DATE
        ];
    }
    MaxDateFieldValidator.prototype.isSupported = function (field) {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.maxValue;
    };
    MaxDateFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field) && field.value) {
            var dateFormat = field.dateDisplayFormat;
            if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
                field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
                return false;
            }
            // remove time and timezone info
            var d = void 0;
            if (typeof field.value === 'string') {
                d = moment(field.value.split('T')[0], dateFormat);
            }
            else {
                d = field.value;
            }
            var max = moment(field.maxValue, this.MAX_DATE_FORMAT);
            if (d.isAfter(max)) {
                field.validationSummary.message = "FORM.FIELD.VALIDATOR.NOT_GREATER_THAN";
                field.validationSummary.attributes.set('maxValue', field.maxValue.toLocaleString());
                return false;
            }
        }
        return true;
    };
    return MaxDateFieldValidator;
}());
exports.MaxDateFieldValidator = MaxDateFieldValidator;
var MinLengthFieldValidator = (function () {
    function MinLengthFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.TEXT,
            form_field_types_1.FormFieldTypes.MULTILINE_TEXT
        ];
    }
    MinLengthFieldValidator.prototype.isSupported = function (field) {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            field.minLength > 0;
    };
    MinLengthFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field) && field.value) {
            if (field.value.length >= field.minLength) {
                return true;
            }
            field.validationSummary.message = "FORM.FIELD.VALIDATOR.AT_LEAST_LONG";
            field.validationSummary.attributes.set('minLength', field.minLength.toLocaleString());
            return false;
        }
        return true;
    };
    return MinLengthFieldValidator;
}());
exports.MinLengthFieldValidator = MinLengthFieldValidator;
var MaxLengthFieldValidator = (function () {
    function MaxLengthFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.TEXT,
            form_field_types_1.FormFieldTypes.MULTILINE_TEXT
        ];
    }
    MaxLengthFieldValidator.prototype.isSupported = function (field) {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            field.maxLength > 0;
    };
    MaxLengthFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field) && field.value) {
            if (field.value.length <= field.maxLength) {
                return true;
            }
            field.validationSummary.message = "FORM.FIELD.VALIDATOR.NO_LONGER_THAN";
            field.validationSummary.attributes.set('maxLength', field.maxLength.toLocaleString());
            return false;
        }
        return true;
    };
    return MaxLengthFieldValidator;
}());
exports.MaxLengthFieldValidator = MaxLengthFieldValidator;
var MinValueFieldValidator = (function () {
    function MinValueFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.NUMBER,
            form_field_types_1.FormFieldTypes.AMOUNT
        ];
    }
    MinValueFieldValidator.prototype.isSupported = function (field) {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            NumberFieldValidator.isNumber(field.minValue);
    };
    MinValueFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field) && field.value) {
            var value = +field.value;
            var minValue = +field.minValue;
            if (value >= minValue) {
                return true;
            }
            field.validationSummary.message = "FORM.FIELD.VALIDATOR.NOT_LESS_THAN";
            field.validationSummary.attributes.set('minValue', field.minValue.toLocaleString());
            return false;
        }
        return true;
    };
    return MinValueFieldValidator;
}());
exports.MinValueFieldValidator = MinValueFieldValidator;
var MaxValueFieldValidator = (function () {
    function MaxValueFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.NUMBER,
            form_field_types_1.FormFieldTypes.AMOUNT
        ];
    }
    MaxValueFieldValidator.prototype.isSupported = function (field) {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 &&
            NumberFieldValidator.isNumber(field.maxValue);
    };
    MaxValueFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field) && field.value) {
            var value = +field.value;
            var maxValue = +field.maxValue;
            if (value <= maxValue) {
                return true;
            }
            field.validationSummary.message = "FORM.FIELD.VALIDATOR.NOT_GREATER_THAN";
            field.validationSummary.attributes.set('maxValue', field.maxValue.toLocaleString());
            return false;
        }
        return true;
    };
    return MaxValueFieldValidator;
}());
exports.MaxValueFieldValidator = MaxValueFieldValidator;
var RegExFieldValidator = (function () {
    function RegExFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.TEXT,
            form_field_types_1.FormFieldTypes.MULTILINE_TEXT
        ];
    }
    RegExFieldValidator.prototype.isSupported = function (field) {
        return field &&
            this.supportedTypes.indexOf(field.type) > -1 && !!field.regexPattern;
    };
    RegExFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field) && field.value) {
            if (field.value.length > 0 && field.value.match(new RegExp('^' + field.regexPattern + '$'))) {
                return true;
            }
            field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
            return false;
        }
        return true;
    };
    return RegExFieldValidator;
}());
exports.RegExFieldValidator = RegExFieldValidator;
var FixedValueFieldValidator = (function () {
    function FixedValueFieldValidator() {
        this.supportedTypes = [
            form_field_types_1.FormFieldTypes.TYPEAHEAD
        ];
    }
    FixedValueFieldValidator.prototype.isSupported = function (field) {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    };
    FixedValueFieldValidator.prototype.hasValidNameOrValidId = function (field) {
        return this.hasValidName(field) || this.hasValidId(field);
    };
    FixedValueFieldValidator.prototype.hasValidName = function (field) {
        return field.options.find(function (item) { return item.name && item.name.toLocaleLowerCase() === field.value.toLocaleLowerCase(); }) ? true : false;
    };
    FixedValueFieldValidator.prototype.hasValidId = function (field) {
        return field.options[field.value - 1] ? true : false;
    };
    FixedValueFieldValidator.prototype.hasStringValue = function (field) {
        return field.value && typeof field.value === 'string';
    };
    FixedValueFieldValidator.prototype.hasOptions = function (field) {
        return field.options && field.options.length > 0;
    };
    FixedValueFieldValidator.prototype.validate = function (field) {
        if (this.isSupported(field)) {
            if (this.hasStringValue(field) && this.hasOptions(field) && !this.hasValidNameOrValidId(field)) {
                field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
                return false;
            }
        }
        return true;
    };
    return FixedValueFieldValidator;
}());
exports.FixedValueFieldValidator = FixedValueFieldValidator;
exports.FORM_FIELD_VALIDATORS = [
    new RequiredFieldValidator(),
    new NumberFieldValidator(),
    new MinLengthFieldValidator(),
    new MaxLengthFieldValidator(),
    new MinValueFieldValidator(),
    new MaxValueFieldValidator(),
    new RegExFieldValidator(),
    new DateFieldValidator(),
    new MinDateFieldValidator(),
    new MaxDateFieldValidator(),
    new FixedValueFieldValidator()
];
