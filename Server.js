// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS Header
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Test default route
app.get('/', function(req, res) {
  res.send('<h1>9 Nine Code Challenge Test</h1>');
});

// Main route handler for JSON POST requests
app.post('/', function(req, res, next) {

  try {
    // Use .reduce to construct a new array with only objects from input array
    // which match the criteria, and consisting of only the three specified
    // properties from the matching objects
    const filtered = req.body.payload.reduce((accum, show) => {
      if (show.drm && show.episodeCount > 0) {
        accum.push({image: show.image.showImage, slug: show.slug, title: show.title})
      }
      return accum;
    }, []);

    console.log('response', filtered);
    res.json({response: filtered});
  } catch (err) {

    // Gracefully handle any low-level errors caused due to payload missing or being of
    // wrong type, by passing control onto next handler (which is the error handler)
    console.log('ERROR:', err.message);
    next(err);
  }
});

// This route catches errors thrown by bodyParser or by the array-processing route above
app.use(function(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({"error": "Could not decode request: JSON parsing failed."})
  } else if (!req.body || !req.body.payload || !Array.isArray(req.body.payload)) {
    res.status(400).json({error: "Invalid JSON structure: 'payload' missing or not array."});
  } else {
    res.status(400).json({error: err.message}); // return specific error message
@@ -50,6 +57,6 @@ app.use(function(err, req, res, next) {
});

// Start server
app.listen(port, function() {
  console.log('Server is running on http://localhost:' + port);
});
