const KJUR = require("jsrsasign");
const { zoom } = require("../../../Constants/zoom");

import axios from "axios";
const { stringify } = require("querystring");

export default function handler(req, res) {
  // const iat = Math.round(new Date().getTime()/1000)-30
  // const exp = iat+60*60*2

  // const Header = {
  //     // 'alg': 'HS256',
  //     alg: 'HS256',
  //     type: 'JWT'
  // }

  // const Payload = {
  //     sdkKey: zoom.sdk.key,
  //     mn: req.body.meetingNumber,
  //     role: req.body.role,
  //     iat: iat,
  //     exp: exp
  // }

  // const sHeader = JSON.stringify(Header)
  // const sPayload = JSON.stringify(Payload)

  // const meetingSignature = KJUR.KJUR.jws.JWS.sign("HS256",sHeader,sPayload,zoom.sdk.secret)

  // return res.json({
  //     signature: meetingSignature,
  //     sdkKey: zoom.sdk.key
  // })

  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: zoom.sdk.key,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: zoom.sdk.key,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    zoom.sdk.secret
  );

  res.json({
    signature: signature,
  });
}

// import axios from 'axios';
// const {zoom} = require("../../../Constants/zoom")

// export default async function handler(req, res) {
//   try {

//     const clientId = zoom.sdk.key
//     const clientSecret = zoom.sdk.secret

//     // Make a request to the Zoom OAuth token endpoint to exchange the authorization code for an access token
//     const { data } = await axios.post('https://zoom.us/oauth/token', {
//     grant_type: 'client_credentials',
//     client_id: clientId,
//     client_secret: clientSecret,
//   });

//     // Extract the access token from the response and return it as the API response
//     // const { access_token } = response.data;
//     res.status(200).json({ access_token: data.access_token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error generating access token');
//   }
// }

// export default async function handler(req, res) {
//   try {
//     const b = Buffer.from(
//       "ynS_ztczRiy0TWp9yrXdpw" + ":" + "7qy2As0wirnG8fFAo34NnST981twzsV4"
//     );
//     const code = JSON.parse(req.body.body);
//     console.log(code.code);

//     var data = stringify({
//         code: req.body.data,
//         grant_type: "authorization_code",
//         redirect_uri: "http://localhost:3000/Zoom",
//       });

//       const B = b.toString("base64");

//       var config = {
//         method: "POST",
//         url: "https://zoom.us/oauth/token",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: "Basic " + B,
//         },
//         data: data,
//       };
//       axios(config).then((res)=>{
//         console.log("res")
//       }).catch((err)=>{
//         console.log("error")
//       })

// const zoomRes = await axios
//   .post(
//     `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code.code}&redirect_uri=http://localhost:3000/Zoom`,
//     {
//       headers: {
//         Authorization: `Basic ${b.toString("base64")}`,
//       },
//     }
//   )
//   .then((res) => {
//     console.log("res");
//   })
//   .catch((err) => {
//     console.error("err");
//   });

// if (!zoomRes.ok) return res.status(401).send("Could not connect with Zoom");

// const zoomData = await zoomRes.json();
// if (zoomData.error)
//   return res.status(401).send("Could not connect with Zoom");
// // Retreive user details
// const zoomUserRes = await axios.post(
//   "https://api.zoom.us/v2/users/me",

//   {
//     headers: {
//       Authorization: `Bearer ${zoomData.access_token}`,
//     },
//   }
// );

// const zoomUserData = await zoomUserRes.json();
// console.log(zoomUserData);

/*
Encrypt and store below details to your database:
zoomUserData.email
zoomUserData.account_id
zoomData.access_token
zoomData.refresh_token
zoomData.expires_in // convert it to time by adding these seconds to current time
*/

//     return res.json({
//       d: "Done",
//     });
//   } catch (error) {
//     return res.status(500).json("Something went wrong");
//   }
// }
