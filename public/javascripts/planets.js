window.colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e",
              "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
              "#e67e22", "#e74c3c", "#95a5a6",
              "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];

window.planets = [];

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function template(tpl, o) {
    for(var key in o)
        {
            if(o.hasOwnProperty(key))// prevent iteration on any prototype inherited methods
                tpl = replaceAll('{'+key+'}',o[key], tpl);
        }
    return tpl;
}

var timeout;
window.G = Math.pow(10, -1);

function distance2(p1, p2) {
    return Math.pow(p1.attrs.cx - p2.attrs.cx, 2) + Math.pow(p1.attrs.cy - p2.attrs.cy, 2)
}

//- function direction(p1, p2) {
//-     return Math.atan()
//- }

$(document).mousedown(function(event){
    if (event.which === 1) {
        window.cursorX = event.clientX;
        window.cursorY = event.clientY;

        document.onmousemove = function(e){
            window.cursorX = e.pageX;
            window.cursorY = e.pageY;
        }

        window.planet = window.svg.circle(window.cursorX, window.cursorY, 5);
        window.planet.attrs.mass = Math.PI*Math.pow(window.planet.attrs.r, 2);
        window.planet.attrs.velocity_angle = Math.atan((window.planet.attrs.cy - window.cursorY)/
                                                 (window.planet.attrs.cx - window.cursorX));
        window.planet.attrs.velocity = Math.sqrt(Math.pow(window.planet.attrs.cx - window.cursorX, 2)
                                                 + Math.pow(window.planet.attrs.cy - window.cursorY, 2))*3;
        window.planet.attrs.vX = window.planet.attrs.velocity * Math.cos(window.planet.attrs.velocity_angle);
        window.planet.attrs.vY = window.planet.attrs.velocity * Math.sin(window.planet.attrs.velocity_angle);
        if (window.planet.attrs.cx > window.cursorX) {
            window.planet.attrs.vX = -window.planet.attrs.vX;
            window.planet.attrs.vY = -window.planet.attrs.vY;
        }
        window.planet.attrs.acceleration_angle = Math.atan((window.planet.attrs.cy - window.sun.attrs.cy)/
                                                     (window.planet.attrs.cx - window.sun.attrs.cx));
        window.planet.attrs.acceleration = window.sun.attrs.mass * window.G / distance2(window.planet, window.sun);
        window.planet.attrs.aX = window.planet.attrs.acceleration * Math.cos(window.planet.attrs.acceleration_angle);
        window.planet.attrs.aY = window.planet.attrs.acceleration * Math.sin(window.planet.attrs.acceleration_angle);
        if (window.planet.attrs.cx > window.sun.attrs.cx) {
            window.planet.attrs.aX = -window.planet.attrs.aX;
            window.planet.attrs.aY = -window.planet.attrs.aY;
        }
        var color = window.colors[Math.floor(Math.random() * window.colors.length)]
        planet.attr({fill: color, stroke: color, 'stroke-width': 0});
        timeout = setInterval(function(){
            increaseSize(window.planet);
        }, 50);

        return false;
    }
});

$(document).mouseup(function(event){
    if (event.which === 1) {
        window.planets.push(window.planet);
        window.planet = null;
        clearInterval(timeout);
        return false;
    }
});

function increaseSize(planet, px, py) {
    planet.animate({r: planet.attrs.r + 2}, 50);
    planet.attrs.mass = Math.PI*Math.pow(planet.attrs.r, 2);
    planet.attrs.velocity_angle = Math.atan((planet.attrs.cy - window.cursorY)/
                                             (planet.attrs.cx - window.cursorX));
    planet.attrs.velocity = Math.sqrt(Math.pow(planet.attrs.cx - window.cursorX, 2)
                                      + Math.pow(planet.attrs.cy - window.cursorY, 2))*3;
    planet.attrs.vX = planet.attrs.velocity * Math.cos(planet.attrs.velocity_angle);
    planet.attrs.vY = planet.attrs.velocity * Math.sin(planet.attrs.velocity_angle);
    if (planet.attrs.cx > window.cursorX) {
        planet.attrs.vX = -planet.attrs.vX;
        planet.attrs.vY = -planet.attrs.vY;
    }
    planet.attrs.acceleration_angle = Math.atan((planet.attrs.cy - window.sun.attrs.cy)/
                                                 (planet.attrs.cx - window.sun.attrs.cx));
    planet.attrs.acceleration = window.sun.attrs.mass * window.G / distance2(planet, window.sun);
    planet.attrs.aX = planet.attrs.acceleration * Math.cos(planet.attrs.acceleration_angle);
    planet.attrs.aY = planet.attrs.acceleration * Math.sin(planet.attrs.acceleration_angle);
    if (planet.attrs.cx > window.sun.attrs.cx) {
        planet.attrs.aX = -planet.attrs.aX;
        planet.attrs.aY = -planet.attrs.aY;
    }
}

function render() {
    window.svg = Raphael(0, 0, "100%", "100%");
    var w = $(window).innerWidth();
    var h = $(window).innerHeight();
    window.sun = window.svg.circle(w/2, h/2, 80);
    var color = "#f1c40f";
    window.sun.attr({fill: color, stroke: color, 'stroke-width': 0});
    window.sun.attrs.mass = Math.PI*Math.pow(window.sun.attrs.r, 2)*1000;
    window.sun.attrs.aX = 0;
    window.sun.attrs.aY = 0;
    window.sun.attrs.vX = 0;
    window.sun.attrs.vY = 0;
    window.sun.attrs.cx = w/2;
    window.sun.attrs.cy = h/2;
}

function iterate() {
    if (window.planets.length > 0) {
        for (var i=0; i<window.planets.length; i++) {
            if (!window.planets[i].attrs.vX) {
                window.planets[i].attrs.vX = 0;
            }
            if (!window.planets[i].attrs.vY) {
                window.planets[i].attrs.vY = 0;
            }
            if (!window.planets[i].attrs.aX) {
                window.planets[i].attrs.aX = 0;
            }
            if (!window.planets[i].attrs.aY) {
                window.planets[i].attrs.aY = 0;
            }

            if (distance2(window.planets[i], window.sun) < 6400) {
                window.planets[i].animate({cx: -9999}, 0);
                window.planets[i].animate({cy: -9999}, 0);
                window.planets.splice(i);
            }

            window.planets[i].attrs.acceleration = window.sun.attrs.mass * window.G / distance2(window.planets[i], window.sun);
            window.planets[i].attrs.acceleration_angle = Math.atan((window.planets[i].attrs.cy - window.sun.attrs.cy)/
                                                         (window.planets[i].attrs.cx - window.sun.attrs.cx));
            window.planets[i].attrs.aX = window.planets[i].attrs.acceleration
                                         * Math.cos(window.planets[i].attrs.acceleration_angle);
            window.planets[i].attrs.aY = window.planets[i].attrs.acceleration
                                         * Math.sin(window.planets[i].attrs.acceleration_angle);
            if (window.planets[i].attrs.cx > window.sun.attrs.cx) {
                window.planets[i].attrs.aX = -window.planets[i].attrs.aX;
                window.planets[i].attrs.aY = -window.planets[i].attrs.aY;
            }

            window.planets[i].attrs.vX = window.planets[i].attrs.vX + window.planets[i].attrs.aX;
            window.planets[i].attrs.vY = window.planets[i].attrs.vY + window.planets[i].attrs.aY;
            window.planets[i].animate({cx: window.planets[i].attrs.cx + window.planets[i].attrs.vX/120}, 100);
            window.planets[i].animate({cy: window.planets[i].attrs.cy + window.planets[i].attrs.vY/120}, 100);


            //move the sun as well
            window.sun.attrs.acceleration = window.planets[i].attrs.mass * window.G / distance2(window.planets[i], window.sun);
            window.sun.attrs.acceleration_angle = Math.atan((window.sun.attrs.cy - window.planets[i].attrs.cy)/
                                                         (window.sun.attrs.cx - window.planets[i].attrs.cx));
            window.sun.attrs.aX = window.sun.attrs.acceleration
                                         * Math.cos(window.sun.attrs.acceleration_angle);
            window.sun.attrs.aY = window.sun.attrs.acceleration
                                         * Math.sin(window.sun.attrs.acceleration_angle);
            console.log(window.sun.attrs.aX, window.sun.attrs.aY)
            if (window.sun.attrs.cx > window.planets[i].attrs.cx) {
                window.sun.attrs.aX = -window.sun.attrs.aX;
                window.sun.attrs.aY = -window.sun.attrs.aY;
            }

            window.sun.attrs.vX = window.sun.attrs.vX + window.sun.attrs.aX;
            window.sun.attrs.vY = window.sun.attrs.vY + window.sun.attrs.aY;
            console.log("aX: ", window.sun.attrs.aX);
            console.log("aY: ", window.sun.attrs.aY);
            console.log(window.sun.attrs.cx + window.sun.attrs.vX);
            console.log(window.sun.attrs.cy + window.sun.attrs.vY);
            window.sun.animate({cx: window.sun.attrs.cx+ window.sun.attrs.vX/120}, 100);
            window.sun.animate({cy: window.sun.attrs.cy + window.sun.attrs.vY/120}, 100);
        }
    }
}

$(document).ready(function() {
    render();
    setTimeout(function() {
        $('#temp').css({"opacity": "0", "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)",
                        "filter": "alpha(opacity=0)",  "-moz-opacity": "0", "-khtml-opacity": "0", "opacity": "0"});
    }, 3000);
    setInterval(function() {
        iterate();
    }, 100);
})