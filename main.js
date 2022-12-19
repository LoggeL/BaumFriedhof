import {faker} from 'https://cdn.skypack.dev/@faker-js/faker'

faker.setLocale('de')
let data = new Array(100).fill(0).map(() => ({
  name: faker.name.lastName() + ' ' + faker.name.firstName(),
  death: faker.date.past(50).getFullYear(),
  location: `${faker.datatype.number({
    max: 16,
    min: 1,
  })}-${faker.datatype.number({max: 8, min: 1})}`,
}))

const tbody = document.querySelector('tbody')
const input = document.getElementById('search')

input.addEventListener('input', (e) => {
  drawTable(e.target.value)
})

document.querySelectorAll('th').forEach((e) => {
  e.addEventListener('click', () => {
    if (sortBy === e.getAttribute('name')) {
      decsending = !decsending
    }
    sortBy = e.getAttribute('name')
    document.querySelector('th.active')?.classList.remove('active')
    e.classList.add('active')
    drawTable(input.value)
  })
})

let sortBy = 'name'
let decsending = false

function drawTable(filter) {
  tbody.innerHTML = ''

  data.sort((a, b) => {
    if (sortBy === 'name') {
      // Surname
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'death') {
      return a.death - b.death
    } else if (sortBy === 'location') {
      const [a1, a2] = a.location.split('-')
      const [b1, b2] = b.location.split('-')
      return a1 * 1e5 + a2 - (b1 * 1e5 + b2)
    }
  })

  data = decsending ? data.reverse() : data

  for (let i = 0; i < data.length; i++) {
    if (
      filter &&
      !data[i].name.toLowerCase().includes(filter.toLowerCase()) &&
      !data[i].location.toLowerCase().includes(filter.toLowerCase()) &&
      !data[i].death.toString().includes(filter)
    ) {
      continue
    }
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${data[i].name}</td>
      <td>${data[i].death}</td>
      <td>${data[i].location}</td>
    `
    tr.addEventListener('click', (event) => {
      toggleModal(event)
      renderMap(data[i])
    })
    tbody.appendChild(tr)
  }

  if (tbody.children.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3"><center>Keine Ergebnisse gefunden</center></td></tr>'
  }
}

drawTable()
