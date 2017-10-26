/**
 * Created by fan on 2017/9/29.
 */
var fs = require('fs')
	, file = "1.json"
	, a = JSON.parse(fs.readFileSync( file))
	, b = new Date()
	, monthDay = []
	, monthDays = 18
	, monthTime = monthDays * 8 * 60
;

for(var Key in a[0]){
	var day = []
		,morning = a[0][Key].morning
		, night = a[0][Key].night
	;
	day.push(morning.split(':'),night.split(':'));
	monthDay.push(day);
}
var time = computTime(monthDay)
	, elapsingTime = elapsedTime(time)
	, remainingTime = timeRemain(time, monthTime)
	, leftDay = monthDays - monthDay.length  //本月特殊因为少上一天的班
	, leftTime = monthTime - time
	, extraTime = extraDayTime(leftDay, leftTime)
	, remainingTimeAll = leftTime - leftDay * 8 * 60
;
console.log(time, leftTime, monthTime);
console.log('还剩下',leftDay,'天','已经上班：',elapsingTime,'还剩时间：', remainingTime,'总欠时间：', remainingTimeAll, '剩下每天需要多上多长时间：',extraTime);



/**
 * 计算时间
 * @param arr
 */
function computTime(arr) {
	var timeAmout = 0;
	for(var i = 0; i < arr.length; i++){
		var day = arr[i]
			, morningTime = parseInt(day[0][0]) * 60 + parseInt(day[0][1])
			, nightTime = parseInt(day[1][0]) * 60 + parseInt(day[1][1])
			, time = nightTime - morningTime
		;
		// console.log(parseInt(day[1][0]) >= 13);
		if(parseInt(day[1][0]) >= 13){
			time = time - 60;
		}
		if(parseInt(day[1][0]) >= 20){
			time -= 30;
		}
		timeAmout += time;
	}
	return timeAmout;
}

/**
 * 格式化成小时模式
 * @param time
 */
function elapsedTime(time) {
	var eTime
		, mTime = time % 60 < 10 ? '0' + time % 60 : time % 60
	;
	eTime = Math.floor(time / 60) + ':' + mTime;
	return eTime ;
}

/**
 * 剩余时间
 * @param time
 * @param allTime
 * @returns {string|*}
 */
function timeRemain(time, allTime) {
	var leftTime = allTime - time
		, mTime = leftTime % 60 < 10 ? '0' + leftTime % 60 : leftTime % 60
		, rTime
	;
	rTime = Math.floor(leftTime / 60) + ':' + mTime;
	return rTime;
}

function extraDayTime(leftDay, leftTime) {
	var dayTime = leftTime / leftDay / 60 - 8;
	return (dayTime * 60).toFixed(0);
}
