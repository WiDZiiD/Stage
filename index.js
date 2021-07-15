

var canvas = new fabric.Canvas('canvas');
        

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

/*         canvas.loadFromJSON(JSON.parse(json_data), canvas.renderAll.bind(canvas), function(o, object) {
          if (object.type == 'image') {
            object.setSrc(url, canvas.renderAll.bind(canvas))
          }
        });
 */
        const downloadImage = () => {
          const ext = "png";
          const base64 = canvas.toDataURL({
            format: ext,
            enableRetinaScaling: true
          });
          const link = document.createElement("a");
          link.href = base64;
          link.download = `eraser_example.${ext}`;
          link.click();
        };

        const downloadSVG = () => {
          const svg = canvas.toSVG();
          const a = document.createElement("a");
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const blobURL = URL.createObjectURL(blob);
          a.href = blobURL;
          a.download = "eraser_example.svg";
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
/*              stroke: '#F0F0F0',
             strokeWidth: 0.2, */
             fontSize: 45
          }));
       }