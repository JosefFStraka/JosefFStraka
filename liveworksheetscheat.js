let selectboxs = document.querySelectorAll(".selectbox")
let editabledivs = document.querySelectorAll(".editablediv")
let selectabledivs = document.querySelectorAll(".selectablediv")

//selectabledivs
for (let i = 0; i < selectabledivs.length; i++) {
    var id = parseInt(selectabledivs[i].id.replace('selectablediv',''))
    if (contenidoaguardar[id][0] == "select:yes") selectabledivs[i].onclick()
}

//editablediv
for (let i = 0; i < editabledivs.length; i++) {
    editabledivs[i].innerText = contenidoaguardar[i][0];
}

//selectbox
for (var i = 0;i < selectboxs.length;i++) {
  const box = selectboxs[i];
  const options = box.options;
  var rightOption = -1;
  for (var j = 0; j < options.length; j++) {
    if (options[j].outerHTML.includes('value="right"')) {
      rightOption = j;
      options.selectedIndex = j;
      break;
    }
  }

  if (rightOption == -1) {
        cosole.log("couldnt wind right answer for selectobox#" +  i);
  }
}

//drag & drop
for (let i = 0; i < contenidoaguardar.length; i++) {
    let drag_number = "";
    if (contenidoaguardar[i][0].includes("drag:")) {drag_number = contenidoaguardar[i][0].replace("drag:","")} else continue;
    for (let j = 0; j < contenidoaguardar.length; j++) {
        let drop_number = "";
        if (contenidoaguardar[j][0].includes("drop:")) {drop_number = contenidoaguardar[j][0].replace("drop:","")} else continue;
        if (drag_number == drop_number) {
            let drag_el = document.getElementById("dragablediv"+i);
            let drop_el = document.getElementById("dropdiv"+j);
            drag_el.style.top = drop_el.style.top;
            drag_el.style.left = drop_el.style.left;
        }
    }
}
