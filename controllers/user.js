const User = require('../model/user');
const Food = require('../model/food');
const Drink = require('../model/drink');

exports.getUserById = async(req,res) => {
  const { id } = req.params;
  try {
      const user = await User.findById(id)
      res.status(200).json(user);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
};

exports.getUsers = async(req,res) => {
  try {
      const users= await User.find({hasSubmit: false}).sort({ name: -1 });
      res.status(200).json(users);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
};

exports.submitSelection = async (req, res) => {
  const {
    userId,
    name,
    email,
    wa_number,
    food,
    drink,
    url
  } = req.body;

  try {
    const selectedFood = await Food.findOne({name: food})
    const selectedDrink = await Drink.findOne({name: drink})

    if (selectedFood && selectedDrink) {
      await Food.findByIdAndUpdate({ _id: selectedFood._id }, {$push: {selected_by: name}, $inc: {total_selected:1}}, {new: true})
      await Drink.findByIdAndUpdate({ _id: selectedDrink._id }, {$push: {selected_by: name}, $inc: {total_selected:1}}, {new: true})
    }
    if (selectedFood && !selectedDrink) {
      const newDrink = await Drink.create({name: drink, selected_by: [name]} )
      await Food.findByIdAndUpdate({ _id: selectedFood._id }, {$push: {selected_by: name}, $inc: {total_selected:1}}, {new: true})
      await Drink.findByIdAndUpdate({ _id: newDrink._id }, {total_selected: newDrink.selected_by.length}, {new: true})
    }
    if (!selectedFood && selectedDrink) {
      const newFood = await Food.create({name: food, selected_by: [name]} )
      await Food.findByIdAndUpdate({ _id: newFood._id }, { total_selected: newFood.selected_by.length}, {new: true})
      await Drink.findByIdAndUpdate({ _id: selectedDrink._id }, {$push: {selected_by: name}, $inc: {total_selected:1}}, {new: true})
    }
    if (!selectedFood && !selectedDrink) {
      const newFood = await Food.create({name: food, selected_by: [name]} )
      const newDrink = await Drink.create({name: drink, selected_by: [name]} )
      await Food.findByIdAndUpdate({ _id: newFood._id }, { total_selected: newFood.selected_by.length}, {new: true})
      await Drink.findByIdAndUpdate({ _id: newDrink._id }, {total_selected: newDrink.selected_by.length}, {new: true})
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, {foodChoice: food, drinkChoice: drink, hasSubmit: true, url}, {new: true})
    return res.status(200).json(updatedUser)
  } 
  catch (error) {
      res.status(404).json({message: error.message});
      console.log(error)
  }
}