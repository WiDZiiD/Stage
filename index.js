

var canvas = new fabric.Canvas('canvas');

function sizeCanvas()
{
  var width  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
  var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  canvas.setHeight( height - 200)
  canvas.setWidth( width - 200 )
}

window.addEventListener('resize', draw, false);

function draw()
{  
  canvas.renderAll();  
}

sizeCanvas();



        var rect = new fabric.Rect({
            top : 100,
            left : 100,
            width : 100,
            height : 100,
            fill : 'red'
        });

        canvas.add(rect);
// Déplacer le rectangle à gauche avec le boutton
        $("#button_right").click(function(){
        rect.set({ left: rect.left + 10});
        canvas.renderAll();
        });
// Déplacer le rectangle à gauche avec le boutton
        $("#button_left").click(function(){
        rect.set({ left: rect.left - 10});
        canvas.renderAll();
        });

//Sauvegarder le canvas en format img
/*
        $("#save").click(function(){
            $("#canvas").get(0).toBlob(function(blob){
                saveAs(blob, "myIMG.png");
            });
        }); */
/* 
        fabric.Image.fromURL('img.png', function(img){
            canvas.add(img);
            
            
        }) 
 */

// Effacer tous les objets du canvas
        const clearCanvas = (canvas, state) => {
            state.val = canvas.toSVG()
            canvas.getObjects().forEach(element => {
                if (element !== canvas.backgroundImage) {
                    canvas.remove(element)
                }  
            });
        }

        const svgState = {}
        
        const restoreCanvas = (canvas, state) => {
          if (state.val) {
              fabric.loadSVGFromString(state.val, objects => {
                  console.log(objects)
                  canvas.add(...objects)
                  canvas.requestRenderAll()
              })
          }
      }
      const bgUrl = ''
      

       /*  test evenement souris sur canvas
       canvas.on('mouse:over', (e) => {
            console.log(e)
        }) */


        const imgAdded = (e) => {
            const inputElem = document.getElementById('addImg')
            const file = inputElem.files[0];
            reader.readAsDataURL(file)
        }
        const inputFile = document.getElementById('addImg');
        inputFile.addEventListener('change', imgAdded)
        const reader = new FileReader()

        reader.addEventListener("load", () => {
            fabric.Image.fromURL(reader.result, img => {
                canvas.add(img)
                canvas.requestRenderAll()
            })
        })


        const toJSON = async () => {
          const json = canvas.toDatalessJSON(["clipPath"]);
          const out = JSON.stringify(json, null, "\t");
          const blob = new Blob([out], { type: "text/plain" });
          const clipboardItemData = { [blob.type]: blob };
          try {
            navigator.clipboard &&
              (await navigator.clipboard.write([
                new ClipboardItem(clipboardItemData)
              ]));
          } catch (error) {
            console.log(error);
          }
          const blobURL = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobURL;
          a.download = "maquette.json";
          a.click();
          URL.revokeObjectURL(blobURL);
        };


        $("#loadJson2Canvas").click(function() {
          canvas.loadFromJSON(
            $("#myTextArea").val(),
            canvas.renderAll.bind(canvas));
        });
        $('#loadJson').change(function(e) {
          var file = e.target.files[0];
          if(!file) return;
          var reader = new FileReader();
          reader.onload = function(f) {
            var data = f.target.result;
            canvas.loadFromJSON(
            JSON.parse(data),
            canvas.renderAll.bind(canvas));
          };
          reader.readAsText(file);
          });


      
        const downloadImage = () => {
          const ext = "png";
          const base64 = canvas.toDataURL({
            format: ext,
            enableRetinaScaling: true
          });
          const link = document.createElement("a");
          link.href = base64;
          link.download = `maquette.${ext}`;
          link.click();
        };

        const downloadSVG = () => {
          const svg = canvas.toSVG();
          const a = document.createElement("a");
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const blobURL = URL.createObjectURL(blob);
          a.href = blobURL;
          a.download = "maquette.svg";
          a.click();
          URL.revokeObjectURL(blobURL);
        };

        const removeSelected = (state) => {
          state.val = canvas.toSVG()
          var activeObjects = canvas.getActiveObjects();
          canvas.discardActiveObject()
          if (activeObjects.length) {
            canvas.remove.apply(canvas, activeObjects);
          }
        };
      

        function addText() {
          canvas.add(new fabric.IText('Nouveau texte \nretour a la ligne', {
             left: 50,
             top: 100,
             fontFamily: 'helvetica',
             fill: '#000',
             fontSize: 45
          }));
       }

       
       function downloadcanvas(Selectedvalue){
          switch (Selectedvalue){
            case 'JSON':
              toJSON();
              break;
            case 'SVG':
              downloadSVG();
              break;
            case 'PNG':
              downloadImage();
              break;
          }
        }
          
          
          
/*           
          (this.value = "JSON"){
            toJSON();
          }
          if (this.value = "PNG"){
            downloadImage();
          }
          if (this.value = "SVG"){
            downloadSVG();
          }
          return 0
       }
 */
       $("#button_right").click(function(){
        rect.set({ left: rect.left + 10});
        canvas.renderAll();
        });

        $("#applyFilter").click(function(){
      
          var obj = canvas.getActiveObject();
      
          obj.filters.push(new fabric.Image.filters.Grayscale());
      
          obj.applyFilters();
      
          canvas.renderAll();
        });

        $("#sepiaFilter").click(function(){
      
          var obj = canvas.getActiveObject();
      
          obj.filters.push(new fabric.Image.filters.Sepia());
      
          obj.applyFilters();
      
          canvas.renderAll();
        });



         // Partie modal pour la taille du texte police ajout etc

         // Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var btn2 = document.getElementById("myBtn2");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var texteditarea = document.getElementById("text-controls");
var celarea = document.getElementById("selection-control");

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  celarea.style.display = "none";
  texteditarea.style.display ="contents";
}
btn2.onclick = function() {
  modal.style.display = "block";
  texteditarea.style.display = "none";
  celarea.style.display ="contents";
  
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


var $ = function(id){return document.getElementById(id)};

document.getElementById('text-color').onchange = function() {
  canvas.getActiveObject().set({fill: this.value});
  canvas.renderAll();
};

document.getElementById('text-bg-color').onchange = function() {
  canvas.getActiveObject().set({backgroundColor : this.value});
  canvas.renderAll();
};

document.getElementById('text-lines-bg-color').onchange = function() {
  canvas.getActiveObject().set({textBackgroundColor : this.value});
  canvas.renderAll();
};

document.getElementById('text-stroke-color').onchange = function() {
  canvas.getActiveObject().set({stroke: this.value});
  canvas.renderAll();
};	

document.getElementById('text-stroke-width').onchange = function() {
  canvas.getActiveObject().set({strokeWidth : parseInt(this.value)});
  canvas.renderAll();
};				

document.getElementById('font-family').onchange = function() {
  canvas.getActiveObject().set({fontFamily : this.value});
  canvas.renderAll();
};

document.getElementById('text-font-size').onchange = function() {
  canvas.getActiveObject().set({fontSize : this.value});
  canvas.renderAll();
};

document.getElementById('text-line-height').onchange = function() {
  canvas.getActiveObject().set({lineHeight : this.value});
  canvas.renderAll();
};

document.getElementById('text-align').onchange = function() {
  canvas.getActiveObject().set({textAlign : this.value});
  canvas.renderAll();
};

// Partie objet

document.getElementById('angle').onchange = function() {
  canvas.getActiveObject().set({angle : this.value});
  canvas.renderAll();
};

document.getElementById('object-stroke-color').onchange = function() {
  canvas.getActiveObject().set({stroke: this.value});
  canvas.renderAll();
};	

document.getElementById('object-stroke-width').onchange = function() {
  canvas.getActiveObject().set({strokeWidth : parseInt(this.value)});
  //parseInt ou sinon ça bug ??
  canvas.renderAll();
};				

document.getElementById('cel_height').onchange = function() {
  canvas.getActiveObject().set({height: parseInt(this.value)});
  canvas.renderAll();
};	

document.getElementById('cel_width').onchange = function() {
  canvas.getActiveObject().set({width: parseInt(this.value)});
  canvas.renderAll();
};	

document.getElementById('cel_pos_x').onchange = function() {
  canvas.getActiveObject().set({left: parseInt(this.value)});
  canvas.renderAll();
};	

document.getElementById('cel_pos_y').onchange = function() {
  canvas.getActiveObject().set({top: parseInt(this.value)});
  canvas.renderAll();
};	


radios5 = document.getElementsByName("fonttype");  
for(var i = 0, max = radios5.length; i < max; i++) {
radios5[i].onclick = function() {
  
  if(document.getElementById(this.id).checked == true) {
      if(this.id == "text-cmd-bold") {
          canvas.getActiveObject().set("fontWeight", "bold");
      }
      if(this.id == "text-cmd-italic") {
          canvas.getActiveObject().set("fontStyle", "italic");
      }
      if(this.id == "text-cmd-underline") {
          canvas.getActiveObject().set({underline: true})
      }
if(this.id == "text-cmd-linethrough") {
          canvas.getActiveObject().set({linethrough: true});
      }
if(this.id == "text-cmd-overline") {
          canvas.getActiveObject().set({overline: true});
      }
      
      
      
  } else {
      if(this.id == "text-cmd-bold") {
          canvas.getActiveObject().set("fontWeight", "");
      }
      if(this.id == "text-cmd-italic") {
          canvas.getActiveObject().set("fontStyle", "");
      }  
      if(this.id == "text-cmd-underline") {
          canvas.getActiveObject().set({underline: false});
      }
if(this.id == "text-cmd-linethrough") {
          canvas.getActiveObject().set({linethrough: false});
      }  
      if(this.id == "text-cmd-overline") {
          canvas.getActiveObject().set({overline: false});
      }
  }
  
  
  canvas.renderAll();
}
}



    const rangeInputs = document.querySelectorAll('input[type="range"]')
const numberInput = document.querySelector('input[type="number"]')

function handleInputChange(e) {
  let target = e.target
  if (e.target.type !== 'range') {
    target = document.getElementById('range')
  } 
  const min = target.min
  const max = target.max
  const val = target.value
  
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

rangeInputs.forEach(input => {
  input.addEventListener('input', handleInputChange)
})

numberInput.addEventListener('input', handleInputChange)