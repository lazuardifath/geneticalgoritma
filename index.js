const kolomResult = document.getElementById('kol-total')
const kolomVariable = document.getElementById('kol-variable')
const kolomHasil = document.getElementById('kol-hasil')

const variableForm = document.getElementById('variable-form')
const resultForm = document.getElementById('result-form')
const selectVariable = document.getElementById('variable')
const btnCalculate = document.getElementById('btn-calculate')
const iteration = document.getElementById('iteration')
const tableBody = document.getElementById('table-body')
const listFinalVar = document.getElementById('final-result')
const masalah = document.getElementById('masalah')
const tabelHasil = document.getElementById('tabel-hasil')

let listItem = []
let result = 0
let selectedVariable = []
const totalPopulation = 10
const mutationRate = 0.1
const template = {
  angka: 0,
  value: 0,
  variable: '',
  operator: '',
}

const generateRandom = (min = 0, max = 1) =>
  Math.round(Math.random() * (max - min) + min)

const fitnessCalc = (items = Array, total) => {
  const temp = items.reduce((acc, cur) => {
    const oper = cur.operator === '+' ? 1 : -1
    const foo = parseInt(cur.angka) * cur.value * oper
    return acc + foo
  }, 0)
  const secTemp = total - Math.abs(total - temp)
  const res = (Math.abs(secTemp) / total) % total
  return {
    total: temp,
    score: Math.abs(temp - total),
  }
}

const createGene = (item = Object, total = 0) => ({
  ...item,
  value: generateRandom(1, total),
})

const createPopulation = (items = [], total = 0, population) => {
  const arrDumb = Array(population).fill(0)
  const foo = arrDumb.map(() => {
    const gene = items.map((item) => createGene(item, total))
    return { gene, fitness: fitnessCalc(gene, total) }
  })
  return foo
}

const selection = (population = []) => {
  const sorted = population.map((x) => x.fitness.score).sort()
  const first = population.findIndex((x) => x.fitness.score === sorted[0])
  const second = population.findIndex((x) => x.fitness.score === sorted[1])

  const parent1 = population[first]
  const parent2 = population[second]

  return [parent1, parent2]
}

const crossover = (parent1 = Object, parent2 = Object, total = 0) => {
  const len = parent1.gene.length
  const ran = generateRandom(0, len)

  const gene1 = [
    ...parent1.gene.slice(0, ran),
    ...parent2.gene.slice(ran, len),
  ]
  const child1 = {
    gene: gene1,
    fitness: fitnessCalc(gene1, total),
  }

  const gene2 = [
    ...parent2.gene.slice(0, ran),
    ...parent1.gene.slice(ran, len),
  ]

  const child2 = {
    gene: gene2,
    fitness: fitnessCalc(gene2, total),
  }

  return [child1, child2]
}

const mutation = (item = Object, mutationRate = 0, total = 0) => {
  const rand = Math.random()
  const gene = item.gene.map((x) => {
    let { value } = x
    if (rand <= mutationRate) {
      value = generateRandom(0, total)
    }

    return {
      ...x,
      value,
    }
  })

  return { gene, fitness: fitnessCalc(gene, total) }
}

const regeneration = (children = [], population = []) => {
  const len = population.length
  const sorted = population.map((x) => x.fitness.score).sort()
  const first = population.findIndex(
    (x) => x.fitness.score === sorted[len - 1],
  )
  const second = population.findIndex(
    (x) => x.fitness.score === sorted[len - 2],
  )
  const arrTemp = population.filter((x, id) => id !== first && id !== second)

  return [...arrTemp, ...children]
}

const logging = (list) => {
  let masalahWord = ''
  masalah.innerHTML = ''

  list.forEach((item, id) => {
    let operator = item.operator === '+' ? '+ ' : '- '
    let word = `${operator}${item.angka}${item.variable}`
    if (id === 0) {
      operator = item.operator === '+' ? '' : '- '
      word = `${operator}${item.angka}${item.variable}`
    } else if (id < list.length - 1) {
      word = `${operator}${item.angka}${item.variable} `
    }
    masalahWord += word
  })

  masalah.innerHTML = `${masalahWord} = ${result}`
}

const logger = (population = [], generation = 0) => {
  tableBody.querySelectorAll('*').forEach((x) => x.remove())
  iteration.textContent = ''

  population.forEach((item, id) => {
    const tr = document.createElement('tr')
    const dt = document.createElement('td')
    const nomor = document.createTextNode(id + 1)

    dt.appendChild(nomor)
    tr.appendChild(dt)

    item.gene.map((x) => {
      const td = document.createElement('td')
      td.textContent = x.value
      tr.appendChild(td)
    })

    tableBody.appendChild(tr)
  })

  iteration.textContent = generation
}

const finalLog = (item = {}) => {
  let words = ''
  listFinalVar.innerHTML = ''
  item.gene.forEach(({ variable, value }, id) => {
    let word = `${variable} = ${value} | `
    if (id === 0) {
      word = `| ${variable} = ${value} | `
    }
    words += word
  })
  listFinalVar.innerHTML = words
}

const refreshVariable = (available = Object, selected = []) => {
  const arrAvail = Object.entries(available.children).map((item) => item[1])
  const lenSelected = selected.length
  selected.forEach((item) => {
    arrAvail.forEach((vari) => {
      if (vari.value === item) {
        available.removeChild(vari)
      }
    })
  })
}

resultForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const { hasil } = e.target
  result = parseInt(hasil.value)
  resultForm.classList.add('d-none')
  kolomResult.classList.add('d-none')
  kolomVariable.classList.remove('d-none')
})

variableForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const { angka, variable, operator } = e.target
  kolomHasil.classList.remove('d-none')
  if (listItem.length < 4) {
    listItem = [
      ...listItem,
      {
        angka: angka.value,
        variable: variable.value,
        operator: operator.value,
      },
    ]
    selectedVariable = [...selectedVariable, variable.value]
  } else {
    alert('Maaf anda sudah melebihi batas')
  }

  if (listItem.length >= 4) {
    kolomVariable.classList.add('d-none')
    btnCalculate.classList.remove('d-none')
  }
  refreshVariable(selectVariable, selectedVariable)
  logging(listItem)
})

btnCalculate.addEventListener('click', (e) => {
  //btnCalculate.classList.add('d-none')
  tabelHasil.classList.remove('d-none')
  tabelHasil.classList.add('my-5')

  let isLoading = true
  let generation = 1
  while (isLoading) {
    let population = createPopulation(listItem, result, totalPopulation)
    const [parent1, parent2] = selection(population)
    const [child1, child2] = crossover(parent1, parent2, result)

    setTimeout(() => {
      logger(population, generation)
    }, 0.001)

    const mutan1 = mutation(child1, mutationRate, result)
    const mutan2 = mutation(child2, mutationRate, result)
    const children = [mutan1, mutan2]
    population = regeneration(children, population)

    const hsl = population.filter((x) => x.fitness.score === 0)[0]
    if (hsl !== undefined) {
      finalLog(hsl)
      break
    }
    generation++
  }
})