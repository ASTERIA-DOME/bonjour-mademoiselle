define(['stepgallery','article','jquery','masonry','imagesLoaded'],function(view, model,$,masonry,imagesLoaded){

	var ANIMATION_END = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';

	var $intro = $('.intro');
	var $stepGallery = $('.step-gallery');
	var $frameGallery = $('.frame-gallery');
	var $popup = $('.popup');
	var bgm = $('#bgm')[0];
	var grid;
	var currentArticle = 1;
	var currentGallery = 'intro';
	var maxArticle = 20;

	function moveToStepGallery(){
		$intro
			.addClass('last')
			.css({
				'animation':'moveLeft .8s ease-in-out'
			})
			.one(ANIMATION_END,function(){
				$(this).css('display','none');
				$(this).off(ANIMATION_END,this.callee);
			});	
		$stepGallery
			.addClass('view')
			.css({
				'display':'block',
				'animation':'moveLeft .8s ease-in-out'
			});

		currentGallery = 'step';
	}

	function moveToFrameGallery(){
		$stepGallery
			.removeClass('view')
			.addClass('last')
			.css({
				'animation':'moveLeft2 .8s ease-in-out'
			})
			.one(ANIMATION_END,function(){
				$(this).css('display','none');
				$(this).off(ANIMATION_END,this.callee);
			});
		$frameGallery
			.addClass('view')
			.css({
				'display':'block',
				'animation':'moveLeft2 .8s ease-in-out'
			});

		grid.layout();
		currentGallery = 'frame';
	}

	function moveBackIntro(){
		$intro
			.removeClass('last')
			.css({
				'display':'block',
				'animation':'moveRight .8s ease-in-out'
			})
		$stepGallery
			.removeClass('view')
			.css({
				'display':'block',
				'animation':'moveRight .8s ease-in-out'
			})
			.one(ANIMATION_END,function(){
				$(this).css('display','none');
				$(this).off(ANIMATION_END,this.callee);
			});
		currentGallery = 'intro';
	}

	function moveBackStepGallery(){
		
		$stepGallery
			.removeClass('last')
			.addClass('view')
			.css({
				'display':'block',
				'animation':'moveRight .8s ease-in-out'
			})
		$frameGallery
			.removeClass('view')
			.css({
				'display':'block',
				'animation':'moveRight .8s ease-in-out'
			})
			.one(ANIMATION_END,function(){
				$(this).css('display','none');
				$(this).off(ANIMATION_END,this.callee);
			});
		currentGallery = 'step';
	}



	function nextArticle(e){
		
		var article = $('.article.view');

		article
			.removeClass('view')
			.addClass('out')
			.css({
				'animation':'fadeOut .3s ease-in'
			})
			.one(ANIMATION_END,function(){
				$(this).remove();
			});

		$('.article.back')
			.removeClass('back')
			.addClass('view')
			.css({
				'animation':'view .8s ease-in-out'
			});

		if(model.getById(currentArticle+1)){
			var newArticle = $('<div class="article back">'+
						'<img src="'+model.getById(currentArticle+1)+'"/>'+
						'<div class="shadow"></div>'+
						'</div>')
			$stepGallery.append(newArticle);
			newArticle.css({
				'animation':'fadeIn 1.2s ease-in-out',
			});
		}

	}

	function prevArticle(){

		if(currentArticle == 0){
			moveBackStepGallery();
		}

		var article = $('.article.view');

		$('.article.back')
			.css({
				'animation':'fadeIn_r .8s ease-in-out'
			})
			.one(ANIMATION_END,function(){
				$(this).remove();
			});

		article
			.removeClass('view')
			.addClass('back')
			.css({
				'z-index':5,
				'animation':'view_r .5s ease-in-out'
			});

		if(model.getById(currentArticle-1)){
			var newArticle = $('<div class="article view">'+
						'<img src="'+model.getById(currentArticle-1)+'"/>'+
						'<div class="shadow"></div>'+
						'</div>')
			$stepGallery.append(newArticle);
			newArticle.css({
				'animation':'fadeOut_r .3s ease-out',
			});
		}
	}

	function clickIntro(){
		moveToStepGallery();
		history.pushState({gallery:'step',id:1},'stepGallery',"#stepGallery");
	}

	function clickArticle(){
		if(maxArticle == currentArticle){
			moveToFrameGallery();
			history.pushState({gallery:'frame',id:0},'frameGallery',"#frameGallery");
			return;
		}
		currentArticle++;

		history.pushState({gallery:'step',id:currentArticle},'stepGallery',"#stepGallery");
		nextArticle();
	}

	function popstateListener(e){
		var state = e.originalEvent.state;
		var gallery = 'intro';
		var article = 0;

		if(state){
		 	gallery = state.gallery || 'intro';
			article = state.id || 0;
		}

		if(currentGallery == 'step'){
			console.log(currentArticle);
			if(gallery == 'step'){
				if(currentArticle > article){
					prevArticle();
					currentArticle = article;
				}else{
					currentArticle = article;
					nextArticle();
				}
			}
			else if(gallery == 'intro') moveBackIntro();
			else if(gallery == 'frame') moveToFrameGallery();
		}
		else if(currentGallery == 'frame'){
			if(gallery == 'step') moveBackStepGallery();
		}
		else if(currentGallery == 'intro'){
			if(gallery == 'step') moveToStepGallery();
		}
	}

	function checkHash(){
		var hash = location.hash;
		if(hash == '#frameGallery'){
			$intro.addClass('last');
			$stepGallery.addClass('last');
			$frameGallery.addClass('view');
		}
	}

	function loadArticle(){
		var view = $('<div class="article view">'+
					'<img src="'+model.getById(1)+'"/>'+
					'<div class="shadow"></div>'+
					'</div>');

		var back = $('<div class="article back">'+
					'<img src="'+model.getById(2)+'"/>'+
					'<div class="shadow"></div>'+
					'</div>');

		$stepGallery.append(view,back);

		var articles = model.getAll();
		var frames = [];
		for(var i = 0; i < articles.length; ++i){
			var frame = $('<div class="frame"><img src="'+articles[i]+'"/></div>');
			frames.push(frame);
		}
		$frameGallery.find('.grid').append(frames);

		grid = new masonry('.frame-gallery .grid', {
			itemSelector: '.frame'
		});
		// layout Masonry after each image loads
		imagesLoaded($frameGallery,function() {
			grid.layout();
		})
	}

	function popupFrame(){
		var frame = $(this);
		$popup.children('.popup-frame')
			.empty()
			.append(frame.children('img').clone());
		$popup.addClass('view');
	}

	function closePopup(e){
		$popup.removeClass('view');
	}

	function toggleMusic(){
		$(this).toggleClass('stop');
		if(bgm.paused){
			bgm.play();
		}else{
			bgm.pause();
		}
	}

	return {
		init : function(){
			model.init();

			//checkHash();

			loadArticle();

			$('.intro .logo').on('click', clickIntro);
			$stepGallery.on('click','.article',clickArticle);
			$(window).on('popstate',popstateListener);
			$('.music').on('click',toggleMusic);
			//$stepGallery.on('click','.article.view',prevArticle);

			$frameGallery.on('click','.frame',popupFrame);
			$popup.on('click',closePopup);

		}
	}
})