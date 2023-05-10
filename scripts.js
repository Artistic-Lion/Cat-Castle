//Define Main Variables
let currentCoins = 0;
let coinCount = 0;
let clickCps = 1;
let totalCps = 0;
let buyOrSell = "buy";
//say whether to buy or sell buildings

//cursor clicking
function clickCat() {
  currentCoins += 1 * clickCps;
  coinCount += 1 * clickCps;
  updateCoins();
}

function setToBuy() {
  buyOrSell = "buy";
}
//switch the mode for building clicks

function setToSell() {
  buyOrSell = "sell";
}
//switch the mode for building clicks

//Update coin count as well as visuably changing upgrades when purchasable
function updateCoins() {
  document.getElementById("coinCounter").textContent = currentCoins + " Coins";
  document.getElementById("cpsTracker").textContent =
    totalCps + " Coins per Second";
  //update the CPS and coin counters
  upgradeList.forEach((upgrade) => {
    if (currentCoins >= upgrade.cost) {
      document
        .getElementById(upgrade.name)
        .getElementsByClassName("overlay")[0]
        .classList.add("purchasable");
    } else if (
      document
        .getElementById(upgrade.name)
        .getElementsByClassName("overlay")[0]
        .classList.contains("purchasable")
    ) {
      document
        .getElementById(upgrade.name)
        .getElementsByClassName("overlay")[0]
        .classList.remove("purchasable");
    }
  });
  //loop through each upgrade and adjust overlays to be visible or hidden depending on if it's affordable

  if (buyOrSell == "buy") {
    buildingList.forEach((building) => {
      building.buildingUpdate();
      if (currentCoins >= building.cost) {
        document
          .getElementById(building.name)
          .getElementsByClassName("overlay")[0]
          .classList.add("purchasable");
      } else if (
        document
          .getElementById(building.name)
          .getElementsByClassName("overlay")[0]
          .classList.contains("purchasable")
      ) {
        document
          .getElementById(building.name)
          .getElementsByClassName("overlay")[0]
          .classList.remove("purchasable");
      }
    });
  } else {
    buildingList.forEach((building) => {
      building.buildingUpdate();
      if (building.count >= 1) {
        document
          .getElementById(building.name)
          .getElementsByClassName("overlay")[0]
          .classList.add("purchasable");
      } else if (
        document
          .getElementById(building.name)
          .getElementsByClassName("overlay")[0]
          .classList.contains("purchasable")
      ) {
        document
          .getElementById(building.name)
          .getElementsByClassName("overlay")[0]
          .classList.remove("purchasable");
      }
    });
  }
  //loop through each upgrade and adjust the overlay to be visible depending on
  //if it's buy mode and affordble, or if it's sell mode and you have buildings to sell
}

function tutorialMenu() {
  if (document.getElementById("tutText").classList.contains("showTut")) {
    document.getElementById("tutText").classList.remove("showTut");
    document.getElementById("tutText").classList.add("hideTut");
  } else {
    document.getElementById("tutText").classList.add("showTut");
    document.getElementById("tutText").classList.remove("hideTut");
  }
}
//open and close the tutorial menu

//Upgrades
class Upgrade {
  constructor(name, cost, icon, cps, appliesTo, unlocked, purchased, tooltip) {
    this.name = name;
    this.cost = cost;
    this.icon = icon;
    this.cps = cps;
    this.appliesTo = appliesTo;
    this.unlocked = unlocked;
    this.purchased = purchased;
    this.tooltip = tooltip;
    //declare upgrade variables
  }
  //upgrade constructor
  buy() {
    if (currentCoins >= this.cost) {
      //check if you can afford upgrade
      currentCoins -= this.cost;

      updateCoins();
      this.purchased = true;
      //set the upgrade to be purchased and update the coin counter
      if (this.appliesTo == "Clicker") {
        clickCps *= this.cps;
      } else {
        document
          .getElementById(this.appliesTo)
          .setAttribute(
            "data-cps",
            document.getElementById(this.appliesTo).getAttribute("data-cps") *
              this.cps
          );
      }
      //apply the upgrade to either a building or the cursor

      document.getElementById(this.name).classList.add("upgradePurchased");
      document.getElementById(this.name).remove();
      upgradeList.splice(upgradeList.indexOf(this), 1);
      //remove purchased upgrades from the upgrade grid

      for (let i = 0; i < upgradeList.length; i++) {
        document
          .getElementById(upgradeList[i].name)
          .setAttribute("data-index", i);
      }
      //update indicies for upgrades in upgrade grid
    }
  }
  //function for buying upgrades

  createUpgrade(list, index) {
    var tempUpgradeCard = document.createElement("div");
    tempUpgradeCard.setAttribute("id", this.name);
    tempUpgradeCard.setAttribute("data-index", index);
    tempUpgradeCard.style.backgroundImage =
      "url(" + this.icon + "), url(assets/upgrade_box_background.png)";
    tempUpgradeCard.classList.add("upgradeCard");
    //create a new upgrade card
    document.getElementById("shopGrid").appendChild(tempUpgradeCard);
    //add it to the shopgrid
    let itemName = this.name;
    document.getElementById(this.name).addEventListener("click", function () {
      list[document.getElementById(itemName).getAttribute("data-index")].buy();
    });
    //add an event listener that will call buy() for the correct upgrade in the array

    var tempToolTip = document.createElement("div");
    tempToolTip.classList.add("tooltip");
    tempToolTip.setAttribute("id", this.name + " ToolTip");
    //create a tooltip box

    var tempToolTipHeading = document.createElement("div");
    tempToolTipHeading.classList.add("tooltipHead");
    tempToolTipHeading.innerText = this.name;
    tempToolTip.appendChild(tempToolTipHeading);
    //create a tooltip heading

    var tempToolTipText = document.createElement("div");
    tempToolTipText.classList.add("tooltipText");
    tempToolTipText.innerText =
      this.tooltip + "\nCost: " + this.cost + " Coins";
    tempToolTip.appendChild(tempToolTipText);
    //create tooltip text

    document.getElementById(this.name).appendChild(tempToolTip);
    //create the final tooltip for the object

    var tempOverlay = document.createElement("div");
    tempOverlay.classList.add("overlay");
    document.getElementById(this.name).appendChild(tempOverlay);
    //create an overlay for the upgrade
  }
  //create a new upgrade for the game
}

class Building {
  constructor(name, cost, icon, picture, cps, tooltip) {
    this.name = name;
    this.cost = cost;
    this.icon = icon;
    this.picture = picture;
    this.cps = cps;
    this.count = 0;
    this.tooltip = tooltip;
    //define variables
  }

  buy() {
    if (currentCoins >= this.cost) {
      //check if you can afford upgrade
      currentCoins -= this.cost;
      this.count += 1;
      totalCps += this.cps;
      updateCoins();
      //buy a building;
    }
  }
  //buy a building ingame

  sell() {
    if (this.count >= 1) {
      currentCoins += this.cost;
      this.count -= 1;
      totalCps -= this.cps;
      updateCoins();
    }
    //check if you have more than 1 of a building then sell it
  }
  //sell a building

  buildingUpdate() {
    document
      .getElementById(this.name)
      .getElementsByClassName("tooltip")[0]
      .getElementsByClassName("tooltipText")[0].innerText =
      this.tooltip +
      "\nCost: " +
      this.cost +
      " Coins" +
      " | " +
      this.count +
      " owned" +
      " | creates " +
      this.cps +
      " coins per second";
    //update tooltip, mainly with cost and CPS
    if (
      this.count >= 1 &&
      document.getElementById(this.name + "Visual").classList.contains("hidden")
    ) {
      document.getElementById(this.name + "Visual").classList.remove("hidden");
      document.getElementById(this.name + "Visual").classList.add("visible");
    } else if (
      this.count == 0 &&
      document
        .getElementById(this.name + "Visual")
        .classList.contains("visible")
    ) {
      document.getElementById(this.name + "Visual").classList.remove("visible");
      document.getElementById(this.name + "Visual").classList.add("hidden");
    }
    //show or hide the visuals for buildings in column 2 depending on if the building is owned
  }

  buildingTick() {
    this.cps = Number(
      document.getElementById(this.name).getAttribute("data-cps")
    );
    currentCoins += this.cps * this.count;
  }
  //increment CPS for each building

  createBuilding(list, index) {
    var tempBuilding = document.createElement("div");
    tempBuilding.setAttribute("id", this.name);
    tempBuilding.setAttribute("data-cps", this.cps);
    tempBuilding.setAttribute("data-count", this.count);
    tempBuilding.setAttribute("data-index", index);
    //set up the main data variables for buildings to function

    tempBuilding.classList.add("buildingCard");
    //create a new building

    document.getElementById("buildingGrid").appendChild(tempBuilding);
    //add it to the grid

    let itemName = this.name;
    document.getElementById(this.name).addEventListener("click", function () {
      if (buyOrSell == "buy") {
        list[
          document.getElementById(itemName).getAttribute("data-index")
        ].buy();
      } else {
        list[
          document.getElementById(itemName).getAttribute("data-index")
        ].sell();
      }
    });
    //add an event listener that will call buy() or sell() for the correct upgrade in the array

    var tempBuildingVisual = document.createElement("div");
    tempBuildingVisual.setAttribute("id", this.name + "Visual");
    tempBuildingVisual.classList.add("buildingVisual");
    tempBuildingVisual.classList.add("hidden");
    tempBuildingVisual.style.backgroundImage = "url(" + this.picture + ")";
    document.getElementById("column2").appendChild(tempBuildingVisual);
    //create a visual for the building that will be displayed when purchased

    var tempImage = document.createElement("div");
    tempImage.classList.add("buildingImage");
    tempImage.style.backgroundImage = "url(" + this.icon + ")";
    document.getElementById(this.name).appendChild(tempImage);
    //create the icon for the building card

    var tempToolTip = document.createElement("div");
    tempToolTip.classList.add("tooltip");
    tempToolTip.setAttribute("id", this.name + " ToolTip");
    //create a tooltip box

    var tempToolTipHeading = document.createElement("div");
    tempToolTipHeading.classList.add("tooltipHead");
    tempToolTipHeading.innerText = this.name;
    tempToolTip.appendChild(tempToolTipHeading);
    //create a tooltip heading

    var tempToolTipText = document.createElement("div");
    tempToolTipText.classList.add("tooltipText");
    tempToolTipText.innerText =
      this.tooltip +
      "\nCost: " +
      this.cost +
      " Coins" +
      " | creates " +
      this.cps +
      " coins per second";
    tempToolTip.appendChild(tempToolTipText);
    //create tooltip text

    document.getElementById(this.name).appendChild(tempToolTip);
    //create the final tooltip for the object

    var tempOverlay = document.createElement("div");
    tempOverlay.classList.add("overlay");
    document.getElementById(this.name).appendChild(tempOverlay);
    //create an overlay for the building
  }
}

class Wardrobe {
  constructor(name, icon) {
    this.name = name;
    this.icon = icon;
  }

  switchCostume() {
    document.getElementById("catToClick").style.backgroundImage =
      "url(" + this.icon + ")";
  }

  createCostume(list, index) {
    var tempCostume = document.createElement("div");
    tempCostume.setAttribute("id", this.name);
    tempCostume.setAttribute("data-index", index);
    //set up the main data variables for costumes to function

    tempCostume.style.backgroundImage = "url(" + this.icon + ")";
    //set the background image

    tempCostume.classList.add("costumeCard");
    //create a new costume

    document.getElementById("wardrobeGrid").appendChild(tempCostume);
    //add it to the grid

    let itemName = this.name;
    document.getElementById(this.name).addEventListener("click", function () {
      list[
        document.getElementById(itemName).getAttribute("data-index")
      ].switchCostume();
    });
    //add an event listener that will call buy() or sell() for the correct upgrade in the array
  }
}

const upgradeList = [
  new Upgrade(
    "Double Boops",
    10,
    "assets/cursor_upgrade.png",
    2,
    "Clicker",
    true,
    false,
    "Extra boopage, x2 from clicks"
  ),
  new Upgrade(
    "Pawfect",
    100,
    "assets/paw_upgrade.png",
    2,
    "Paw",
    true,
    false,
    "more toe beans! x2 from paws"
  ),
  new Upgrade(
    "Bun Making",
    1000,
    "assets/baker_upgrade.png",
    2,
    "Baker",
    true,
    false,
    "He's kneading! x2 from bakers"
  ),
  new Upgrade(
    "Finger Paint",
    5000,
    "assets/painter_upgrade.png",
    2,
    "Painter",
    true,
    false,
    "Kid named finger, x2 from painters"
  ),
  new Upgrade(
    "Zooming Time",
    25000,
    "assets/knight_upgrade.png",
    2,
    "Knight",
    true,
    false,
    "ZOOOOOOOOOOOOOOOM, x2 from knights"
  ),
  new Upgrade(
    "Castle Support",
    500000,
    "assets/princess_upgrade.png",
    2,
    "Princess",
    true,
    false,
    "The programmer needs help, x2 from princesses"
  ),
  new Upgrade(
    "Dancing Queen",
    1000000,
    "assets/princess_upgrade2.png",
    2,
    "Princess",
    true,
    false,
    "She got coronated! x2 from princesses"
  ),
];
//define new upgrades

for (let i = 0; i < upgradeList.length; i++) {
  upgradeList[i].createUpgrade(upgradeList, i);
}
//create upgrade objects in the game for every upgrade in the list

const buildingList = [
  new Building(
    "Paw",
    10,
    "assets/paw_building.png",
    "assets/paw_visual.png",
    1,
    "Extra Paws to click"
  ),
  new Building(
    "Baker",
    100,
    "assets/baker_building.png",
    "assets/baker_visual.png",
    5,
    "Biscuit Making kitties"
  ),
  new Building(
    "Painter",
    500,
    "assets/painter_building.png",
    "assets/painter_visual.png",
    10,
    "The painter cat paints"
  ),
  new Building(
    "Knight",
    2500,
    "assets/knight_building.png",
    "assets/knight_visual.png",
    15,
    "I knight thee, kitt-ee"
  ),
  new Building(
    "Princess",
    50000,
    "assets/princess_building.png",
    "assets/princess_visual.png",
    100,
    "She's in another cat tower"
  ),
];
//define new buildings

for (let i = 0; i < buildingList.length; i++) {
  buildingList[i].createBuilding(buildingList, i);
}
//create building objects in the game for every building in the list

const costumeList = [
  new Wardrobe("yellow", "assets/cat_yellow_costume.png"),
  new Wardrobe("grey", "assets/cat_grey_costume.png"),
  new Wardrobe("white", "assets/cat_white_costume.png"),
  new Wardrobe("royal", "assets/cat_royal_costume.png"),
];
//create cat costumes

for (let i = 0; i < costumeList.length; i++) {
  costumeList[i].createCostume(costumeList, i);
}

function mainLoop() {
  totalCps = 0;
  for (let i = 0; i < buildingList.length; i++) {
    buildingList[i].buildingTick();
    totalCps += buildingList[i].cps * buildingList[i].count;
    updateCoins();
  }
}
//define the main loop of the game which updates the buildings and coins every second

document.addEventListener("DOMContentLoaded", (event) => {
  setInterval(mainLoop, 1000);
});
//run the main loop forever every second
