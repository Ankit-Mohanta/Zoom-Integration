
import axios from "axios";
import qs from "querystring";

export default async function handler(req, res) {
  const CLIENT_ID = "ynS_ztczRiy0TWp9yrXdpw";
  const CLIENT_SECRET = "7qy2As0wirnG8fFAo34NnST981twzsV4";
  const REDIRECT_URI = "http://localhost:3000/Zoom";
  const AUTH_CODE = req.body.code;
  const apiUrl = "https://api.zoom.us/v2/users/me/meetings";

  const url = "https://zoom.us/oauth/token";
  const params = {
    grant_type: "authorization_code",
    code: AUTH_CODE,
    redirect_uri: REDIRECT_URI,
  };
  const headers = {
    Authorization: `Basic ${Buffer.from(
      `${CLIENT_ID}:${CLIENT_SECRET}`
    ).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  try {
    const response = await axios.post(url, qs.stringify(params), { headers })
      .then(async(respo) => {
        // console.log(respo.data);
        try {
            const response = await axios.post(apiUrl, {
              topic: 'Test Meeting',
              type: 2,
              start_time: '2023-05-01T12:00:00Z',
              duration: 60,
              timezone: 'UTC',
              settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: false,
                watermark: true,
                approval_type: 0,
                audio: 'both',
                auto_recording: 'none',
                enforce_login: false,
                waiting_room: false,
              },
            }, {
              headers: {
                'Authorization': `Bearer ${respo.data.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        
            // console.log(response.data);
            res.status(201).json({ response: response.data });
          } catch (error) {
            // console.error(error);
            res.status(500).json({ response: "Not done" });
          }
        
      });

    // const { access_token } = response.data;
    // console.log(`Access Token: ${access_token}`);
    // res.status(201).json({ response: "Done" });
  } catch (error) {
    console.log("Inside catch block");
    // console.error(error);
    // res.status(500).json({ error: "Internal server error with catch" });
  }
}
