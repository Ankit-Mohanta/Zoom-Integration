const KJUR = require("jsrsasign");
const { zoom } = require("../../../Constants/zoom");

import axios from "axios";
const { stringify } = require("querystring");

export default function handler(req, res) {

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
