'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */
// --------------- Dictionary for information-----------------------

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var location_info = {
    "foco" : {
        "Monday" :  ["7:30am-10:30am", "11:00am-3pm", "5pm-8:30pm"],
        "Tuesday" : ["7:30am-10:30am", "11:00am-3pm", "5pm-8:30pm"],
        "Wednesday": ["7:30am-10:30am", "11:00am-3pm", "5pm-8:30pm"],
        "Thursday" : ["7:30am-10:30am", "11:00am-3pm", "5pm-8:30pm"],
        "Friday" : ["7:30am-10:30am", "11:00am-3pm", "5pm-8:30pm"],
        "Saturday" : ["8am-10:30am", "11:00am-2:30pm", "5pm-8:30pm"],
        "Sunday" : ["8:00am-2:30pm", "5pm-8:30pm"],
    },
    "novack" : {
        "Monday" :  "7:30am-2:00am",
        "Tuesday" : "7:30am-2:00am",
        "Wednesday" : "7:30am-2:00am",
        "Thursday"  : "7:30am-2:00am",
        "Friday" : "7:30am-2:00am",
        "Saturday" : "1:00pm-2:00am",
        "Sunday" : "11:00am-2:00am",
    },
    "collis" : {
        "Monday" :  ["7:00am-8:00pm", "9:30pm-1:30am"],
        "Tuesday" : ["7:00am-8:00pm", "9:30pm-1:30am"],
        "Wednesday" : ["7:00am-8:00pm", "9:30pm-1:30am"],
        "Thursday"  : ["7:00am-8:00pm", "9:30pm-1:30am"],
        "Friday" : ["7:00am-8:00pm", "9:30pm-2:00am"],
        "Saturday" : "9:30pm-2:00am",
        "Sunday" : "9:30pm-1:30am",
    },
    "the hop" : {
        "Monday" :  "11:00am to midnight",
        "Tuesday" : "11:00am to midnight",
        "Wednesday" : "11:00am to midnight",
        "Thursday"  : "11:00am to midnight",
        "Friday" : "11:00am to midnight",
        "Saturday" : "10:30am to midnight",
        "Sunday" : "10:30am to midnight",
    }
};


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the Dartmouth Dining information skill. ' +
        'Please tell me where you would like information on.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please tell me where you want information on.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for using the Dartmouth Dining skill. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function getHoursForLocation(intent, session, callback){
    const repromptText = null;
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = 'Sorry you failed.';

    const place = intent.slots.location.value;

    if(place === "foco"){
      speechOutput = "The hours for foco are 4-6pm.";
    }

    var d = new Date();
    var numDay = d.getDay();
    var day = days[numDay];

    if(location_info[place] === null){
        speechOutput = "I'm sorry, I did not recognize that location. Which location would you like the hours for?";
    }

    if (place === "foco" || place === "collis") {
      speechOutput = place + " is open today from " + location_info[place][day][0];

      if (location_info[place][day].length === 2)
        speechOutput += " and from " + location_info[place][day][1];
      if (location_info[place][day].length === 3) {
        speechOutput += ", from " + location_info[place][day][1];
        speechOutput += ", and from " + location_info[place][day][2];
      }
    } else if (place === "the hop" || place === "novack"){
      speechOutput = intent.slots.location.value + " is open today from " + location_info[place][day];
    }
    else{
        speechOutput = "I am sorry, I did not understand please ask for either collis, foco, novack or the hop."
    }
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}
// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else if (intentName === 'GetHoursIntent'){
      getHoursForLocation(intent, session, callback);
    }
    else {
        const repromptText = null;
        const sessionAttributes = {};
        let shouldEndSession = false;
        let speechOutput = 'Sorry I did not understand that.';
        callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
