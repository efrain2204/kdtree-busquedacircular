function order(queve){
	for (var i = 0; i < queve.length; i++) {
		for (var j = i+1; j < queve.length; j++) {
			if (queve[i][0]>queve[j][0]) {
				var temp=queve[i];
				queve[i]=queve[j];
				queve[j]=temp;
			}
		}
	}
}
//similador del bounbeb priotity queve
function colocar(queve,point,count){
	if (queve.length<count) {
		queve.push(point);
		queve.sort(function (a,b){
			return a[0]<b[0];
		});
	}
	else{
		for (var i = 0; i <queve.length; i++) {
			if (queve[i][0]>point[0]) {
				var temp=queve[i];
				queve[i]=point;
				point=temp;
			}
		}
	}
}
function Knearest(node,point,k) {
	var quever=[];
	k_point(node,point,quever,k);
	var indices=[];
	for (var i = 0;i<quever.length; i++) {
		indices.push(quever[i][1]);
	}
	return indices;
}
function k_point ( node , point , queve, k){
	if ( node === null )
		return;
	var axis = node.axis;
	var dist=distanceSquared(point,node.point);
	colocar(queve,[dist,node.point],k);
	var next_branch = null ; //next node brach to look for
	var opposite_branch = null ; //opposite node brach to look for
	if (point[axis]<node.point[axis]){
		next_branch=node.left;
		opposite_branch=node.right;
	} else {
		next_branch=node.right;
		opposite_branch=node.left;
	}
	k_point(next_branch,point,queve,k);
	if(queve.length<k|| queve[0][0]>Math.abs(point[axis]-node.point[axis])){
		k_point(opposite_branch,point,queve,k);
	}
}

