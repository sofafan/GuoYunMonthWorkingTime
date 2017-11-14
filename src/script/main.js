/**
 * Created by fan on 2017/9/29.
 */
var kit = require('./kit.js')
	, daysInfo = require('./daysInfo.js')
	, computTime = require('./computTime.js')
;

var a = kit.readJsonFile("src/JSON/2.json")
	, workingDays = new daysInfo('workingDays', '2017-11')
	, workingDaysInfo = workingDays.getDaysCount()
	, computTime = new computTime(a)
	, monthDay = []
	, monthDays = workingDaysInfo.workingDaysCount
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
var time = computTime.getAllTime()
	, elapsingTime = computTime.elapsedTime(time)
	, remainingTime = computTime.timeRemain(time, monthTime)
	, leftDay = monthDays - computTime.aleardyDays
	, leftTime = monthTime - time
	, extraTime = computTime.extraDayTime(leftDay, leftTime)
	, remainingTimeAll = leftTime - leftDay * 8 * 60
;


console.log(time, leftTime, monthTime);
console.log('还剩下',leftDay,'天','已经上班：',elapsingTime,'还剩时间：', remainingTime,'总欠时间：', remainingTimeAll, '剩下每天需要多上多长时间：',extraTime);
