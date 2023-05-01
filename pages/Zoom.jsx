import React from "react";
import axios from "axios";
import { useEffect } from "react";
import MeetingStyles from "../styles/Zoom.module.css";
import { useRouter } from "next/router";
import { zoom } from "../Constants/zoom";
import { useState } from "react";
import qs from "querystring";
const cors = require("cors");

const Zoom = () => {
  const [signature, setSignature] = useState();
  const router = useRouter();

  useEffect(() => {
    return async () => {
      new Promise(async (resolve, reject) => {
        const ZoomEmbed = await (
          await import("@zoomus/websdk/embedded")
        ).default;

        resolve(ZoomEmbed.createClient());
      })
        .then(async (client) => {
          const payload = router.query;

          let meetingSDKElement = document.getElementById("meetingSDKElement");

          client.init({
            language: "en-US",
            zoomAppRoot: meetingSDKElement,
            customize:{
                video:{
                    viewSizes:{
                        default:{
                            width:'100vw',
                            height:'100vh'
                        },
                        ribbon:{
                            width:400
                        }
                    }
                },
                chat:{
                    poper:{
                        placement:'right'
                    }
                }
            }
          });

          const data = await axios
            .post("api/zoom/", {
              // data: payload
            })
            .then((response) => {
              //   console.log(typeof response);
              //   console.log("response");
            })
            .catch((error) => {
              console.error("-- error occurs in axios -->", error);
            });

          client.join({
            meetingNumber: payload.meetingNumber,
            signature: data.signature,
            sdkKey: zoom.sdk.key,
            userName: payload.userName,
            password: payload.password,
            tk: "",
          });
        })
        .catch((error) => {
          console.error("-- error occurs in useEffect --> ", error);
        });
    };
  }, []);

  useEffect(() => {
    return async () => {
      new Promise(async (resolve, reject) => {
        const ZoomEmbed = await (
          await import("@zoomus/websdk/embedded")
        ).default;

        resolve(ZoomEmbed.createClient());
      })
        .then(async (client) => {
          var sdkKey = zoom.sdk.key;
          var meetingNumber = meetingNumber;
          var passWord = "";
          var role = 0;
          var userName = "ANKIT MOHANTA";
          var userEmail = "ankitmohanta080@gmail.com";
          var registrantToken = "";
          var zakToken = "";

          startMeeting(
            signature,
            sdkKey,
            meetingNumber,
            passWord,
            role,
            userName,
            userEmail,
            registrantToken,
            zakToken,
            client
          );
        })
        .catch((error) => {
          console.error("-- error occurs in useEffect --> ", error);
        });
    };
  }, [signature]);

  function getSignature(e) {
    e.preventDefault();

    fetch("/api/zoom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: 81629434086,
        role: 0,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.signature);
        setSignature(response.signature);
        //   startMeeting(response.signature)
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
        console.error("error");
      });
  }

  function startMeeting(
    signature,
    sdkKey,
    meetingNumber,
    passWord,
    role,
    userName,
    userEmail,
    registrantToken,
    zakToken,
    client
  ) {
    let meetingSDKElement = document.getElementById("meetingSDKElement");

    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: "en-US",
      customize: {
        meetingInfo: [
          "topic",
          "host",
          "mn",
          "pwd",
          "telPwd",
          "invite",
          "participant",
          "dc",
          "enctype",
        ],
        toolbar: {
          buttons: [
            {
              text: "Custom Button",
              className: "CustomButton",
              onClick: () => {
                console.log("custom button");
              },
            },
          ],
        },
        video:{
            viewSizes:{
                default:{
                    width:'100vw',
                    height:'100vh'
                },
                ribbon:{
                    width:400
                }
            }
        },
        chat:{
            poper:{
                placement:'right'
            }
        }
      },
    });

    client.join({
      signature: signature,
      sdkKey: sdkKey,
      meetingNumber: meetingNumber,
      password: passWord,
      role: role,
      userName: userName,
      userEmail: userEmail,
      tk: registrantToken,
      zak: zakToken,
    });
  }

  //   const CLIENT_ID = "ynS_ztczRiy0TWp9yrXdpw";
  //   const CLIENT_SECRET = "7qy2As0wirnG8fFAo34NnST981twzsV4";
  //   const REDIRECT_URI = "http://localhost:3000/Zoom";
  //   const AUTH_CODE = router.query.code;

  //   const getToken = async () => {
  //     const url = 'https://zoom.us/oauth/token';
  //     const params = {
  //       grant_type: 'authorization_code',
  //       code: AUTH_CODE,
  //       redirect_uri: REDIRECT_URI,
  //     };
  //     const headers = {
  //       "Authorization": `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     };
  //     try {
  //       const response = await axios.post(url, qs.stringify(params),  headers );
  //       const { access_token } = response.data;
  //       console.log(`Access Token: ${access_token}`);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  useEffect(() => {
    if (router.query.code) {
      axios
        .post("/api/zoom/accToken", {
          code: router.query.code,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [router.query.code]);

  return (
    <div className={MeetingStyles.container}>
      <div
        id="meetingSDKElement"
        className={MeetingStyles.meetingSDKElement}
      ></div>
      <div className={MeetingStyles.content} onClick={getSignature}>
        Join a meeting
      </div>
      <a
        href={`https://zoom.us/oauth/authorize?response_type=code&client_id=ynS_ztczRiy0TWp9yrXdpw&redirect_uri=http://localhost:3000/Zoom`}
      >
        Create a meeting
      </a>
    </div>
  );
};

export default Zoom;
