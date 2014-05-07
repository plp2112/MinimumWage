/**
 * @author
 */
console.log("hi there");
//minWageData is the local name of the json file I just loaded




var myKey = "&key=AIzaSyAdt8oYw20O7VJ3XLTWk5YfGHNqyP9s2Lo";
var myTable = "14KYY_4kLFV-k9pH-Fs9AXREk_6aYMaatMA3qtEvc";
var myQuery;

var myTableURL = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+*+FROM+"+myTable;

function dataLoaded(minWageData){
	
	console.log(minWageData);
	
	//When I add columns, the first parameter is the data type in that column
	//Second parameter is the name of the column
	var gDataTable = new google.visualization.DataTable();
	
	
	
	gDataTable.addColumn('string',"Date"); //only works b/c this is a google.visualization object
	gDataTable.addColumn('number', "Unadjusted for Inflation");
	gDataTable.addColumn('number', "Adjusted for Inflation");
	//gDataTable.addColumn({type:'string', role:'annotation'});
	
	gDataTable.addRows(minWageData.rows);
	
	console.log(gDataTable);
	
	//create options object to actually customize the look of the chart
	var chartOptions = {
		title: "Unemployment since 1948"
	};
	
	/*
	var myObsData = minWageData;
	//I am trying to construct an array of arrays
	var myDataArray = [];
	//console.log(myDataArray);
	//I need headers to be the first 
	var headerArray = ["Date", "Value"];
	myDataArray.push(headerArray);
	
	//specify starting point, ending point, 
	for(var i=0; i<myObsData.length;i++){
		//create reference to current object in list
		var currObj = myObsData[i];
		
		var currArray = [currObj.date, Number(currObj.value)];
		
		myDataArray.push(currArray);
		
	}//end of loop
	
	console.log(myDataArray);

//feed data to visualization library
var myDataTable = google.visualization.arrayToDataTable(myDataArray);

*/

//create options object to actually customize look of chart
var chartOptions = {
          title: "NY Minimum Wage Timeline", 
         fontName: "Times New Roman",
         fontSize: 18,
          colors: ["#EB36D3", "#43B1E0"],
          legend: {position: 'top'}
          
        };
        
        var formatter = new google.visualization.NumberFormat({prefix: "$", negativeColor: 'red', negativeParens: true});
  formatter.format(gDataTable, 1); // Apply formatter to second column
	formatter.format(gDataTable, 2);
	
var formatter1 = new google.visualization.DateFormat({pattern: "yyyy"});
formatter1.format(gDataTable, 0);

//tell it to create a line chart, and give it the
var mychart = new google.visualization.LineChart(document.getElementById("myChartDiv"));
	mychart.draw(gDataTable, chartOptions);
		
		
		}

function clickEvent(e){
	//e is my click event; i will use its target property to get the id of the div
	var ID = e.target.id;//e.g. "year_2000"
	console.log(ID);
	var NameArray = ID.split("_");//splits it into an array, "2000" will be second
	theYear = NameArray[1];//grab the year
	
	$.get(myTableURL+"'"+theYear+"-12-01'"+myKey, dataLoaded, "json");
	
	History.pushState({year:theYear}, "Unemployment from - "+theYear, "?year="+theYear);
	
	}

function googleLoaded(){
	
	console.log("googleLoaded")
	
	var URLinfo = History.getState().cleanUrl;
	var splitURL = URLinfo.split("?"); //split the URL on the quesion mark

	var defaultYr = "1990"
	if(splitURL.length >1){
		//get the query string, break it on equals and then take the right half, which contains the year
		defaultYr = splitURL[1].split("=")[1];
	}
	
	//console.log("google Loaded");
	
	//Instead of loading data from stat json file,
	//I'm going to load it from a Google FUsion Table
	
	//$(".btn-success").on("click", clickEvent);	
	
	//grab the button with the id that is year_"defaultYr"
	//$("#year_"+defaultYr).click();
	
	theYear = 1990;
	
	console.log(myTableURL+myKey);
	
	$.get(myTableURL+myKey, dataLoaded, "json");
	
	
}
function pageLoaded(){
	
	console.log("got to page loaded");
	
	//load the google visualization library
	google.load("visualization", "1", {packages:["corechart"], callback: googleLoaded});
}
$(document).ready(pageLoaded);
