const treeMap = document.getElementById('treeMap')
const canvas = document.getElementById('canvas')
let treeData

function renderMap(personData) {
  // Make tree map visible
  treeMap.style.display = 'block'

  const {name, location} = personData

  // Set title
  document.getElementById('modal-name').innerText = name

  // Set canvas size
  canvas.setAttribute('width', treeMap.clientWidth)
  canvas.setAttribute('height', treeMap.clientHeight)

  // Draw image on canvas
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.src = 'BaseMap.png'
  img.onload = () => {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(img, 0, 0, treeMap.clientWidth, treeMap.clientHeight)

    // Get scale factor of image
    const scaleFactor = treeMap.naturalWidth / treeMap.clientWidth

    // Draw on tree map
    for (let i = 0; i < treeData.length; i++) {
      ctx.fillStyle = '#fff'
      const tree = treeData[i]

      const angleOffsetStart = ((tree.angleOffsetStart || 0) / 180) * Math.PI
      const angleOffsetEnd = ((tree.angleOffsetEnd || 0) / 180) * Math.PI

      // Draw Circle
      ctx.beginPath()
      ctx.arc(
        tree.x / scaleFactor,
        tree.y / scaleFactor,
        25,
        angleOffsetStart,
        2 * Math.PI - angleOffsetEnd,
        false
      )
      ctx.fill()
      ctx.stroke()
      ctx.closePath()

      // Draw sectors
      ctx.strokeStyle = '#000'
      for (let j = 0; j < tree.sectors + 1; j++) {
        const angle =
          j *
            ((Math.PI * 2 - angleOffsetEnd - angleOffsetStart) / tree.sectors) +
          angleOffsetStart
        ctx.beginPath()
        ctx.moveTo(tree.x / scaleFactor, tree.y / scaleFactor)
        ctx.lineTo(
          (tree.x + Math.cos(angle) * 50) / scaleFactor,
          (tree.y + Math.sin(angle) * 50) / scaleFactor
        )

        ctx.stroke()
        ctx.closePath()
      }
    }

    if (location) {
      setTimeout(() => {
        const [treeID, sectorID] = location.split('-')
        const locationTree = treeData[treeID - 1]

        const locationAngleOffsetStart =
          ((locationTree.angleOffsetStart || 0) * Math.PI) / 180
        const locationAngleOffsetEnd =
          ((locationTree.angleOffsetEnd || 0) * Math.PI) / 180

        const angle1 =
          (sectorID - 1) *
            ((Math.PI * 2 - locationAngleOffsetEnd - locationAngleOffsetStart) /
              locationTree.sectors) +
          locationAngleOffsetStart
        const angle2 =
          sectorID *
            ((Math.PI * 2 - locationAngleOffsetEnd - locationAngleOffsetStart) /
              locationTree.sectors) +
          locationAngleOffsetStart

        ctx.fillStyle = '#ff0000'
        ctx.strokeStyle = '#ff0000'

        // Hightlight Grave
        ctx.beginPath()
        ctx.moveTo(locationTree.x / scaleFactor, locationTree.y / scaleFactor)
        ctx.arc(
          locationTree.x / scaleFactor,
          locationTree.y / scaleFactor,
          25,
          angle1,
          angle2,
          false
        )
        ctx.fill()
        ctx.closePath()

        // Hide tree map
        treeMap.style.display = 'none'
      })
    }
  }
}

fetch('trees.json')
  .then(function (response) {
    return response.json()
  })
  .then(function (json) {
    treeData = json
  })
