"use strict";
var BrowserScore = (function () {
    function BrowserScore(title, experienceScores) {
        if (experienceScores === void 0) { experienceScores = []; }
        this.count = 0;
        this.score = 0;
        this.title = title;
        this.experienceScores = experienceScores;
    }
    return BrowserScore;
}());
exports.BrowserScore = BrowserScore;
var ExperienceScore = (function () {
    function ExperienceScore(title) {
        this.score = 0;
        this.title = title;
        this.featureScores = [];
    }
    return ExperienceScore;
}());
exports.ExperienceScore = ExperienceScore;
var FeatureScore = (function () {
    function FeatureScore(title) {
        this.score = 0;
        this.title = title;
        this.dimensionScores = [];
    }
    return FeatureScore;
}());
exports.FeatureScore = FeatureScore;
var DimensionScore = (function () {
    function DimensionScore(title) {
        this.title = title;
    }
    return DimensionScore;
}());
exports.DimensionScore = DimensionScore;
var WordCount = (function () {
    function WordCount() {
    }
    return WordCount;
}());
exports.WordCount = WordCount;
(function (TaskType) {
    TaskType[TaskType["instruction"] = 'instruction'] = "instruction";
    TaskType[TaskType["question"] = 'question'] = "question";
})(exports.TaskType || (exports.TaskType = {}));
var TaskType = exports.TaskType;
(function (TaskSubtype) {
    TaskSubtype[TaskSubtype["none"] = 'none'] = "none";
    TaskSubtype[TaskSubtype["yesNoMaybe"] = 'yesNoMaybe'] = "yesNoMaybe";
    TaskSubtype[TaskSubtype["timeOnTask"] = 'timeOnTask'] = "timeOnTask";
    TaskSubtype[TaskSubtype["agreementScale"] = 'agreementScale'] = "agreementScale";
    TaskSubtype[TaskSubtype["wordAssociation"] = 'wordAssociation'] = "wordAssociation";
    TaskSubtype[TaskSubtype["satisfactionScale"] = 'satisfactionScale'] = "satisfactionScale";
    TaskSubtype[TaskSubtype["written"] = 'written'] = "written";
})(exports.TaskSubtype || (exports.TaskSubtype = {}));
var TaskSubtype = exports.TaskSubtype;
