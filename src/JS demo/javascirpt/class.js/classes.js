class House{
constructor(color, bedrooms) {
this.color = color, 
this.bedrooms = bedrooms
}
static addHouse(color, bedrooms){
    color : color = prompt('Enter Color');
    bedrooms : bedrooms = prompt('Enter Bedrooms'); 
    return new House(color, bedrooms)
}
}

console.log(House.addHouse())