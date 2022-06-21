# smartcatfountain
A program which uses a webcam and tensorflow to determine if a cat is in frame and turns on their watering fountain

# high level
## file structure
`app.js` -- node.js backend which defines some endpoints and serves the html and javascript. Needed because the tp-link-tapo-connect

`public` -- code ran on the client side of the application (`index.js`, `styles.css`, and `index.html`)

## app concept
The node.js app registers a few endpoints:
- `/toggle` (optional query param "on" or "off")
  turns on/off the fountain
- `/status`
  returns the on or off status of the fountain
- `/`
  serves the html
  
# the plan
Ultimately I would like to extend the logic of this app a bit further. If a Human is seen for example, it could greet the human :D Human could also maybe do some gestures to request particular information... If the human danced, the program could play music? The possibilities are endless!
