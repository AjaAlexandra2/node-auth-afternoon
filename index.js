const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { secret } = require('./config');
const request = require('request');
const strategy = require('./strategy');

const app = express();

//middleware
app.use( session({
  secret,
  resave: false,
  saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  const { _json } = user;
  done(null, _json)
})

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

//endpoints
app.get('/login', passport.authenticate('auth0', {
  successRedirect: '/followers',
  failureRedirect: '/login',
  failureFlash: true,
  connection: 'github'
  })
);


app.get('/followers', (req,res,next) => {
  // return res.send(req.user)
  // console.log("req.session.user: ", JSON.parse(req.user));
  let FollowersRequest
  if(req.user){
    FollowersRequest ={
      url: req.user.followers_url,
      headers: {
        'User-Agent': req.user.clientID
      }
    };
    request(FollowersRequest, (error, response, body) => {
      res.status(200).send(body);
    });
  }
  else {
    res.redirect('/login');
  }
});




const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`);
});
