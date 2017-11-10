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
function MonthDay(type, value) {
	this.type = type;
	this.value = value;
	this.init(type, value);
}

MonthDay.prototype = {
	init:function (type, value) {
		var daysRange = []
			, valueArr = value.split('-')
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
				daysRange = this.getWorkingDays();
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
		monthDay[1] += monthDay[1] + _isLeap(year);
		
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
		
		startDay = value + '-' + this.workingDays;
		endDay = value + '-' + this.workingDays;
		
		if(parseInt(valueArr[1]) === 1){
			endDay = (parseInt(valueArr[0]) - 1).toString() + '-12-' + this.workingDays;
		}
		
		dayArr.push(startDay);
		dayArr.push(endDay);
		
		return dayArr;
	}
	
	/**
	 * 获取范围内的所有日期
	 * @param daysRange 日期的范围
	 */
	, getDaysArr : function (daysRange) {
	
	}
	
	/**
	 * 获取日期的信息是周几
	 * @param day 日期信息 格式为 “****-**-**”
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
		console.log(holidays);
		console.log(holidays.officialHoliday[month])
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

module.exports = MonthDay ;