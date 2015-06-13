/**
 * Created by Vivek Chitale
 * Purpose: 'Coding problem Airport Baggage - Pathfinding'
 * Date: 11-June-15
 * Time: 5:25 PM
 *
 */

/*
* Global variable declaration
*/
var _conveyorSelections = {};
var _departures = {};
var _bags = {};
var _gateTimeSeries = [];
var _startGate;
var _endGate;
var _startNodes = [];

/*
 * TODO: Data can be fetched from database, like (MongoDB)
 * TODO: If JQuery is allowed, we can use AJAX request (GET) to get this data
   * using server (we can use Node.js to respond to this request
 */

/*
*   Data container
*/
_conveyorSelections = {
    "conveyorSelection1":["Concourse_A_Ticketing", "A5", 5],
    "conveyorSelection2" : ["A5","BaggageClaim", 5],
    "conveyorSelection3":["A5", "A10", 4],
    "conveyorSelection4":["A5", "A1", 6],
    "conveyorSelection5":["A1", "A2", 1],
    "conveyorSelection6":["A2", "A3", 1],
    "conveyorSelection7":["A3", "A4", 1],
    "conveyorSelection8":["A10", "A9", 1],
    "conveyorSelection9":["A9", "A8", 1],
    "conveyorSelection10":["A8", "A7", 1],
    "conveyorSelection11":["A7", "A6", 1]
};

_departures = {
    "departure1" : ["UA10", "A1", "MIA", "08:00"],
    "departure2" : ["UA11", "A1", "LAX","09:00"],
    "departure3" : ["UA12", "A1", "JFK","09:45"],
    "departure4" : ["UA13", "A2", "JFK","08:30"],
    "departure5" : ["UA14", "A2", "JFK","09:45"],
    "departure6" : ["UA15", "A2", "JFK","10:00"],
    "departure7" : ["UA16", "A3", "JFK","09:00"],
    "departure8" : ["UA17", "A4", "MHT","09:15"],
    "departure9" : ["UA18", "A5", "LAX","10:15"]
};

function analyzePath(bagId)
{
    switch(bagId)
    {
        case 1:
            _bags = {};
            _bags = {"bag1" : ["0001", "Concourse_A_Ticketing", "UA12"]};
            displayResult();
            break;
        case 2:
            _bags = {};
            _bags = {"bag2" : ["0002", "A5", "UA17"]};
            displayResult();
            break;
        case 3:
            _bags = {};
            _bags = {"bag3" : ["0003", "A2", "UA10"]};
            displayResult();
            break;
        case 5:
            _bags = {};
            _bags = {"bag5" : ["0005", "A7", "ARRIVAL"]};
            displayResult();
            break;
    }
}

/*
* Return all possible connected gates for given date
* @param {String}: gate for which we want to find connected gates
* */
function getConnectedGates(startGate)
{
    var connectedGateAndTime = [];

    for(var conveyorSelectionsKey in _conveyorSelections)
    {
        var gate1 = _conveyorSelections[conveyorSelectionsKey][0];
        var gate2 = _conveyorSelections[conveyorSelectionsKey][1];

        if(startGate === gate1)
        {
            connectedGateAndTime.push(gate2);
        }
        if(startGate === gate2)
        {
            connectedGateAndTime.push(gate1);
        }
    }
    return connectedGateAndTime;
}

/*
 * Display the optimized route for each bag
 * <Bag_Number> <point_1> <point_2> [<point_3>, …] : <total_travel_time>
 *
 **/
function displayResult()
{
    for(var bagKey in _bags)
    {
        var bagNumber = _bags[bagKey][0];
        var bagGate = _bags[bagKey][1];
        var bagFlight = _bags[bagKey][2];
        var iterate = true;
        _startGate = "";
        _endGate = "";
        _gateTimeSeries = [];
        _startNodes = [];



        for(var departureKey in _departures)
        {
            var departureFlight = _departures[departureKey][0];
            var departureGate = _departures[departureKey][1];
            _startGate = "";
            _endGate = "";
            _gateTimeSeries = [];
            _startNodes = [];

            // if departure flight and bag coming from flight are same
            if( (bagFlight === departureFlight) || (bagFlight === "ARRIVAL" && iterate === true) )
            {
                _startGate = bagGate;
                if(bagFlight === "ARRIVAL")
                {
                    _endGate = "BaggageClaim";
                    iterate = false;
                }
                else
                {
                    _endGate = departureGate;
                }

                if(analyzeData(bagGate))
                {
                    var totalTime = 0;
                    var pathName = "";
                    var gotIT = [];
                    var displayPath = [];
                    var path = [];

                    var j = _startNodes.length;
                    while(j--)
                    {
                        if(j === (_startNodes.length - 1))
                        {
                            gotIT = getConnectedGates(_startNodes[j]);
                            //displayPath = Object.keys(gotIT);
                            if(_startNodes[j] !== _endGate)
                            {
                                displayPath.push(_startNodes[j]);
                            }
                        }

                        for(var i =0; i<gotIT.length; i++)
                        {
                            if(gotIT[i] === _startNodes[j])
                            {
                                gotIT = getConnectedGates(_startNodes[j]);
                                if(_startNodes[j] !== _endGate)
                                {
                                    displayPath.push(_startNodes[j]);
                                }
                            }
                        }
                    }

                    var timeTrack = [];
                    timeTrack.push(_startGate);

                    var k = displayPath.length;
                    while(k--)
                    {
                        pathName = pathName + " " + displayPath[k];
                        timeTrack.push(displayPath[k]);
                    }

                    timeTrack.push(_endGate);

                    for(var timeKey =0 ; timeKey < timeTrack.length; timeKey++)
                    {
                        if(timeKey === 0)
                        {
                            totalTime = totalTime + getTimeForNodes(timeTrack[timeKey], timeTrack[timeKey + 1]);
                        }
                        else if(timeKey === (timeTrack.length - 1))
                        {
                            totalTime = totalTime + getTimeForNodes(timeTrack[timeKey], timeTrack[timeKey+1]);
                        }
                        else
                        {
                            totalTime = totalTime + getTimeForNodes(timeTrack[timeKey], timeTrack[timeKey+1]);
                        }
                    }
                    //console.log(bagNumber + " " + _startGate + "  " + pathName + "  " + _endGate + ": " + totalTime);
                    document.getElementById("displayResult").innerHTML = bagNumber + " " + _startGate + "  " + pathName + "  " + _endGate + ": " + totalTime;
                }
            }
        }
    }
}

/*
* Get the time it takes to move from one gate to another
* @param {String} Gates to find time in between
* */
function getTimeForNodes(firstNode, secondNode)
{
    var time = 0;

    for(var conveyorSelectionsKey in _conveyorSelections)
    {
        if( ((_conveyorSelections[conveyorSelectionsKey][0])=== firstNode) && ((_conveyorSelections[conveyorSelectionsKey][1])=== secondNode) )
        {
            time = _conveyorSelections[conveyorSelectionsKey][2];
        }
        else if(((_conveyorSelections[conveyorSelectionsKey][1])=== firstNode) && ((_conveyorSelections[conveyorSelectionsKey][0])=== secondNode))
        {
            time = _conveyorSelections[conveyorSelectionsKey][2];
        }
    }
    return time;
}

/*
* Cleanup the container by removing not possible gates
* */
function cleanUp()
{
    for(var i = 0; i < _startNodes.length; i++)
    {
        if(_startNodes[i] !== _startGate)
        {
            for(var j = i + 1; j < _gateTimeSeries.length; j++)
            {
                if( (_gateTimeSeries[j] !== _startGate) && (_gateTimeSeries[j] !== _endGate) && (_gateTimeSeries[j] !== _startNodes[i]) )
                {
                    _gateTimeSeries.splice(j, 1);
                    j--;
                }
            }
        }
    }
}

/*
* Add unique gates
* */
function addElements(gateTimeSeries)
{
    gateTimeSeries.forEach(function(i)
    {
        _gateTimeSeries.push(i);
    });
    removeDuplicate(_gateTimeSeries);
}

/*
* Remove given element from container
* @param {String}
* */
function removeElement(element)
{
    var i = _gateTimeSeries.length;
    while(i--)
    {
        if(_gateTimeSeries[i] === element)
        {
            _gateTimeSeries.splice(i, 1);
        }
    }
}

/*
* Remove duplicate elements
* @param {Array}
* */
function removeDuplicate(givenArray)
{
    for(var i = 0; i < givenArray.length; i++)
    {
        for(var j = i + 1; j < givenArray.length; j++)
        {
            if (givenArray[i] === givenArray[j])
            {
                givenArray.splice(j, 1);
                j--;
            }
        }
    }
}

/*
* Start Finding the connecting gates recursively
 * @param {String} Start gate
* */
function analyzeData(startGate)
{
    var gateTimeSeries;
    var result = false;
    if(startGate !== _startGate)
    {
        _startNodes.push(startGate);
        removeDuplicate(_startNodes);
        _gateTimeSeries.push(startGate);
    }

    gateTimeSeries = getConnectedGates(startGate);
    addElements(gateTimeSeries);

    gateTimeSeries.forEach(function(i)
    {
        if(i === _endGate)
        {
            result = true;
            cleanUp();
        }
        else if(i === _startGate)
        {
            removeElement(i);
        }
    });
    if(!result)
    {
        removeElement(startGate);
        _gateTimeSeries.forEach(function(i)
        {
            result = analyzeData(i);
        });
    }
    return result;
}
