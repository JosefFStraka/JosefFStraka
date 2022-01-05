let input_ip;
let output_ip;
let output_ip_binary;
let output_mask;
let output_mask_binary;
let output_masked;
let output_masked_binary;
let output_size;

let table;

let input_subnet_ip;
let subnet_li;
let but_subnet_add;
let input_subnet_size;

let ip_subnet_list = [];
let ip_subnet_last_ip = 0;

let subnet_planner_svg;

let re = /(?:(?<ip0>25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.)(?:(?<ip1>25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.)(?:(?<ip2>25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.)(?<ip3>25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])(?:\/(?<range>3[0-2]|[0-2]?[0-9]))/gm;


document.addEventListener("DOMContentLoaded", () => {
    (() => {
        input_ip = document.getElementById("input_ip");
        output_ip = document.getElementById("out_ip");
        output_ip_binary = document.getElementById("out_ip_bin");
        output_mask = document.getElementById("out_mask");
        output_mask_binary = document.getElementById("out_mask_bin");
        output_masked = document.getElementById("out_masked");
        output_masked_binary = document.getElementById("out_masked_bin");
        output_size = document.getElementById("out_size");
        table = document.getElementById("ip_table");
    
        input_subnet_ip = document.getElementById("input_subnet_ip");
        subnet_li = document.getElementById("subnet_li");
        but_subnet_add = document.getElementById("but_subnet_add");
        input_subnet_size = document.getElementById("input_subnet_size");

        subnet_planner_svg = document.getElementById("subnet_planner_svg");
    })();

    let params = new URLSearchParams(window.location.search);
    if (params.has("ip")) {
        input_ip.value = params.get("ip");
    }

    let func0 = () => { 
        if (input_ip.checkValidity()) {
            update_ip_data();
            table.classList.remove("hidden");
            
            //add value to searchparams
            let params = new URLSearchParams(window.location.search);
            params.set("ip", input_ip.value);
            window.history.replaceState({}, "", "?" + params.toString());
        } else {
            table.classList.add("hidden");
        }
    };
    let func = () => {
        let ip_str = input_ip.value;
        let str = ip_str.split("/");
        input_ip.value = shorten_ip(str[0].split(".")).join(".") + "/" + str[1];

        func0();
    }

    func();

    input_ip.addEventListener("input", func0);
    input_ip.addEventListener("change", func);
    but_subnet_add.addEventListener("click", () => {
        if (ip_subnet_last_ip == 0) {
            let ip_str = input_subnet_ip.value;
            ip_str = shorten_ip(ip_str.split(".")).join(".");
            ip_subnet_last_ip = ip_str;
        }
        if (input_subnet_size.checkValidity()) {
            let size = parseInt(input_subnet_size.value);
            if (size == NaN) {
                console.log("Subnet size: NaN");
                return;
            }
            size += 2; //0 and broadcast
            let range = Math.ceil(Math.log2(size));

            console.log("Last ip " + ip_subnet_last_ip, "Subnet size: " + size, "Range: " + range);

            if (range > 32) {
                input_subnet_size.setValidity({'rangeOverflow':true});
            }
            if (range < 0) {
                input_subnet_size.setValidity({'rangeUnderflow':true});
            }

            ip_subnet_list.push({ip:ip_subnet_last_ip, range:range});
            let new_ip_num = ip_to_number(ip_subnet_last_ip) + Math.pow(2,range);
            let new_ip = number_to_ip(new_ip_num-1);
            
            let td;
            let tr = document.createElement("tr");
            td = document.createElement("td");
            td.innerHTML = ip_subnet_last_ip;
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = new_ip;
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = number_to_ip(4294967296 - Math.pow(2,range));
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = 32-range;
            tr.appendChild(td);

            subnet_li.appendChild(tr);

            ip_subnet_last_ip = number_to_ip(new_ip_num);
        }
    });

    let number = 0;
    subnet_planner_svg.addEventListener("mouseover", (e) => {
        if (number % 2 == 0) {
            let x = e.target.clientHeight;
        }
        e.clientX;
    });

    let art_div_colaps = document.querySelectorAll("article>div.collapse");
    console.log(art_div_colaps);
    art_div_colaps.forEach((div) => {
        
        div.parentNode.querySelector("h2").addEventListener("click", () => {
            div.classList.toggle("collapsed");
        });
    });
});

//convert ip from binary to decimal
function ip_to_decimal(ip) {
    let ip_array = ip.split(".");
    return ip_array.map((val, i) => {
        return parseInt(val, 2);
    }).join(".");
}

//convert ip from decimal to binary
function ip_to_binary(ip) {
    let ip_array = ip.split(".");
    return ip_array.map((val, i) => {
        let bin = parseInt(val).toString(2);
        while (bin.length < 8) {
            bin = "0" + bin;
        }
        return bin;
    }).join(".");
}

//mask an ip
function mask_ip(ip, mask) {
    let ip_array = ip.split(".");
    let mask_array = mask.split(".");
    return ip_array.map((val, i) => {
        return (parseInt(val) & parseInt(mask_array[i])).toString();
    }).join(".");
}

function update_ip_data() {
    let str = input_ip.value;
    let result = re.exec(str);
    if (result == null) {
        return;
    }

    let ip = result.groups.ip0 + "." + result.groups.ip1 + "." + result.groups.ip2 + "." + result.groups.ip3;
    let range = result.groups.range;

    output_ip.textContent = ip;
    output_ip_binary.textContent = ip_to_binary(ip);

    let mask_bin = "";
    for (let index = 0; index < range; index++) {
        mask_bin += "1";
    }
    for (let index = 0; index < 32 - range; index++) {
        mask_bin += "0";
    }

    for (let index = 0; index < 3; index++) {
        let i = (index * 8) + 8 + index;
        mask_bin = mask_bin.substring(0, i) + "." + mask_bin.substring(i);
    }

    let mask = ip_to_decimal(mask_bin);
    output_mask.textContent = mask;
    output_mask_binary.textContent = mask_bin;

    let masked = mask_ip(ip, mask);
    output_masked.textContent = masked;
    output_masked_binary.textContent = ip_to_binary(masked);

    output_size.textContent = Math.pow(2, 32 - range);
}

//hmm yummy shit
function shorten_ip(ip_array) {
    return ip_array.map((val, i) => {
        for (let index = 0; index < val.length-1; index++) {
            const element = val[index];
            if (element == "0") {
                val = val.substring(1);
                index--;
                continue;
            }
            break;
        }
        return val;
    });
}

//ip to number
function ip_to_number(ip) {
    let ip_array = ip.split(".");
    return ip_array.map((val, i) => {
        return parseInt(val) * Math.pow(256, 3 - i);
    }).reduce((sum, a) => sum + a, 0);
}

//number to ip
function number_to_ip(number) {
    let ip_array = [];
    let num = number;
    for (let index = 0; index < 4; index++) {
        let res = num / Math.pow(256, index ) % 256;
        let x = Math.floor(res);
        ip_array.push(x);
        num -= res;
    }
    return ip_array.reverse().join(".");
}

//((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])       (\/(3[0-2]|[0-2]?[0-9]))
///(?:(?<ip0>25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.)(?:(?<ip1>25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.)(?:(?<ip2>25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.)(?<ip3>25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])(?:\/(?<range>3[0-2]|[0-2]?[0-9]))/gm