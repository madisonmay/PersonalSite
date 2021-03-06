
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , code = require('./routes/code.js');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', code.bold);
app.get('/automata', code.automata);
app.get('/debug', code.debug);
app.get('/svg', code.svg);
app.get('/planets', code.planets);
app.get('/playground', code.playground);
app.get('/bold', routes.index);
app.get('/:id', function(req, res) {
  res.render(req.params.id + ".jade");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
