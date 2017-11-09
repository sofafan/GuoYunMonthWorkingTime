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
 * @param value 根据不同的type穿过的日期类型：year，month，day,workingDays 为单个数值，days 为数组类型
 * @constructor
 */
function MonthDay(type, value) {
	this.type = type;
	this.value = value;
	this.init(type, value);
}

MonthDay.prototype = {
	init:function (type, value) {
	
	}
	, getHoliday : function () {
	
	}
};


module.exports = MonthDay ;