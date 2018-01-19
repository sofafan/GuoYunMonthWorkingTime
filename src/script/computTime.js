/**
 * Created by fan on 2017/11/8.
 */
// var fs = require('fs')

var http = require('http')
;

function ComputTime(daysArr) {
	this.daysArr = daysArr;
	this.monthDay = [];
	this.init(daysArr);
}
ComputTime.prototype = {
	init: function (daysArr) {
		var self = this
			, monthDay = []
		;
		
		for(var Key in daysArr[0]){
			var day = []
				,morning = daysArr[0][Key].morning
				, night = daysArr[0][Key].night
			;
			day.push(morning.split(':'),night.split(':'));
			monthDay.push(day);
		}
		
		this.monthDay = monthDay;
		this.aleardyDays = monthDay.length;
		
	}
	
	/**
	 * 获取所有的时间
	 * @return {number}
	 */
	, getAllTime : function () {
		var timeAmout = 0;
		
		for(var i = 0; i < this.monthDay.length; i++){
			var day = this.monthDay[i]
				, morningTime = parseInt(day[0][0]) * 60 + parseInt(day[0][1])
				, nightTime = parseInt(day[1][0]) * 60 + parseInt(day[1][1])
				, time = nightTime - morningTime
			;
			
			if(parseInt(day[0][1]) === 12){
				time += parseInt(day[1][1])
			}
			
			if(parseInt(day[0][0]) >= 13){
				time += 60;
			}
			
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
	,  elapsedTime : function(time) {
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
	, timeRemain : function (time, allTime) {
		var leftTime = allTime - time
			, mTime = leftTime % 60 < 10 ? '0' + leftTime % 60 : leftTime % 60
			, rTime
		;
		rTime = Math.floor(leftTime / 60) + ':' + mTime;
		return rTime;
	}
	
	/**
	 * 剩下来的时间
	 * @param leftDay
	 * @param leftTime
	 * @return {string}
	 */
	,extraDayTime : function (leftDay, leftTime) {
		var dayTime = leftTime / leftDay / 60 - 8;
		return (dayTime * 60).toFixed(0);
	}
};

module.exports = ComputTime;