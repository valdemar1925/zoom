import React from 'react';

import './App.css';
import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.7.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

function App() {

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  var signatureEndpoint = 'https://backend.intensivkontakt-staging.de/api/v1/meetings/'
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  var sdkKey = 'f9yfxQmctOADmf4b9yz9ajiXUyPlxDhycVQP'
  var role = 1
  var leaveUrl = 'http://localhost:3000'
  var userName = 'React'
  var userEmail = ''
  var passWord = ''
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/webinars#join-registered
  var registrantToken = ''

  function getSignature(e) {
    e.preventDefault();

    fetch(signatureEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY2NDU4NjA5LCJpYXQiOjE2NjM4NjY2MDksImp0aSI6IjMxZWUwN2Y4NDAwZTRhOTNiNzQ2ZTE2OThhYmZkNzU2IiwidXNlcl9pZCI6MjMxLCJpc3MiOiJJSyIsInN1YiI6InZvbG9keW15ci5zYWJsdWtAaW50ZW5zaXZrb250YWt0LmRlIiwiYXVkIjoiSUsiLCJzY29wZSI6WyJNT0RFUkFUT1JTIiwiRURJVE9SUyIsIlNVUEVSVVNFUiJdfQ.H0IhIKnP6QfhdktbbozngorC_rEh6wvOf3weVeFxWyw' },
      body: JSON.stringify({
        patient_id: "103",
        timer_will_elapse: "2022-09-23T15:37:36.993048Z"
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.credentials.signature, response.credentials.meeting_number)
    }).catch(error => {
      console.error(error)
    })
  }

  function startMeeting(signature, meeting_number) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success)
        console.log(signature)
        console.log(meeting_number)
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meeting_number,
          userName: userName,
          sdkKey: sdkKey,
          userEmail: userEmail,
          passWord: passWord,
          tk: registrantToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
