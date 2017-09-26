# Benji Hannam and Brian Keare

## Hack-a-thing-2 Alexa skill
The Alexa skill we have created is a simple skill that can tell you when different DDS Dining Locations are open. We built it through the Amazon Developer Portal online. We used the portal for much of the setup of the skill and implemented the smarts of the skill in JavaScript. We were able to test the skill in the provided testing platform online as well as on an Amazon Echo device.

We found that due to the complexity of computer speech, much of the response-building is hard-coded and various if-else statements to navigate to the correct response. Adding more Intents (question frameworks) would simply be a matter of doing more of this rule building for responses.

The one intent we have set up is one that essentially responds to the question, "What is the schedule for <location> today?". Location here is Collis, the Hop, Foco, Novack, and their common synonyms. There are multiple ways to ask this question which all had to be input as options to trigger the response.

Other Intents we would add to this skill would include "Is <location> open now?", "When does <location> close?", and "What are the <meal time> hours for <location>?" among others. Each question would require equivalent questions to be input, responses to be set up, and prompts for more information if not every required field is given at once.

The main area we struggled was in getting the skill to run on the device, though this was more a setup issue than a technical one. 
