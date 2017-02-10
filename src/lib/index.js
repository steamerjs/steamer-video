/**
 * [getCurrentTime description]
 * @param  {Float} currentTime [current time]
 * @return {String}             [min : second]
 */
export function getCurrentTime(currentTime) {
    let	min = Math.floor(currentTime / 60),
        sec = Math.floor(currentTime % 60);
    sec = ((sec / 10) < 1) ? "0" + sec : sec;
    return min + " : " + sec;
}

export function getCurrentCountDownTime(totalTime = 0, currentTime = 0) {

    totalTime = (isNaN(totalTime)) ? 0 :totalTime;
    currentTime = (isNaN(currentTime)) ? 0 :currentTime;
    
    let restTime = totalTime - currentTime;

    let min = Math.floor(restTime / 60),
        sec = Math.floor(restTime % 60);

    sec = ((sec / 10) < 1) ? "0" + sec : sec;
    return min + " : " + sec;
}

/**
 * total duration of the whole program
 * @param  {Float} duration [total duration]
 * @return {String}           [min : second]
 */
export function getTotalDuraction(duration = 0) {

    let	min = Math.ceil(duration / 60),
        sec = Math.ceil(duration % 60);

    min = (min === Number.NaN) ? 0 : min;
    sec = (sec === Number.NaN) ? 0 : sec;

    sec = ((sec / 10) < 1) ? "0" + sec : sec;
    return min + " : " + sec;
}
/**
 * get the min and max time of the video piece
 * @param  {Array} videoDataList   [video piece data list]
 * @param  {Integer} videoId       [current video piece data id]
 * @return {Object}                [min and max]
 */
export function getIntervalTime(videoDataList, videoId) {
    let max = 0,
        min = 0;
    for (let i = 0; i <= videoId; i++) {
        let v = videoDataList[i];
        max += v.duration;  // 没有duration属性
    }

    // if videoId = 0, then min should be 0
    min = (videoId) ? (max - videoDataList[videoId].duration) : 0;
    return {
        max,
        min,
    }
}
/**
 * [get percentage]
 * @param  {Float} percent  [percent]
 * @return {Float}          [percent in range [0, 1]]
 */
export function getPercent(percent) {
    percent = (percent > 1) ? 1 : percent,
    percent = (percent < 0) ? 0 : percent;
    return percent;
}