const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const openlaw = require('openlaw');
const APIClient = openlaw.APIClient;
const OpenLaw = openlaw.OpenLaw;

const request = require('superagent');
let agent = request.agent();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//REVIEW update these variables to test code below
const privateInstanceUrl = 'https://privateInstanceUrl.openlaw.io';
const privateInstanceUserName = 'username@toquity.io';
const privateInstancePassword = 'password';

let apiClient = new APIClient(privateInstanceUrl);
let OLApiClient = new APIClient('https://app.openlaw.io');
let apiClient2 = new APIClient({
  root: privateInstanceUrl,
  auth: {
    username: privateInstanceUserName,
    password: privateInstancePassword
  }
});

//tried with param: Advisor%20Agreement
app.get('/openlaw/:templateName', (req, res) => {
  console.log(req.params.templateName);
  OLApiClient.getTemplate(req.params.templateName).then(doc => {
    console.log(doc);
    res.send(doc);
  }).catch(err => console.log(err));
});

app.get('/',(req, res) => {
  apiClient.login(privateInstanceUserName, 'password').then(loginDetails => {
    console.log(apiClient);
    console.log(loginDetails);
    const templateDetails = apiClient.getTemplate('Advisor%20Agreement');
    res.send(templateDetails);
  }).catch(err => console.log(err));
});

app.get('/a',(req, res) => {
  console.log(apiClient2);
  apiClient2.login().then(loginRes=>{
    console.log(loginRes);
    apiClient2.getTemplate('Advisor%20Agreement').then(templateDetails => {
      console.log(templateDetails);
      res.send(templateDetails);
    }).catch(err => console.log(err));
  }).catch(err=>console.log(err));
});

app.get('/template', (req, res) => {
  request
  .post(privateInstanceUrl+"/app/login")
  .set('Content-Type', 'application/json;charset=utf-8')
  .send({
    username: privateInstanceUserName,
    password: privateInstancePassword
  })
  .end((err, response) => {
    if(err) return res.send(err);
    agent._saveCookies(response);
    let reqwithCookie = request.get(privateInstanceUrl+'/template/raw/Advisor%20Agreement')
    agent._attachCookies(reqwithCookie);
    reqwithCookie.end((err, getRes) => {
      if(err) return res.send(err);
      console.log(getRes.body);
    });
  });
});

app.listen(process.env.PORT || 3000, _ => console.log(`Listening on port ${process.env.PORT || 3000}`));
