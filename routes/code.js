
exports.automata = function(req, res){
    res.render('automata', { title: 'Cellular Automata' })
};

exports.debug = function(req, res){
    res.render('debug', { title: 'Debug.js' })
};

exports.svg = function(req, res){
    res.render('svg', { title: 'SVG Playground' })
}

exports.planets = function(req, res){
    res.render('planets', { title: 'Planets' });
}

exports.playground = function(req, res) {
    res.render('playground');
}

exports.bold = function(req, res) {
    res.render('bold', { title: "Madison May"});
}