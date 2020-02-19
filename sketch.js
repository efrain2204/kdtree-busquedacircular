function setup (){
	var width = 500 ;
	var height = 500 ;
	createCanvas ( width , height );
	background ( 0 );
	for ( var x = 0 ; x < width ; x += width / 10 ) {
		for ( var y = 0 ; y < height ; y += height / 5 ) {
			stroke ( 125 , 125 , 125 );
			strokeWeight ( 1 );
			line ( x , 0 , x , height );
			line ( 0 , y , width , y );
		}
	}
	var data = [];
	for ( let i = 0 ; i < 31 ; i ++){
		var x=Math.floor(Math.random()*height);
		var y=Math.floor(Math.random()*height);
		data.push ([x,y]);
		fill(255,255,255);
		circle(x,height-y,7); //200-y para q se dibuje apropiadamente
		textSize(8);
		text(x+','+y,x+5,height-y); //200-y para q se dibuje apropiadamente
	}
	var root = build_kdtree ( data );
	var fe=[];
	var pon=[237,218];
	var h=[50,100]
	var radio=75;
	range_query_circle(root,pon,radio,fe);
	fill(0,255,0,40);
	circle(pon[0],height-pon[1],radio*2)
	//console.log(fe);

	//fill(0,255,0,40);
	//rect(pon[0]-h[0],height-pon[1]-h[1],h[0]*2,h[1]*2)

	for ( let i = 0 ; i < fe.length ; i ++){
		fill(0,255,0);
		circle(fe[i][0],height-fe[i][1],7); //200-y para q se dibuje apropiadamente
		textSize(8);
		text(fe[i][0]+','+fe[i][1],fe[i][0]+5,height-fe[i][1]); //200-y para q se dibuje apropiadamente
	}
}