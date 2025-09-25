let clock = document.getElementById("clock");
let timer = {value: 0, running: false};
let pomodoro = {value: 0, count: 0, action: "rest", running: false}
let quote = document.getElementById("quote");
let settings = document.getElementById("settings")
let pomoquotes = {
    rest: ["Grab yourself a coffee", "Enjoy this short break"],
    work: ["Time to be productive", "The rest has ended, time to work"],
    lrest: ["An extra-long rest for an extra-productive person", "Taking a long rest once in a while is good", "Enjoy this LOOOONG rest, you've earned it!"]
}
let pomnames = {
    rest: "Short break",
    work: "Working",
    lrest: "Long break"
}
let resources = [];
let options = {
    clock_font: 'JetBrains Mono',
    clock_size: '10rem',
    quote_font: 'JetBrains Mono',
    quote_size: '2rem',
    display_quote: true,
    clock_format: 'hh:mm:ss',
    pom_work: '1500',
    pom_sb: '300',
    pom_count: '4',
    pom_lb: '900',
    color_black: '#1C1C1C',
    color_white: '#F5F5DC',
    ui_font: 'JetBrains Mono',
}
function add_css(link){
    if(!resources.includes(link)){
    	document.head.insertAdjacentHTML(
    		'beforeend',
    		'<link rel="stylesheet" href="' + link + '" />');
    	resources.push(link)
    }
}
function setup(){
    //import options
    //clock_font
    add_css("https://fonts.googleapis.com/css2?family="+options.clock_font.replaceAll("  ","+"))
    clock.style.setProperty("font-family",options.clock_font)
    
    //quote_font
    add_css("https://fonts.googleapis.com/css2?family="+options.quote_font.replaceAll("  ","+"))
    quote.style.setProperty("font-family",options.quote_font)
    
    //ui_font
    add_css("https://fonts.googleapis.com/css2?family="+options.quote_font.replaceAll("  ","+"))
    document.body.style.setProperty("--ui-font",options.ui_font)
    
    //display_quote
    if(!options.display_quote){
        quote.classList.add("disabled");
    }else{
    	quote.classList.remove("disabled");
    }
    
    
    //clock_size
    clock.style.setProperty("font-size",options.clock_size)
    
    //quote_size
    quote.style.setProperty("font-size",options.quote_size)
   
    //colors
    document.body.style.setProperty("--raw-black", options.color_black)
    document.body.style.setProperty("--raw-white", options.color_white)
}
function load(){
    //load options
    for(let l in options){
        options[l] = localStorage.getItem(l) || options[l];
        if(options[l] == "true" || options[l] == "false"){
            options[l] = (options[l] == "true");
        }
	}
    setup()
}
window.onload = load;

let mode;
let mode_i;
let modes = ["clock","pom","timer"]
function set_mode(m){
    mode = m;
    //ui
    document.getElementsByClassName("active")[0].classList.remove("active");
    document.getElementById("mode_" + m).classList.add("active");
    let i = modes.indexOf(m);
    let x = document.getElementById("mode_clock").clientWidth * i;
    document.getElementById("modes").style.setProperty("--after-x",x+"px")
    document.getElementById("modes").style.setProperty("--after-i",i)
    let br = "0 0 0 0";
    if(i == 0){
        br = "2rem 0 0 2rem";
    }
    else if(i == modes.length-1){
        br = "0 2rem 2rem 0";
    }
    document.getElementById("modes").style.setProperty("--after-br",br)
    
    //mode functions
    let controls = Array.from(document.getElementsByClassName("controls"));
    for(let c in controls){
        controls[c].classList.add("disabled");
    }
    clearInterval(mode_i)
	if(mode == "clock"){
        clock_tick()
        mode_i = setInterval(clock_tick, 100)
    }
    else if(mode == "timer"){
        timer_tick()
        mode_i = setInterval(timer_tick, 1000)
        document.getElementById("timer-controls").classList.remove("disabled");
    }
    else if(mode == "pom"){
        pomodoro.count = 0;
        pom_tick()
        mode_i = setInterval(pom_tick, 1000)
        document.getElementById("pom-controls").classList.remove("disabled");
    }
}

Date.prototype.format = function(format) {
	let date = this;
  const map = {
    dd: String(date.getDate()).padStart(2, "0"),
    d: date.getDate(),
    MM: String(date.getMonth() + 1).padStart(2, "0"),
    M: date.getMonth() + 1,
    yyyy: date.getFullYear(),
    yy: String(date.getFullYear()).slice(-2),
    hh: String(date.getHours()).padStart(2, "0"),
    h: date.getHours(),
    mm: String(date.getMinutes()).padStart(2, "0"),
    m: date.getMinutes(),
    ss: String(date.getSeconds()).padStart(2, "0"),
    s: date.getSeconds()
  };

  return format.replace(/dd|d|MM|M|yyyy|yy|hh|h|mm|m|ss|s/g, match => map[match]);
}

function clock_tick(){
    d = new Date(Date.now());
    clock.innerHTML = d.format(options.clock_format);
}

function timer_tick(){
    if(timer.running == true){
        timer.value += 1;
    }
    let hour = Math.floor(timer.value / 3600);
    let minute = Math.floor((timer.value - hour * 3600) / 60);
    let seconds = timer.value - (hour * 3600 + minute * 60);

    // Pad with leading zeros if necessary
    hour = String(hour).padStart(2, '0');
    minute = String(minute).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    
    clock.innerHTML = `${hour}:${minute}:${seconds}`;
}

function pom_tick(){
    if(pomodoro.running == true){
        if(pomodoro.value == 0){
            pomodoro.count += 1;
            if(pomodoro.action == "rest" || pomodoro.action == "lrest"){
                pomodoro.action = "work";
                pomodoro.value = parseInt(options.pom_work);
            }
            else{
                if(pomodoro.count / 2 == parseInt(options.pom_count)){
                    pomodoro.action = "lrest";
                    pomodoro.value = parseInt(options.pom_lb);
                }
                else{
                    pomodoro.action = "rest";
                    pomodoro.value = parseInt(options.pom_sb);
                }
            }
            //render action
    		let qs = pomoquotes[pomodoro.action];
    		quote.innerHTML = qs[Math.floor(Math.random() * qs.length)];
    		document.getElementById("pom-sessions").innerHTML = pomodoro.count;
    		document.getElementById("pom-current").innerHTML = pomnames[pomodoro.action];
        }
        pomodoro.value -= 1;
    }
    
    // render
    let hour = Math.floor(pomodoro.value / 3600);
    let minute = Math.floor((pomodoro.value - hour * 3600) / 60);
    let seconds = pomodoro.value - (hour * 3600 + minute * 60);
    // Pad with leading zeros if necessary
    hour = String(hour).padStart(2, '0');
    minute = String(minute).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    clock.innerHTML = `${hour}:${minute}:${seconds}`;
}

set_mode("clock")

function open_settings(){
    document.body.classList.toggle("settings")
    update_settings();
}

function update_settings(){
    let inps = Array.from(document.getElementsByTagName("input"));
    for(let i in inps){
        let val = options[inps[i].id];
        if(val == "true" || val == "false" || typeof val == "boolean"){
            inps[i].checked = typeof val == "boolean" ? val : (val == "true");
        }
        else{
        	inps[i].value = options[inps[i].id];
        }
    }
}

settings.onchange = function(e){
    let val = e.target.value;
    if(e.target.type == "checkbox"){
        val = e.target.checked;
    }
    options[e.target.id] = val;
    localStorage.setItem(e.target.id, val);
    setup()
}
