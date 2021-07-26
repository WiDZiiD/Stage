

var canvas = new fabric.Canvas('canvas');

// canvas qui s'adapte à la résolution de l'écran
function sizeCanvas()
{
  var width  = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
  var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  canvas.setHeight( height - 170)
  canvas.setWidth( width - 200 )
}

window.addEventListener('resize', draw, false);

function draw()
{  
  canvas.renderAll();  
}

sizeCanvas();


// rectangle de base présent
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

        // Restore l'état précédent du canvas (ne fonctionne pas avec toutes les fonctions, valable uniquement pour une version précédente)
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
      

       /*  test evenement souris sur canvas
       canvas.on('mouse:over', (e) => {
            console.log(e)
        }) */

        // Upload et ajoute une image au canvas 
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

        // Génère et télécharge un fichier json à partir du canvas
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

        // Charge un fichier JSON sur le canvas 
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


        // Récupère le canvas sous format PNG
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

        //Recupère le canvas sous format SVG
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

        // Supprime cellule active avec le bouton 'x'
        const removeSelected = (state) => {
          state.val = canvas.toSVG()
          var activeObjects = canvas.getActiveObjects();
          canvas.discardActiveObject()
          if (activeObjects.length) {
            canvas.remove.apply(canvas, activeObjects);
          }
        };
      
        //Supprime cellule active avec touche delete
        document.addEventListener('keydown', function(event)  {
          var keyPressed = event.keyCode;
          if(keyPressed == 46) {
            var activeObject = canvas.getActiveObject();
            if(activeObject !== null) {
              canvas.remove(activeObject);
            }
          }
        });

        // Ajoute ce texte à l'appuie du bouton texte
        function addText() {
          canvas.add(new fabric.IText('Nouveau texte \nretour a la ligne', {
             left: 50,
             top: 100,
             fontFamily: 'helvetica',
             fill: '#000',
             fontSize: 45
          }));
       }

       // Boutton avec dropup menu pour choix du format de téléchargement
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

      $("#button_right").click(function(){
        rect.set({ left: rect.left + 10});
        canvas.renderAll();
        }); */

        //Filtre noir & blanc (échelle de gris plus précisément)
        $("#applyFilter").click(function(){
      
          var obj = canvas.getActiveObject();
      
          obj.filters.push(new fabric.Image.filters.Grayscale());
      
          obj.applyFilters();
      
          canvas.renderAll();
        });
        //Filtre Sépia
        $("#sepiaFilter").click(function(){
      
          var obj = canvas.getActiveObject();
      
          obj.filters.push(new fabric.Image.filters.Sepia());
      
          obj.applyFilters();
      
          canvas.renderAll();
        });



         // Partie modal pour la taille du texte police ajout etc

         // Récupère le modal
var modal = document.getElementById("myModal");

// Récupères les boutons qui ouvrent le modal
var btn = document.getElementById("myBtn");
var btn2 = document.getElementById("myBtn2");
var btn3 = document.getElementById("myBtn3");

// Récupère la croix qui ferme le modal
var span = document.getElementsByClassName("close")[0];

//Récupère les différents contenues du modal
var texteditarea = document.getElementById("text-controls");
var celarea = document.getElementById("selection-control");
var canvasarea = document.getElementById("canvas-control");

// Ouvre le modal au clic et affiche ou non les contenues nécéssaires
btn.onclick = function() {
  modal.style.display = "block";
  celarea.style.display = "none";
  canvasarea.style.display = "none"
  texteditarea.style.display ="contents";
}
btn2.onclick = function() {
  modal.style.display = "block";
  texteditarea.style.display = "none";
  canvasarea.style.display = "none"
  celarea.style.display ="contents";
  
}
btn3.onclick = function() {
  modal.style.display = "block";
  texteditarea.style.display = "none";
  celarea.style.display ="none";
  canvasarea.style.display = "contents"
  
}

// Ferme le modal au clic de la croix
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

// Récupère et applique tout les paramètres pour les textes
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

// Partie cellules

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

document.getElementById('object-color').onchange = function() {
  canvas.getActiveObject().set({fill: this.value});
  canvas.renderAll();
};	

// partie canvas

document.getElementById('backgroundcolor').onchange = function() {
  canvas.set({backgroundColor: this.value});
  canvas.renderAll();
};

document.getElementById('canvasHeight').onchange = function() {
  canvas.setHeight(this.value);
  canvas.renderAll();
};

document.getElementById('canvasWidth').onchange = function() {
  canvas.setWidth(this.value);
  canvas.renderAll();
};


// Applique un gradient générique au fond du canvas
fabric.util.addListener(document.getElementById('set-gradient'), 'click', function () {
    
  var grad = new fabric.Gradient({
      type: 'linear',
      coords: {
          x1: 0,
      y1: 0,
      x2: canvas.width,
      y2: canvas.height,
      },
      colorStops: [
      {
          color: 'rgb(166,111,213)',
          offset: 0,
      },
      {
          color: 'rgba(106, 72, 215, 0.5)',
          offset: 0.5,
      },
      {    
          color: '#200772',
          offset: 1,
      }
      ]});
  canvas.backgroundColor = grad.toLive(canvas.contextContainer);
      canvas.renderAll();
  });

  
  // Génére et affiche une grille sur le canvas selon la taille de la variable grid
  var gridGroup;

  function addGrid() {
    if (gridGroup) return;
    var grid = document.getElementById('gridsize').value;
    var gridoption = {
      stroke: "#cccccc",

    };
    var gridLines = [];
    for (var i = 0; i < (canvas.width / grid); i++) {
      gridLines.push(new fabric.Line([ i * grid, 0, i * grid, canvas.height], gridoption));
    }
    for (var i = 0; i < (canvas.height / grid); i++){  
      gridLines.push(new fabric.Line([ 0, i * grid, canvas.width, i * grid], gridoption));
    }
      

    gridGroup = new fabric.Group(gridLines, {
      selectable: false,
      evented: false
    })
    gridGroup.addWithUpdate();
    canvas.add(gridGroup);
  }
  
  function removeGrid() {
    gridGroup && canvas.remove(gridGroup);
    gridGroup = null;
  }

// Upload une image comme fond du canvas
  const imgBackground = (e) => {
    const inputbackgroundimage = document.getElementById('backgroundimage')
    const file2 = inputbackgroundimage.files[0];
    reader2.readAsDataURL(file2)
}
const inputbackground = document.getElementById('backgroundimage');
inputbackground.addEventListener('change', imgBackground)
const reader2 = new FileReader()

reader2.addEventListener("load", () => {
    fabric.Image.fromURL(reader2.result, img2 => {
      canvas.setBackgroundImage(img2, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img2.width,
        scaleY: canvas.height / img2.height
     });
})
})


// Change les paramètres du texte si les cases sont cochées
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

/* 

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

numberInput.addEventListener('input', handleInputChange) */