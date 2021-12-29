const photoFile = document.getElementById('photo-file')
const photoPreview = document.getElementById('photo-preview')
const image = new Image();
let photoName;
// select & Preview image

document.getElementById('select-image').onclick = function() {
  photoFile.click()
}
window.addEventListener('DOMContentLoaded', () => {
  photoFile.addEventListener('change', () => {
    let file = photoFile.files.item(0)
    photoName = file.name;
    //ler um arquivo
    let reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = function(event) {

      image.src = event.target.result
    }
  })

})

// selection tool
const selection = document.getElementById('selection-tool')
let startX, startY, relativeStartX, relativeStartY,
  endX, endY, relativeEndX, relativeEndY;

  let startSelection = false

const events = {
  mouseover: function(){
    this.style.cursor = 'crosshair'
  }, //chave, valor
  mousedow: function(){
    const  {clientX, clientY, offsetX, offsetY} = Event
    //console.table({
      //'client': [clientX, clientY],
      //'offset': [offsetX, offsetY]
    //})

    startX = clientX
    startY = clientY
    relativeStartX = offsetX
    relativeStartY = offsetY

    startSelection = true

  },
  mousemove(){
    endX = Event.clientX
    endY = Event.clientY

    if(startSelection){
      selection.style.display = 'initial';
      selection.style.top = startY + 'px';
      selection.style.left = startX + 'px';

      selection.style.width = (endX - startX) + 'px';
      selection.style.height = (endY - startY) + 'px';

    }

  }, //chave, valor
  mouseup(){
    startSelection = false

    relativeEndX = event.layerX;
    relativeEndY = event.layerY

    // mostrar o botão de corte
    cropButton.style.display = 'initial'

  }
}

Object.keys(events)
.forEach((eventName) => {
  //addEventListener('mouseover', events.mouseover)
  photoPreview.addEventListener(eventName,events[eventName])
})

//canvas

let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')

image.onload = function() {
  const { width, height } = image
  canvas.width = image.width;
  canvas.height = image.height;

  //limpar o contexto
  ctx.clearRect(0, 0, width, height)

  //desenhar a imagem no contexto
  ctx.drawImage(image, 0, 0)

  photoPreview.src = canvas.toDataURL()
}

//Cortar Imagem

const cropButton = document.getElementById(crop-image)
cropButton.onclick = () => {
  const { width: imgW, height: imgH } = image
  const {width: previewW, height: previewH} = photoPreview
  
  const [ widthFactor, heightFactor] = [
    +(imgW / previewW),
    +(imgH / previewH)
  ]

  const [ selectionWidth, selectionHeight] = [
    +selection.style.width.replace('px', ''),
    +selection.style.height.replace('px', '')
  ]

  const [croppedwid, croppedHeight] = [
    +(selectionWidth * widthFactor),
    +(selectionHeight * heightFactor)
  ]

  const [actualX, actualY] = [
    +(relativeStartX * widthFactor),
    +(relativeStartY * heightFactor)
  ]

  //pegar do contexto(ctx) as regioes de corte da imagem
const croppedImage = ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight)

ctx.clearRect(0, 0, ctx.width, ctx.height)

//ajuste de proporçoes
image.width = canvas.width = croppedWidth;
image.height = canvas.height - croppedHeight

//adicionar a imagem cortada ao contexto do canvas
ctx.putImageData(croppedImage, 0, 0)

//esconder a ferramenta de seleção
selection.style.display = 'none'

//atualizar o preview da imagem
photoPreview.src = canvas.toDataURL()

//mostrar botão de download
downloadButton.style.display = 'initial'
}

// Download
const downloadButton = document.getElementById('download')
downloadButton.onclick = function() {
  const a = document.createElement('a')
  a.download = photoName + '-cropped.png'
  a.href = canvas.toDataURL();
  a.click()
}