"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCurrentTime = getCurrentTime;
exports.getCurrentCountDownTime = getCurrentCountDownTime;
exports.getTotalDuraction = getTotalDuraction;
exports.getIntervalTime = getIntervalTime;
exports.getPercent = getPercent;
/**
 * [getCurrentTime description]
 * @param  {Float} currentTime [current time]
 * @return {String}             [min : second]
 */
function getCurrentTime(currentTime) {
    var min = Math.floor(currentTime / 60),
        sec = Math.floor(currentTime % 60);
    sec = sec / 10 < 1 ? "0" + sec : sec;
    return min + " : " + sec;
}

function getCurrentCountDownTime() {
    var totalTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var currentTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


    totalTime = isNaN(totalTime) ? 0 : totalTime;
    currentTime = isNaN(currentTime) ? 0 : currentTime;

    var restTime = totalTime - currentTime;

    var min = Math.floor(restTime / 60),
        sec = Math.floor(restTime % 60);

    sec = sec / 10 < 1 ? "0" + sec : sec;
    return min + " : " + sec;
}

/**
 * total duration of the whole program
 * @param  {Float} duration [total duration]
 * @return {String}           [min : second]
 */
function getTotalDuraction() {
    var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


    var min = Math.ceil(duration / 60),
        sec = Math.ceil(duration % 60);

    min = min === Number.NaN ? 0 : min;
    sec = sec === Number.NaN ? 0 : sec;

    sec = sec / 10 < 1 ? "0" + sec : sec;
    return min + " : " + sec;
}
/**
 * get the min and max time of the video piece
 * @param  {Array} videoDataList   [video piece data list]
 * @param  {Integer} videoId       [current video piece data id]
 * @return {Object}                [min and max]
 */
function getIntervalTime(videoDataList, videoId) {
    var max = 0,
        min = 0;
    for (var i = 0; i <= videoId; i++) {
        var v = videoDataList[i];
        max += v.duration; // 没有duration属性
    }

    // if videoId = 0, then min should be 0
    min = videoId ? max - videoDataList[videoId].duration : 0;
    return {
        max: max,
        min: min
    };
}
/**
 * [get percentage]
 * @param  {Float} percent  [percent]
 * @return {Float}          [percent in range [0, 1]]
 */
function getPercent(percent) {
    percent = percent > 1 ? 1 : percent, percent = percent < 0 ? 0 : percent;
    return percent;
}