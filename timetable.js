
var classes = document.getElementsByClassName("altbdr");

for (var i = 0; i < classes.length; i++) {
    // POSSIBLE SEEDS
    // let name = classes[i].getElementsByTagName('b')[0].innerText;  // course code (e.g. COMP SCI 2005) 
    let name = classes[i].getElementsByTagName('span')[0].innerText.split('\n')[1];  // class name (e.g. Music Technology Foundations)
    /*  let thingo = classes[i].getElementsByTagName('span')[0].innerText.split('\n')[2];
    let name = thingo.substring(thingo.length - 6, thingo.length - 1);  // class number (e.g. 12604) */

    var random_num = new Math.seedrandom(name);
    hue = Math.floor(random_num.quick() * 360);
    colour = `hsl(${hue.toString()}, 100%, 80%)`;

    classes[i].style.backgroundColor = colour;
}
