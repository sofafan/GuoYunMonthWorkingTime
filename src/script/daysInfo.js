/**
 * Created by fan on 2017/11/7.
 */
var http = require('http')
	, fs = require('fs')
	, kit = require('./kit.js')
	, monthInfo = {}    //每月得到信息
;

/**
 * 一个阶段日期的节假日和工作日的算法
 * 统一的单个日期格式为"2017-01-01"
 * @param type  传过来参数类型包含 year 年份，month 月份，day 单日，workingDays 工作日期（以上个月的25号到当月25号为准）, days 收到输入的日期
 * @param value 根据不同的type穿过的日期类型：year，month，day,workingDays 为单个字符值，days 为数组类型
 * @constructor
 */
function daysInfo(type, value) {
	this.type = type;
	this.value = value;
	this.init(type, value);
}

daysInfo.prototype = {
	init:function (type, value) {
		var daysRange = []
			, workingDays = 25
		;
		this.type = type;
		this.value = value;
		this.workingDays = workingDays;
		
		switch (type){
			case 'year':
				daysRange.push(value + '-01-01');
				daysRange.push(value + '-12-31');
				break;
			case 'month':
				daysRange.push(value + '-01');
				daysRange.push(value + '-' + this.getMonthDays(value));
				break;
			case 'day':
				daysRange.push(value);
				break;
			case 'workingDays':
				daysRange = this.getWorkingDays(value);
				break;
			case 'days':
				daysRange = value;
				break;
		}
		
		this.daysRange = daysRange;
	}
	
	/**
	 * 获取当前月份的天数
	 * @param value 格式为'****-**'
	 */
	, getMonthDays : function (value) {
		var valueArr = value.split('-')
			, year
			, month
			, monthDay = [31, 28 , 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]  //每个月对应的天数
		;
		if(valueArr.length !== 2 && valueArr[0].length !== 4 && valueArr[1].length !== 2){
			return;
		}
		
		year = parseInt(valueArr[0]);
		month = parseInt(valueArr[1]);
		monthDay[1] = monthDay[1] + _isLeap(year); //更新二月的天数
		
		return monthDay[month - 1];
	}
	
	/**
	 * 获取单个月工作的
	 * @param value 格式为'****-**'
	 */
	, getWorkingDays : function (value) {
		var valueArr = value.split('-')
			, dayArr = []
			, startDay
			, endDay
		;
		
		startDay = value + '-' + (this.workingDays + 1);
		endDay = value + '-' + this.workingDays;
		
		if(parseInt(valueArr[1]) === 1){
			startDay = (parseInt(valueArr[0]) - 1).toString() + '-12-' + (this.workingDays + 1);
		}
		
		dayArr.push(startDay);
		dayArr.push(endDay);
		
		return dayArr;
	}
	
	/**
	 * 获取范围内的所有日期。
	 * @param daysRange 日期的范围
	 */
	, getDaysArr : function (daysRange) {
		var startDaysArr = daysRange[0].split('-') , endDaysArr = daysRange[1].split('-') //起始和结束日期信息
			, yearArr = [] , monthArr = []
			, startMonth = startDaysArr[1], endMonth = endDaysArr[1]
			, daysArr = []
			, self = this
		;
		
		//获取年份数组
		for(var i = parseInt(startDaysArr[0]); i <= parseInt(endDaysArr[0]); i ++){
			yearArr.push(i);
		}
		
		//处理所有月份数组
		if(yearArr.length === 1){
			for(var m = parseInt(startMonth); m <= parseInt(endMonth); m++){
				monthArr.push(startDaysArr[0] + '-' +_numToString(m));
			}
		}
		else {
			for(var h = parseInt(startMonth); h <= 12; h++){
				monthArr.push(startDaysArr[0] + '-' +_numToString(h));
			}
			
			for(var j = 0; j < yearArr.length - 2; j++){
				for(var k = 1; k <= 12; k++){
					monthArr.push(yearArr[j + 1].toString() + '-' +_numToString(k));
				}
			}
			
			for(var o = 1; o <= parseInt(endMonth); o++){
				monthArr.push(endDaysArr[0] + '-' +_numToString(o));
			}
		}
		
		//遍历月份获取所有的日期
		monthArr.forEach(function (item, index) {
			var monthDays = self.getMonthDays(item) //当前月份的天数
				, startDay = 1
				, endDay = monthDays
			;
			
			if(index === 0 && parseInt(self.daysRange[0].substring(8)) !== 1){
				startDay =  parseInt(self.daysRange[0].substring(8));
			}
			
			if(index === monthArr.length - 1 && parseInt(self.daysRange[1].substring(8)) !== monthDays){
				endDay = parseInt(self.daysRange[1].substring(8));
			}
			
			
			for(var p = startDay; p <= endDay; p++){
				daysArr.push(item + '-' +_numToString(p))
			}
		});
		
		return daysArr;
	}
	
	/**
	 * 获取日期的信息是周几
	 * @param value 日期信息 格式为 “****-**-**”
	 */
	, getDayInfo : function (value) {
		if(!value && typeof value !== "string" && !/^\d{4}\-\d{2}\-\d{2}$/.test(value)){
			return ;
		}
		
		var valueArr = value.split('-')
			, year = valueArr[0]
			, month = valueArr[1]
			, day = valueArr[2]
			, holidays = kit.readJsonFile("src/JSON/holiday/"+ year +".json")
			, daysInfo = {}
			, date = new Date(value)
		;
		daysInfo[value] = 0;
		//判断是否为假期
		if(holidays.officialHoliday.hasOwnProperty(month)){
			if(holidays.officialHoliday[month].indexOf(day) !== -1){
				daysInfo[value] = 2;
			}
		}
		
		//判断是否为工作日
		if(date.getDay() === 6 || date.getDay() === 0){
			daysInfo[value] = 1;
		}
		
		//判断是否调休日子
		if(holidays.daysOff.hasOwnProperty(month)){
			if(holidays.daysOff[month].indexOf(day) !== -1){
				daysInfo[value] = 0;
			}
		}
		
		return daysInfo;
	}
	
	/**
	 * 获取范围内的所有日期工作日，休息日，节假日的日期。
	 */
	, getDaysInfo : function () {
		var self = this
			, daysRange = self.daysRange
			, daysArr = self.getDaysArr(daysRange)
			, workingDays = []
			, daysOff = []
			, holidays = []
			, daysInfo = {}
		;
		
		daysArr.forEach(function (item) {
			var value = self.getDayInfo(item)[item];
			
			if(value === 0){
				workingDays.push(item);
			}
			else if(value === 1){
				daysOff.push(item);
			}
			else{
				holidays.push(item);
			}
		})
		
		daysInfo.workingDays = workingDays;
		daysInfo.daysOff = daysOff;
		daysInfo.holidays = holidays;
		
		// return JSON.stringify(daysInfo);
		return daysInfo;
		// console.log(JSON.stringify(daysArr));
		
	}
	
	/**
	 * 获取范围内的所有日期工作日，休息日，节假日的数量。
	 */
	, getDaysCount : function () {
		var self = this
			, daysRange = self.daysRange
			, daysArr = self.getDaysArr(daysRange)
			, workingDaysCount = 0
			, daysOffCount = 0
			, holidaysCount = 0
			, daysInfo = {}
		;
		
		daysArr.forEach(function (item) {
			var value = self.getDayInfo(item)[item];
			
			if(value === 0){
				workingDaysCount++;
			}
			else if(value === 1){
				daysOffCount++;
			}
			else{
				holidaysCount++;
			}
		})
		
		daysInfo.workingDaysCount = workingDaysCount;
		daysInfo.daysOffCount = daysOffCount;
		daysInfo.holidaysCount = holidaysCount;
		
		// return JSON.stringify(daysInfo);
		return daysInfo;
		// console.log(JSON.stringify(daysArr));
		
	}
};


/**
 * 判断是否是润数年
 * @param year
 * @returns {number}
 */
function _isLeap (year) {
	var res = year % 100 === 0 ? (year % 400 === 0 ? 1 : 0) : ( year % 4 === 0 ?1 : 0);
	return res;
}

/**
 * 把时间戳数值而是转换为符合字符，小于10的数字或在前面添加0
 * @param num   传过来的数值
 * @return {*}
 */
function _numToString(num) {
	var string;
	if(typeof num !== 'number'){
		return;
	}
	
	if(num < 10){
		string = '0' + num;
	}
	else{
		string = num.toString();
	}
	
	return string
}

module.exports = daysInfo ;