
function init()
{
	var network_menu = document.getElementById("changeNetwork");
	network_menu.addEventListener("change",change);
	
	var search_button = document.getElementById("search");
	search_button.addEventListener("click",traverseNetwork);
}

var NETWORK = new Array ();

var PATHS = null;

function Node(i,n,l) { //node construct
   this.id = i
   this.name  = n ;
   this.links = l ;
}

function Link(n,w) {
	this.node = n;
	this.weight = w;
	console.log(this);
}

function getNode(name) {
	for (var i=0;i<NETWORK.length;i++) {
		if (name==NETWORK[i].name){
			return NETWORK[i];
		}	
	}
}

function getLinks(name) {
	var node =  getNode(name);
	return node.links
}

function getNextLinkIndex(obj) {
	return obj.links.length;
}

function getLinkLength(obj) {
	node = obj
	return getNextLinkIndex (node)
}

function addNode(name){
	var Links = new Array ();
	var nextIndex = NETWORK.length;
	var n = new Node(nextIndex, name ,Links);
 	NETWORK[nextIndex] = n;
	  console.log(n);
 	return n;
}

function addLink(node1,node2,weight) {  //create links between nodes
	var linkIndex1 = getNextLinkIndex(node1);
	var linkIndex2 = getNextLinkIndex(node2);
	var link = new Link(node2,weight)
	var linkback = new Link(node1,weight)
	node1.links[linkIndex1] = link;
	node2.links[linkIndex2] = linkback;
}

function nodeExplored(name,path) {
	if (path.search(name)==-1)
		return true;
	else
		return false;
}

function getLink (node1,node2) {
	for (var i in node1.links) {
		if (node2.id == node1.links[i].node.id) return node1.links[i];
	}
}

function getWeight (node1,node2) {
	return getLink(node1,node2).weight;
}


function calculateWeightings(path){
	var nodes = path.split(" ");
	var weighting = 0;
	for (var i = 0, j =1;j<nodes.length; i++, j++){
		weighting = weighting + getWeight(getNode(nodes[i]),getNode(nodes[j]));
	}
	return Math.round(weighting*100)/100;
}


function createNetwork () {
	
	NETWORK.length = 0;
	
	var nodeA = addNode("A");
	var nodeB = addNode("B");
	var nodeC = addNode("C");
	var nodeD = addNode("D");
	var nodeE = addNode("E");
	var nodeF = addNode("F");
	var nodeG = addNode("G");


	addLink(nodeA,nodeB,8);
	addLink(nodeA,nodeC,7);
	addLink(nodeB,nodeC,4);
	addLink(nodeB,nodeE,2);
	addLink(nodeB,nodeF,9);
	addLink(nodeC,nodeD,10);
	addLink(nodeD,nodeE,5);
	addLink(nodeF,nodeG,1);
}


function createNetwork2 () { //create Network2

	NETWORK.length = 0;      //clear NETWORK array
	
	var nodeA = addNode("A");
	var nodeB = addNode("B");
	var nodeC = addNode("C");
	var nodeD = addNode("D");
	var nodeE = addNode("E");
	var nodeF = addNode("F");
	var nodeG = addNode("G");
	var nodeH = addNode("H");


	addLink(nodeA,nodeB,1);
	addLink(nodeA,nodeE,2);
	addLink(nodeB,nodeC,2);
	addLink(nodeB,nodeD,1);
	addLink(nodeC,nodeD,4);
	addLink(nodeC,nodeG,2);
	addLink(nodeD,nodeF,6);
	addLink(nodeE,nodeF,4);
	addLink(nodeF,nodeG,7);
	addLink(nodeG,nodeH,3);
}


function findPaths(s,t,nol,path,side,trace) {
	

	if (nol == 0) { // all links for node explored no path found
		if (trace) 
			document.write("all links for " + s.name + " explored<br>");
			return;
	}
	else {
		if (s.id == t.id) { // goal achieved routing path to target found
			var weighting = calculateWeightings(path);
			if (PATHS == null)
				PATHS =  path + ";" +  weighting;
			else
				PATHS = PATHS  + ":" + path  + ";" +  weighting;
				
	return PATHS;
			if (trace) document.write ("<p align=left>target and source match path=" + path + " weighting=" + weighting + "</p>");
		}
		else {
			if ((getLinkLength(s)==1) & (side!="root")){ 	// no match blind alley
				if (trace) document.write("end node found for " + s.name + " back track <br>");
				return;
			}
			else {
				linkedNode = s.links[nol-1].node;
				if (!nodeExplored (linkedNode.name, path)) { 	// node exists path already explored
					if (trace) document.write("existing path for " + linkedNode.name + "<br>");
						findPaths(s ,t,nol-1,path,"rhs",trace)
					}
				else { // an unexplored path
					if (trace) document.write("unexplored path for " + linkedNode.name + "<br>");
						findPaths(linkedNode,t,getLinkLength(linkedNode),path + " " + linkedNode.name ,"lhs",trace)
					findPaths(s ,t,nol-1,path,"rhs",trace)
				}
			}
		}
	}
}

function traverseNetwork (){
	
	var source = document.getElementById("nodeS");
	var target = document.getElementById("nodeD");
	var trace = false;
	
	if (source.length == 1 && target.length == 1){ //validate if one of networks were selected
		alert("Please choose network to search your routes");
	}
	else if (source.selectedIndex == 0 || target.selectedIndex == 0){ //validate if start node and end node were selected
		var table = document.getElementById('table');
		table.innerHTML =  "";
		alert("You have to select start and end node!");
		source.focus();
	}
	else if (source.value == target.value){
		var table = document.getElementById('table');
		table.innerHTML =  "";
		alert("Both the start and the end node is " + source.value + "\nYou don't need to search for routes!");
	}
	else {
		var sourceObj  = getNode(source.value);
		var targetObj  = getNode(target.value);
		var nodeLinks  = getLinkLength(sourceObj);
		var path 	   = sourceObj.name+"";
		PATHS = null;
		findPaths(sourceObj,targetObj,nodeLinks,path,"root",trace);
		
		displayTable(source); // call function to display TABLE with all possible routes
	}
}	

// MY JAVASCRIPT CODE IS BELLOW ------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var numbers = new Array(); // array for storing weightings of possible routes

function displayTable(o){	// display table with header and all possible routes 

	var output = PATHS;	
	var newOutput = getNewOutput(output); // assign edited PATHS
	var routes = newOutput.split(":");	// create array of routes of particular nodes
	
	var table = document.getElementById('table');
	table.innerHTML =  showRoutes(routes);              // table of routes of particular nodes is -->
	                                                   //displayed on the page where element's id = "table" 
		
}

function getNewOutput(o){ // create new PATHS output without spaces

	var newOutput = "";
	
	for(var i = 0; i < o.length; ++i){ // loop trough the string 
		if (o.charAt(i) == " "){ // if string contains white space, this space is removed
			i = i + 1;
			newOutput = newOutput + o.charAt(i);
		}
		else{
			newOutput = newOutput + o.charAt(i);
		}
	}	
	return newOutput;	// return new string without white spaces
}

function showRoutes(routes){ // display routes in the table
	
	var table = "";
	var aim = "";
	var total = "";
	
	getRoutesWeigthing(routes); // call function that will create a global array of weightings
	
	for(var index = 0; index < routes.length; ++index){ // loop through the array of routes of particular nodes
	
		var routesOutput = routes[index]; // coresponding route from the array of routes -->
		                                  //according to the loop counter is assigned to the local variable
		var split = routesOutput.split(""); // create array of characters of the route 
		aim = "";
		
		for(var i = 0; i < split.length; ++i){ //loop through the particular route
		
			var character = split[i]; //character on each index
			var nextCharacter = split[i + 1]; //character on next index
			var nnCharacter = split[i + 2]; // character on the next index
			var number = split[i + 2]; //next index after semicolom in array 
			var number2 = split[i + 3];
			checkNumber = numbers[index];//assign value from the weightning's array to variable checkNumber
			
			if ( i == 0 ){ //if index is equal to zero
				if (checkNumber == shortestRoute(numbers)){ //condition where the shortestRoute function is called, if equality is true -->
					aim = aim + "<th bgcolor = '#BCED91'>Route " + ((i + 1) + index) + "</th>"; //when index is equal to zero, first column in row is created and -->
																								//if shortest number background color is change
				}
				else {
					aim = aim + "<th>Route " + ((i + 1) + index) + "</th>"; // if no shortest number background color is not changed
				}	
			}
			if (checkNumber == shortestRoute(numbers)){ //if shortest number is eual
				if ( nextCharacter == ";" ){ //if next character is equak to semicolomn -->
					for(var c = i; c < numbOfNodes(routes) - 1; ++c){ //loop is trigerred and function that returns the highest number of nodes from possible routes is called
						total = total + "<td bgcolor = '#BCED91'>-</td>";//add empty columns
					}					
						if (number2 == undefined){	//if second index in the array after semicolom is undefined
							number2 = ""; // "" is assigned to this index for further concatenation
						}
						if ( number2 == "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9"){ // if second index is equal to any of these numbers
							aim = aim + total + "<td bgcolor = '#BCED91'>" + character //if shortest number and number on second index after semicolom,-->
							+ "</td><td bgcolor = '#BCED91'>" + number + number2 + "</td>";	//add columns with character and concatenated number-weighting
							i = i + 3; //increment counter
						}
						else {	
							aim = aim + total +"<td bgcolor = '#BCED91'>" + character //if shortest number and no number on second index after semicolom, -->
							+ "</td><td bgcolor = '#BCED91'>" + number + "</td>"; //add columns with characters and number-weighting with changed background color
							i = i + 2;//increment counter
						}	
					total = ""; //clear total that added empty columns in previous loop
				}	
				else {
					aim = aim + "<td bgcolor = '#BCED91'>" + character + "</td>"; //if shortest number but next character is not semicolom -->
																					//add colomn with character and changed background color
				}
			}
			else{ // if no shortest number all the above but no changed background color
			
				if ( nextCharacter == ";" ){
					for(var c = i; c < numbOfNodes(routes) - 1; ++c){
						total = total + "<td>-</td>";
					}					
						if (number2 == undefined){
							number2 = "";
						}
						if ( number2 == "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9"){
							aim = aim + total + "<td>" + character + "</td><td>" + number + number2 + "</td>";
							i = i + 3;
						}
						else{	
							aim = aim + total +"<td>" + character + "</td><td>" + number + "</td>";
							i = i + 2;
						}	
					total = "";
				}	
				else{
					aim = aim + "<td>" + character + "</td>";
				}
			
			}	
					
		}
		table = table + "<tr>" + aim + "</tr>"; //add row with columns in the table
	}	
	var resultTable = "<table border = '1'  class = 'hilite'>"  
	+ tHead(routes) + table + "</table>";
	return resultTable; // return table
}

function getRoutesWeigthing(routes){ // determine weightings for each possible route
	
	if (numbers.length !== 0 ){ //if dynamic array that stores weightings is no empty-->
		numbers.length = 0; //empty array
	}
	
	for(var index = 0; index < routes.length; ++index){ //loop through the array of routes of particular nodes
		var routesOutput = routes[index]; // coresponding route from the array of routes according to the loop counter is assigned to the local variable
		var split = routesOutput.split(""); // create array of characters of the route  
		for(var i = 0; i < split.length; ++i){ //loop through characters 
			var character = split[i];
			if ( character == ";" ){ //if character is semicolom				
				var number = split[i + 1]; //next index after semicolom
				var number2 = split[i + 2]; //then the next index
				if ( number2 == "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9"){ //if second index after semicolom is any of these numbers
					var wholeNumber = number + number2; //concatenate characters on first and second index after semicolom
					var numb1 = parseInt(wholeNumber); //concatenated characters convert to integer
					numbers[index] = numb1;	// add number into array
					i = i + 2; //increment counter
				}
				else{ // if no character on second index after semicolom -->
					var numb2 = parseInt(number); //convert character to integer
					numbers[index] = numb2; //add number into array
					i = i + 1; //increment counter
				}	
			}	
		}
	}	
}

function shortestRoute(numbers){ // determine the shortest route from all possible routes

	var temp; 
	var final;
	
	for(var i = 0; i < numbers.length; ++i){ //loop through the array of numbers-weightings
		var check = numbers.length;
		if (check == 1){ 
			final = numbers[i];
			return final;
		}
		if (i == 0){
			temp = Math.min(numbers[i]); 
		}
		else if ( i == numbers.length ){
			final = Math.min(temp, numbers[i]);
		}
		else{
			final = Math.min(temp, numbers[i]);
			temp = final;
		}
	}
	return final;	// returns the shortest route
}

function numbOfNodes(routes){ // determine number of nodes in the route

	var output = "";
	var temp, final;
	var check = routes.length;
	
	for(var index = 0; index < routes.length ; ++index){
		var route = routes[index];
		output = "";
		for(var i = 0; i < route.length; ++i ){ //loop throught the individual route 
			var characters = route.split("");
			var letter = characters[i];
			switch (letter){ //if any of bellow letters are equal to a particulat character create new output
				case "A":
					output = output + letter;
					break;
				case "B":
					output = output + letter;
					break;
				case "C":
					output = output + letter;
					break;
				case "D":
					output = output + letter;
					break;
				case "E":
					output = output + letter;
					break;
				case "F":
					output = output + letter;
					break;
				case "G":
					output = output + letter;
					break;
				case "H":
					output = output + letter;
					break;		
			}	
		}
		if (check == 1){
			final = output.length;
			return final;
		}
		else if (index == 0){
			temp = output.length; //the temporary highest number of nodes in route
		}
		else{
			var o = output.length;	
			final = Math.max(temp, o);	//determine the highest number of nodes in route
			temp = final;	//temporary highest number
		}
	}	
	return final; // returns number with the highest number of nodes
}

function tHead(routes){ // create header based on the highest number of nodes in the route

	var header = "";
	var leng = numbOfNodes(routes);
	
	for(var i = 0; i < numbOfNodes(routes) + 2; ++i){ 
		if (i == 0){
			header = "<tr><th style = 'background-color: #3063A5; color: #F9FFFF'>Route Number</th>";
		}
		else if ( i == 1 ){
			header = header + "<th style = 'background-color: #3063A5; color: #F9FFFF'>Start Node</th>";
		}
		else if ( i == leng ){
			header = header + "<th style = 'background-color: #3063A5; color: #F9FFFF'>End Node</th>";
		}
		else if ( i == leng + 1){
			header = header + "<th style = 'background-color: #3063A5; color: #F9FFFF'>Weighting</th></tr>";
		}
		else{
			header = header + "<th style = 'background-color: #3063A5; color: #F9FFFF'>Node " + i + "</th>"
		}
	}
	return header; // returns header
}

var Network1 = new Array("A","B","C","D","E","F","G");      //array of nodes - NETWORK1
var Network2 = new Array("A","B","C","D","E","F","G","H"); //array of nodes - NETWORK2
			
function change(){ //set options in dropdown menus
	
	var opt = this.value;
	
	if(opt == "Network1"){ //set options in dropdown menus for Network1 if it is selected
		createNetwork();  //call the function that will create network
		document.getElementById('nodeS').options.length = 1; //clear options from dropdown menu 
		document.getElementById('nodeD').options.length = 1; //clear options from dropdown menu
		var table = document.getElementById('table'); 
		table.innerHTML = ""; //clear the any previous output
		var img = document.getElementById('image'); 
		img.innerHTML = "<img src = 'network1.gif' alt = 'image of network1' height='120' width = '170'>"; //display image(nodes of network) to the corresponding network
		for(var i = 0; i < Network1.length; ++i){ 
			addS(Network1[i],Network1[i]); //call function that sets options for first dropdown menu 
			addD(Network1[i],Network1[i]); //call function that sets options for second dropdown menu 
		}
	}
	else if (opt == "Network2"){ //the same as above but sets Network2 if it is selected
		createNetwork2();
		document.getElementById('nodeS').options.length = 1;
		document.getElementById('nodeD').options.length = 1;
		var table = document.getElementById('table');
		table.innerHTML = "";
		var img = document.getElementById('image');
		img.innerHTML = "<img src = 'network2.gif' alt = 'image of network2' height='120' width = '170'>";
		for(var i = 0; i < Network2.length; ++i){
			addS(Network2[i]);
			addD(Network2[i]);
		}
	}
	else{ //otherwise clear outputs(table, image) and options from dropdown menus 
		document.getElementById('nodeS').options.length = 1;
		document.getElementById('nodeD').options.length = 1;
		var table = document.getElementById('table');
		table.innerHTML = "";
		var img = document.getElementById('image');
		img.innerHTML = "";
	}
}

function addS(value){ //function that adds options to dropdown menu
	var opt = document.createElement('option');
	opt.value = value;
	opt.text = "Node " + value;
	document.getElementById('nodeS').options.add(opt);
}

function addD(value){ //function that adds options to dropdown menu
	var opt = document.createElement('option');
	opt.value = value;
	opt.text = "Node " + value;
	document.getElementById('nodeD').options.add(opt);
}
