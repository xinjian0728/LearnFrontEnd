/**
* 金额的格式化，每3位加一个，符号
* 1、首先小数点后的位数不做处理，把要处理的金额分为2部分：整数部分和
* 2、反转整数部分，因为加逗号是从右边开始的
* 3、算法部分：每三位加一个逗号，
* 4、再次反转，拼接上小数，返回
**/ 

function formatMoney(money){
	var dotIdx = money.lastIndexOf('.');
	var moneyInt,dotVal,temp='';
	if(dotIdx > -1){
		moneyInt = money.substring(0 , dotIdx);
		if(moneyInt.length <= 3){
			return money;
		}
		dotVal = money.substring(dotIdx , money.length)
	}else{
		if(money.length <= 3){// 不足3位直接返回
			return money;
		}
	}
	moneyInt = reverse(moneyInt);
	for(var i = 0;i < moneyInt.length;i++){
		if(i * 3 + 3 > moneyInt.length){
			temp += moneyInt.substring(i * 3 , moneyInt.length);
			break;
		}
		temp += moneyInt.substring(i * 3, i * 3 + 3) + ',';
	}
	// 最后一位不一定有有逗号，如果有那么就给删掉
	if(temp.lastIndexOf(',') == temp.length -1){
		temp = temp.substring(0 , temp.length - 1);
	}
	return reverse(temp) + dotVal;
}

/**
* 反转
**/
function reverse(num){
	if(!num) return num;
	var ary = [];
	for(var i=num.length - 1;i < num.length;i--){
		if(i < 0){
			break;
		}
		ary.push(num.charAt(i));
	}
	return ary.join('');
}