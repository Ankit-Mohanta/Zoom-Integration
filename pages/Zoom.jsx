import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import MeetingStyles from '../styles/Zoom.module.css'
import { useRouter } from 'next/router'
import {zoom} from '../Constants/zoom'
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

const Zoom = () => {

    const router = useRouter();

    useEffect(()=>{

        return async ()=>{
            new Promise(async (resolve,reject)=>{

                const ZoomEmbed = await (await import('@zoomus/websdk/embedded')).default

                resolve(ZoomEmbed.createClient())
    
            }).then(async (client)=>{

                const payload = router.query

                let meetingSDKElement = document.getElementById("meetingSDKElement")

                client.init({
                    language:'en-US',
                    zoomAppRoot: meetingSDKElement
                })

                const data = await axios.post('api/zoom/',{
                    // data: payload
                }).then(response=>{
                    console.log(typeof(response))
                    console.log("response")
                }).catch(error=>{
                    console.error("-- error occurs in axios -->",error)
                })

                client.join({
                    meetingNumber: payload.meetingNumber,
                    signature: data.signature,
                    sdkKey: zoom.sdk.key,
                    userName: payload.userName,
                    password:payload.password,
                    tk:''
                })

            }).catch(error =>{
                console.error("-- error occurs in useEffect --> ",error)
            })
        }

    },[])

    // how to create the access token from zoom api??

    // useEffect(()=>{
    //     let zoomClient
    //     (async () => {
    //         try {
    //             const ZoomEmbed = await (await import('@zoomus/websdk/embedded')).default
    //             zoomClient = ZoomEmbed.createClient()
    //             // do something with the client object
    //         } catch(error) {
    //             console.error("-- error occurs in useEffect --> ",error)
    //         }
    //     })()
    
    //     return () => {
    //         if (zoomClient) {
    //             zoomClient.destroy()
    //         }
    //     }
    // },[])

    // useEffect(()=>{
    //     if(router.query.code){
    //         axios.post('/api/zoom',{
    //             headers:{
    //                 'Content-Type':'application/json',
    //             },
    //             body: JSON.stringify({code: router.query.code})
    //         }).then(()=>{

    //         }).catch((error)=>{
    //             console.error(error)
    //         })
    //     }

    // },[router.query.code])

    function getSignature(e) {
        e.preventDefault();
    
        fetch('/api/zoom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetingNumber: 81629434086,
            role: 0
          })
        }).then(res => res.json())
        .then(response => {
            console.log(response.signature)
          startMeeting(response.signature)
        console.log(response)
        }).catch(error => {
        //   console.error(error)
          console.error("error")
        })
      }

      const client = ZoomMtgEmbedded.createClient();

      
      // This sample app has been updated to use Meeting SDK credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
      var sdkKey = zoom.sdk.key
      var meetingNumber = 1000
      var passWord = 'EaL2Y9'
      var role = 0
      var userName = 'ANKIT MOHANTA'
      var userEmail = 'ankitmohanta080@gmail.com'
      // pass in the registrant's token if your meeting or webinar requires registration. More info here:
      // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/meetings#join-registered
      // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/webinars#join-registered
      var registrantToken = ''
      var zakToken = ''

      function startMeeting(signature) {

        let meetingSDKElement = document.getElementById('meetingSDKElement');
    
        client.init({
          debug: true,
          zoomAppRoot: meetingSDKElement,
          language: 'en-US',
          customize: {
            meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
            toolbar: {
              buttons: [
                {
                  text: 'Custom Button',
                  className: 'CustomButton',
                  onClick: () => {
                    console.log('custom button');
                  }
                }
              ]
            }
          }
        });
    
        client.join({
          signature: signature,
            sdkKey: sdkKey,
            meetingNumber: 81629434086,
            password: passWord,
            userName: userName,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken
        })
      }
    

  return (
    <div className={MeetingStyles.container}>
        <div id="meetingSDKElement" className={MeetingStyles.meetingSDKElement}></div>
        <div className={MeetingStyles.content} onClick={getSignature}>Content</div>
        {/* <a href={`https://zoom.us/oauth/authorize?

response_type=code&client_id=ynS_ztczRiy0TWp9yrXdpw&redirect_uri=http://localhost:3000/Zoom`}>
Connect Zoom
</a>  */}
    </div>
  )
}

export default Zoom