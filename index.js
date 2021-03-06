const express = require('express')
const bodyparser = require('body-parser')
const jwt=require('jsonwebtoken')



const contactEndpointHandler = require('./contacts/index')
const {authEndpointHandler}=require('./auth/index')
const userEndPointHandler=require('./users/index')
const userContactEndPointHandler=require('./users-contacts/index')


const {AuthAdaptRequest} = require('./helpers/adapt-request')
const {VerifyToken}=require('./helpers/token')




const app = express()
app.use(bodyparser.json())



app.get('/contacts/:id',VerifyToken(ContactController,jwt))
app.all('/contacts',VerifyToken(ContactController,jwt))





app.post('/users/register',UserController)
app.all('/users',UserController)


app.post('/auth/login',AuthController)
app.get('/auth/getme',VerifyToken(AuthController,jwt))
app.delete('/auth/logout',AuthController)

app.all('/auth',AuthController)


app.get('/usercontacts/:contactId',VerifyToken(UserContactController,jwt))
app.all('/usercontacts',VerifyToken(UserContactController,jwt))




function ContactController(req, res) {
    const httpRequest = AuthAdaptRequest(req)
    contactEndpointHandler(httpRequest).then(({headers,statusCode,data}) => {
        res.set(headers).status(statusCode).send(data)       
    }).catch(e =>res.status(500).json({
        message:e.message
    }).end())
}

function UserController(req, res) {
    const httpRequest = AuthAdaptRequest(req)
    userEndPointHandler(httpRequest).then(({
        headers,
        statusCode,
        data
    }) => {
        res
            .set(headers)
            .status(statusCode)
            .send(data)
    }).catch(e => res.status(e.statusCode||500).json({
        message:e.message
    }).end())
}

function UserContactController(req, res) {
    const httpRequest = AuthAdaptRequest(req)
    userContactEndPointHandler(httpRequest).then(({
        headers,
        statusCode,
        data
    }) => {
        res
            .set(headers)
            .status(statusCode)
            .send(data)
    }).catch(e => res.status(e.statusCode||500).json({
        message:e.message
    }).end())
}

function AuthController(req, res) {
    const httpRequest = AuthAdaptRequest(req)
    authEndpointHandler(httpRequest).then(({
        headers,
        statusCode,
        name,
        options,
        value,
        data,
    }) => {
        res
            .set(headers)
            .status(statusCode)
            .cookie(name,value,options)
            .send(data)
    }).catch(e => res.status(e.statusCode||500).json({
        message:e.message
    }).end())
}





app.listen(9090, () => console.log("9090 listen"))