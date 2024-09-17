 
 
 setTable();
 selectionMatrix = {};
 selectAll();
 resetSelection();
 updateMinimalData();
 toggleTheme();
 rePaintAll();
 chargeMinimalData();


 // Reset all entries to unpainted, then paint a-family
 function resetSelection(){
    unpaintAll();
    setToFalseSelectionMatrix();
 }

 function unpaintAll(){
    keys = Object.keys(selectionMatrix);
    for(i in keys){
        if (selectionMatrix[keys[i]]){
            paint(keys[i]);
        }
    }
 }
 
 // Set the all selection matrix entries to false
 function setToFalseSelectionMatrix(){
    // charge the selection Matrix
    for (i in  Object.keys(groups)){
        fonema = Object.keys(groups)[i].toString();
        selectionMatrix[fonema] = false;
        grp = groups[fonema];
        for (j=0; j<grp.length; j++){
            selectionMatrix[grp[j]] = false;
        }
    }
 }

 function tableClick(event){
    if (event.target.className=='empty' || event.target.className=='thead'){
        return;
    }
    // take inner content (should contain the fonema or syllable)
    innerName = event.target.innerHTML;
    
    if (Object.keys(groups).includes(innerName)){
        // Here the innerName is a fonema
        fonema = innerName;
        for (i=0; i<groups[fonema].length; i++){
            syllable = groups[fonema][i];
            selectionMatrix[syllable] = selectionMatrix[fonema]; // Adds syllables to the Matrix
            paint(syllable);
        }
        paint(fonema);
        playSyllable(groups[fonema][0]);
        return;
    }
    // If we get here the innerName is a syllable
    syllable = innerName;
    fonema = whichGroup(syllable);

    //Finding out if the fonema should be painted
    fon_group = groups[fonema];
    fon_paint = true;
    for (i=0; i< fon_group.length; i++){
        // test if all other syllables are painted
        if(fon_group[i] != syllable){
            fon_paint = fon_paint && selectionMatrix[fon_group[i]];
        }
    }
    if (fon_paint){
        paint(fonema);
    }
    paint(syllable);
    playSyllable(syllable);
 }

 function playSyllable(syllable) {
   link = '';
   for (i=0; i<data.length; i++){
      if (data[i]['syllable']==syllable){
         link = data[i]['link'];
      }
   }
   audio_elm = document.getElementById("syllable_audio");
   audio_elm.src = link;
   audio_elm.play();
 }

 function whichGroup(syllable){
    keys = Object.keys(groups);
    grp_name = "";
    for(i in keys){
        if (groups[keys[i]].includes(syllable)){
            grp_name = keys[i];
        }
    }
    return grp_name;
 }
 
 function paint(fonema){
    targ = document.getElementById(fonema);
    if (targ){
        selectionMatrix[fonema] = !selectionMatrix[fonema];
        if (selectionMatrix[fonema]){
            targ.style.backgroundColor = paintingColor;
            return;
        }
        targ.style.backgroundColor = "white";
    }
 }
 
 function selectAll(){
    setToFalseSelectionMatrix();
    keys = Object.keys(selectionMatrix);
    for(i in keys){
        paint(keys[i]);
    }
 }

 function setTable(){
    table = document.getElementById('choice_table');
    columnGroup = table.firstElementChild;
    tbody = table.lastElementChild;
    columnGroup.innerHTML = '';
    tbody.innerHTML = '';
    lines = table_data.split('\n');

    // Add the heads
    headers = lines[1].split(',');
    tr = document.createElement('tr');
    empty_th = document.createElement('th');
    tr.appendChild(empty_th);
    empty_th.className = 'thead';
    // add the column group for the first column
    col = document.createElement('col');
    col.width = 20;
    columnGroup.appendChild(col);
    for (i=0; i<headers.length; i++){
        if (headers[i].trim()!=''){
            th = document.createElement('th');
            tr.appendChild(th);
            th.innerHTML = headers[i];
            th.colSpan = 2;
            th.className = 'thead';
            col20 = document.createElement('col');
            col20.width = 20;
            col10 = document.createElement('col');
            col10.width = 10;
            columnGroup.appendChild(col20);
            columnGroup.appendChild(col10);
        }
    }
    // Adds the first line
    tbody.appendChild(tr);

    // ------- second line ------- // <<--- temp code
    for (N=2; N<lines.length; N++){
        line = lines[N].split(',');
        tr = document.createElement('tr');
        initial_th = document.createElement('th');
        initial_th.className = 'thead';
        initial_th.innerHTML = line[0];
        initial_th.rowSpan = 4;
        if (N%4==2){
            tr.appendChild(initial_th);
        }
        for (i=1; i<line.length; i++){
            td = document.createElement('td');
            if(i%2==1){
                if (N%4==2){
                    fonema = line[i].trim();
                    if (fonema!=''){
                        //silly root  <<--- Beacause N=2
                        td.id = fonema;
                        td.innerHTML = fonema;
                        td.className = 'td_silly_root';
                    } else {
                        td.className = 'empty'; // <<--- Beacause N=2
                    }
                    td.rowSpan = 4; // <<--- Beacause N=2
                    tr.appendChild(td); // <<--- Beacause N=2, if N=3,4,5 you add nothing here!
                }
            } else {
                //syllable
                syllable = line[i].trim();
                if (syllable!=''){
                    td.id = syllable;
                    td.innerHTML = syllable;
                    td.className = 'td_syllable';
                } else {
                    td.className = 'empty';
                }
                tr.appendChild(td);
            }
        }
        tbody.appendChild(tr);
    }
 }

function chargeMinimalData(){
   variationElement = document.getElementById('variacoes');
   
   // create variation elements according to minimal_pair_data
   variationElement.innerHTML = '';
   for (i=0; i<minimal_pair_data.length; i++){
      pair = minimal_pair_data[i].split(';');
      pair_name = pair[0];
      op = document.createElement('option');
      op.value = pair_name;
      name_parts = pair_name.split(',');
      innerText = '';
      for (j=0; j<name_parts.length; j++){
         innerText += name_parts[j];
         if (j+1<name_parts.length){
            innerText += ',';
         }
         innerText += ' ';
      }
      op.innerHTML = innerText.trim();
      variationElement.appendChild(op);
   }
   variationElement.selectedIndex = 0; // set the selections to the first element

   //Set the complement data
   setComplementData();

   // set all tons to unchecked
   tonsElement = document.getElementById('tons');
   for (i=0; i<4; i++){
      tonsElement.children[i].firstElementChild.checked = false;
   }
   //set the selections to the first element
   tonsElement.firstElementChild.firstElementChild.checked = true; 
}

function setComplementData(){
   variationElement = document.getElementById('variacoes');
   index = variationElement.selectedIndex;
   complement = minimal_pair_data[index].split(';')[1].split(',');
   complementElement = document.getElementById('complement');
   complementElement.innerHTML = '';
   for (i=0; i<complement.length; i++){
      op_comp = complement[i];
      op = document.createElement('option');
      op.value = op_comp;
      op.innerHTML = op_comp;
      complementElement.appendChild(op);
   }
}

// // Format: csv minimals chosen; csv complements; tone code <<--- '' for nopes, '-' for yeps
// selection_sample = ['b,p;ai;-,-,-,-', 'an,ang,en,eng;w;,-,,'];
// unpaintAll();
// paintFromData(selection_sample)


function paintFromData(selection_array){
    for (N=0; N<selection_array.length; N++){
        selection = selection_array[N].split(';');
        minimal_part = selection[0].split(',');
        complement_part = selection[1].split(',');
        tone_code = selection[2].split(',');
        isInitial = initials.includes(minimal_part[0]);
        for (i=0; i<minimal_part.length; i++){
            for (j=0; j<complement_part.length; j++){
                if (isInitial){
                    fonema = minimal_part[i] + complement_part[j];
                } else {
                    fonema = complement_part[j]+  minimal_part[i];
                }
                fonema = fonema.trim();
                if (fonema.includes('yian')){
                  fonema = fonema.replaceAll('i',''); // yian --> yan and yiang --> yang
                }
                if (Object.keys(groups).includes(fonema)){ // The fonema must exist
                  painted = 0;
                  for (k=0; k<4; k++){
                      if (tone_code[k]=='-'){
                          paint(groups[fonema][k]);
                          painted += 1;
                      }
                  }
                  if (painted==4){
                      paint(fonema);
                  }
                }
            }
        }
    }
}

// Checks the choices made at the minimal table
function updateMinimalData(){
   variationElement = document.getElementById('variacoes');
   varIndex = variationElement.selectedIndex;
   var_value = variationElement[varIndex].value;

   complementElement = document.getElementById('complement');
   compIndex = complementElement.selectedIndex;
   comp_value = complementElement[compIndex].value;

   tonsElement = document.getElementById('tons');
   tone_code = '';
   for (i=0; i<4; i++){
      checkBox = tonsElement.children[i].firstElementChild;
      if (checkBox.checked){
         tone_code += '-';
      }
      if (i<3){
         tone_code += ',';
      }
   }
   unpaintAll();
   paintFromData([var_value + ';' + comp_value + ';' + tone_code])
}

function toggleTheme(){
   table_bg_color = '#fee9e9';
   th_bg_color = '#ffc4c4';
   card_bg_color = 'DeepPink';
   checked = document.getElementById('colorTheme').firstElementChild.checked;
   paintingColor = 'Turquoise';
   if (checked){
      table_bg_color = '#e9f5fe';
      th_bg_color = '#c4e4ff';
      card_bg_color = 'DodgerBlue';
      paintingColor = 'Tomato';
   }
   card = document.getElementsByClassName('card')[0];
   card.style.borderColor = card_bg_color;
   
   theads = document.getElementsByClassName('thead');
   for (i=0; i<theads.length; i++){
      theads[i].style.backgroundColor = th_bg_color;
   }
   tables = document.getElementsByTagName('table');
   for (j=0; j<tables.length; j++){
      tables[j].style.backgroundColor = table_bg_color;
   }
   rePaintAll();
   
}

function rePaintAll(){
   syllables = Object.keys(selectionMatrix);
   for (i=0; i<syllables.length; i++){
      paint(syllables[i]);
      paint(syllables[i]);
   }
}

