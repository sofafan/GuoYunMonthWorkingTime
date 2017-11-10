/**
 * Created by fan on 2017/11/8.
 */
var fs = require('fs')
;


var kit = {
	/**
	 * 用语获取JSON数据
	 * @param src 文件的地址
	 * @return JsonText 获取到的数据文件
	 */
	readJsonFile:function (src) {
		if(!src){
			return;
		}
		var file = fs.readFileSync(src)
			, JsonText = JSON.parse(file);
		return JsonText;
		
		//这里面最好在添加一个判断是否为JSON文件的内容。
		//增加一个判断是否有该函数
	}
	
};

module.exports = kit;