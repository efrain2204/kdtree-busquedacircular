k = 2;
class Node {
	constructor(point, axis) {
		this.point = point;
		this.left = null;
		this.right = null;
		this.axis = axis;
	}
}
function getHeight(node) {
	if (node == null)
		return 0;
	return max(1 + getHeight(node.left), 1 + getHeight(node.right))
}
function generate_dot(node) {
	if (node != null) {
		if (node.left != null) {
			console.log("\"" + node.point + "\"" + "->" + "\"" + node.left.point + "\"");
		}
		if (node.right != null) {
			console.log("\"" + node.point + "\"" + "->" + "\"" + node.right.point + "\"");
		}
		generate_dot(node.left);
		generate_dot(node.right);
	}
}
function build_kdtree(points, depth = 0) {
	var n = points.length;
	var axis = depth % k;

	if (n <= 0) {
		return null;
	}
	if (n == 1) {
		return new Node(points[0], axis)
	}
	var median = Math.floor(points.length / 2);

	points.sort(function (a, b) {
		return a[axis] - b[axis];
	});

	var left = points.slice(0, median);
	var right = points.slice(median + 1);

	var node = new Node(points[median].slice(0, k), axis);
	node.left = build_kdtree(left, depth + 1);
	node.right = build_kdtree(right, depth + 1);

	return node;
}

function distanceSquared(point1, point2) {
	var distance = 0;
	for (var i = 0; i < k; i++)
		distance += Math.pow((point1[i] - point2[i]), 2);
	return Math.sqrt(distance);
}
function closest_point_brute_force(points, point) {
	var PointCe = points[0];
	var DistanceMin = distanceSquared(points[0], point);
	for (var i = 1; i < points.length; i++) {
		var t = distanceSquared(points[i], point);
		if (DistanceMin > t) {
			PointCe = points[i];
			DistanceMin = t;
		}
	}
	return PointCe;
}
function naive_closest_point(node, point, depth = 0, best = null) {
	if (node != null) {
		var dis = distanceSquared(node.point, point);
		console.log(dis);
		if (best != null && distanceSquared(best, point) < dis) {
			return best;
		}
		else {
			if (node.point[node.axis] > point[node.axis]) {
				return naive_closest_point(node.left, point, depth + 1, node.point);
			}
			else {
				return naive_closest_point(node.right, point, depth + 1, node.point);
			}
		}
	}
	else {
		return best;
	}
	//algorithm
	//1. best = min(distance(point, node.point), best)
	//2. chose the branch according to axis per level
	//3. recursevely call by branch chosed
}
function closer_point(point, p1, p2) {
	if (p2 == null) {
		return p1;
	}
	var distance = distanceSquared(p1.point, point);
	if (distance < distanceSquared(p2.point, point))
		return p1;
	return p2;

}
function closest_point(node, point, depth = 0) {
	//algorithm
	//1. set "next_branch" and "opposite_branch" to look for according to axis and level
	//2. chose "best" distance between (node.point, next_branch, point)
	//3. If (distance(point, "best") > abs(point[axis] - node.point[axis])
	//4. chose "best" distance between (node.point, opposite_branch,point)
	//5. return best
	if (node === null)
		return null;
	var axis = depth % k;
	var next_branch = null; //next node brach to look for
	var opposite_branch = null; //opposite node brach to look for
	if (point[axis] < node.point[axis]) {
		next_branch = node.left;
		opposite_branch = node.right;
	} else {
		next_branch = node.right;
		opposite_branch = node.left;
	}
	var best = closer_point(point, node, closest_point(next_branch, point, depth + 1));
	if (distanceSquared(point, best.point) > Math.abs(point[axis] - node.point[axis])) {
		best = closer_point(point, best, closest_point(opposite_branch, point, depth + 1));
	}

	return best;
}

var p = 0;
function range_query_circle(node, center, radio, queue, depth = 0) {
	if (node == null) {
		return null;
	}
	p += 1;
	console.log(p);
	var axis = node.axis;
	var next_branch = null;
	var opposite_branch = null;
	if (center[axis] < node.point[axis]) {
		next_branch = node.left;
		opposite_branch = node.right;
	} else {
		next_branch = node.right;
		opposite_branch = node.left;
	}
	var best = closer_point(center, node, range_query_circle(next_branch, center, radio, queue, depth + 1));
	if (Math.abs(center[axis] - node.point[axis]) <= radio || distanceSquared(center, best.point) > Math.abs(center[axis] - node.point[axis])) {
		if (distanceSquared(center, node.point) <= radio) {
			queue.push(node.point);
		}
		best = closer_point(center, best, range_query_circle(opposite_branch, center, radio, queue, depth + 1));
	}

	return best;
}


function range_query_rect(node, center, hug, queue, depth = 0) {
	if (node == null) {
		return null;
	}
	p += 1;
	console.log(p);
	var axis = node.axis;
	var next_branch = null;
	var opposite_branch = null;
	if (center[axis] < node.point[axis]) {
		next_branch = node.left;
		opposite_branch = node.right;
	} else {
		next_branch = node.right;
		opposite_branch = node.left;
	}
	var best = closer_point(center, node, range_query_rect(next_branch, center, hug, queue, depth + 1));
	if (Math.abs(center[axis] - node.point[axis]) <= hug[axis] * 2 || distanceSquared(center, best.point) > Math.abs(center[axis] - node.point[axis])) {
		if (Math.abs(center[0] - node.point[0]) <= hug[0] && Math.abs(center[1] - node.point[1]) <= hug[1]) {
			queue.push(node.point);
		}
		best = closer_point(center, best, range_query_rect(opposite_branch, center, hug, queue, depth + 1));
	}

	return best;
}


function range_query_circle1(node, center, radio, queue, depth = 0) {
	if (node == null) {
		return null;
	}
	var a = distanceSquared(node.point, center);
	console.log([node.point, a]);
	if (a <= radio) {
		queue.push(node.point);
	}
	range_query_circle1(node.left, center, radio, queue);
	range_query_circle1(node.right, center, radio, queue);
}