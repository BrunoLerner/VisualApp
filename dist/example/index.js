function getRandomColor(){for(var t="0123456789ABCDEF",a="#",e=0;6>e;e++)a+=t[Math.floor(16*Math.random())];return a}var margin={top:20,right:30,bottom:40,left:30},width=950-margin.left-margin.right,height=500-margin.top-margin.bottom,x=d3.scale.linear().range([0,width]),y=d3.scale.ordinal().rangeRoundBands([0,height],.1),xAxis=d3.svg.axis().scale(x).orient("bottom"),yAxis=d3.svg.axis().scale(y).orient("left").tickSize(0).tickPadding(6),colorKeysAlreadyUsed=new Map,svg=d3.select("body").append("svg").attr("width",width+margin.left+margin.right).attr("height",height+margin.top+margin.bottom).append("g").attr("transform","translate("+margin.left+","+margin.top+")");d3.json("data/candidates_task.json",function(t){document.getElementById("property").innerHTML=t.anomalousProperty.key+" : "+t.anomalousProperty.value,x.domain(d3.extent(t.significantVariables,function(t){return t.relativeChange})).nice(),y.domain(t.significantVariables.map(function(t){var a=t.key+":"+t.value;return a})),svg.selectAll(".bar").data(t.significantVariables).enter().append("rect").attr("fill",function(t){if(colorKeysAlreadyUsed.has(t.key))return colorKeysAlreadyUsed.get(t.key);var a=getRandomColor();return colorKeysAlreadyUsed.set(t.key,a),a}).attr("x",function(t){return x(Math.min(0,t.relativeChange))}).attr("y",function(t){var a=t.key+":"+t.value;return y(a)}).attr("width",function(t){return Math.abs(x(t.relativeChange)-x(0))}).attr("height",y.rangeBand()),svg.append("g").attr("class","x axis").attr("transform","translate(0,"+height+")").call(xAxis),svg.append("g").attr("class","y axis").attr("transform","translate("+x(0)+",0)").call(yAxis);svg.append("g").attr("font-family","sans-serif").attr("font-size",10).attr("text-anchor","end").selectAll("g").data(colorKeysAlreadyUsed).enter().append("g")});