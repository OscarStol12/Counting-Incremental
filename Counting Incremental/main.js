let countnum = document.getElementById("count-nums")
let upgradebutton1 = document.getElementById("upgrade1")
let sh1 = document.getElementById("subheader-1")

let storedCount = localStorage.getItem("Count")
let storedIncrement = localStorage.getItem("Increment")
let storedUpgrades = {
 first: {
    purchased: localStorage.getItem("U1")
 },
}

const player = {
  count: {
    value: 0,
    increment: 1,  
  },

  upgrades: {
    upg1: {
      repeatability: {
        repeatable: false,
        levels: {
          isCapped: true,
          current: 0,
          maxlevels: 1,
          costscaling: 2,
        },
      },
      purchased: false,
      price: 125,
      type: "additive",
      boost: 3,
    },
  },
}

function loadData() {
  player.count.value = Number(storedCount)
  player.count.increment = Number(storedIncrement)
  player.upgrades.upg1.purchased = Boolean(storedUpgrades.first.purchased)

  if (player.count.increment == 1) {
    for (i in player.upgrades) {
      i.purchased = false
    }
  }
  
  console.log(`Loaded data!`)
}

function addBoosts(upgrade) {
  switch (upgrade.type) {
    case "additive":
      player.count.increment += upgrade.boost
      break;
    case "multiplicative":
      player.count.increment *= upgrade.boost
      break;
    default:
      throw Error(`Invalid upgrade type`)
  }
}

function buyUpgrade(upgrade,header) {
  if (upgrade.purchased == true) {
    header.innerText = "Purchased!"
    console.log(`Already purchased`)
  } else if (player.count.value < upgrade.price) {
    console.log(`Cannot afford`)
  } else {
    player.count.value -= upgrade.price

    if (upgrade.repeatability.repeatable == true) {
      if (upgrade.repeatability.levels.isCapped == false) {
        upgrade.repeatability.levels.current++
        upgrade.price *= upgrade.repeatability.levels.costscaling

        addBoosts(upgrade)
      } else {
        if (upgrade.repeatability.levels.current < upgrade.repeatability.levels.maxlevels) {
          upgrade.repeatability.levels.current++
          upgrade.price *= upgrade.repeatability.levels.costscaling
          header.innerText = "Cost: ".concat(upgrade.price).concat(", ").concat(upgrade.repeatability.levels.current).concat("/").concat(upgrade.repeatability.levels.maxlevels) 

          addBoosts(upgrade)
        } else {
          upgrade.purchased = true
          header.innerText = "Purchased!"
        }
      }
    } else {
      addBoosts(upgrade)
      upgrade.purchased = true
      header.innerText = "Purchased!"
    }
    countnum.innerText = player.count.value
    console.log(`Upgrade purchased!`)
  }
}

function saveData() {
  localStorage.setItem("Count", Number(player.count.value))
  localStorage.setItem("Increment", Number(player.count.increment))
  localStorage.setItem("U1", Boolean(player.upgrades.upg1.purchased))
  console.log(`Saved data!`)
}

function countUp() {
  player.count.value += player.count.increment
  countnum.innerText = player.count.value
}