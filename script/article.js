define(['lodash'],function(_){

	var articles = [];

	function loadData(){
		for(var i = 1; i <= 20; ++i){
			//articles.push(i+'.png');
			articles.push('./images/'+i+'.png');
		}
		articles = _.shuffle(articles);
	};

	return {
		init : function(){
			loadData();
		},
		getById : function(id){
			return articles[id-1];
		},
		getAll : function(){
			return articles;
		}
	};
});