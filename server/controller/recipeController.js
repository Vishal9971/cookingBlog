require('../../app');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 *GET/
 * HomePage
 */
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const recipes = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thaiRecipes = await Recipe.find({ category: 'Thai' }).limit(limitNumber);
    const americanRecipes = await Recipe.find({ category: 'American' }).limit(limitNumber);
    const chineseRecipes = await Recipe.find({ category: 'Chinese' }).limit(limitNumber);

    res.render('index', {
      title: 'Cooking Blog - Home',
      categories,
      recipes,
      thaiRecipes,
      americanRecipes,
      chineseRecipes,
    });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 *GET/
 * Category Page
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render('categories', { title: 'Cooking Blog - Categories', categories });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 *GET/
 * Recipe Page
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    let recipeItem = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipeItem });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 *GET/
 * Category by id Page
 * Start
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoriesById = await Recipe.find({ category: categoryId }).limit(limitNumber);

    res.render('categories', { title: 'Cooking Blog - Categories', categoriesById });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};
/**
 *GET/
 * Category by id Page
 * End
 */

/**
 *Post/ search
 * Search
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipeItem = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    // res.json(recipeItem);
    res.render('search', { title: 'Cooking Blog - Search', recipeItem });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 *GET/ explore-latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipeItem = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog -Recipe', recipeItem });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};
/**
 *GET/ explore-random
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipeItem = await Recipe.findOne().skip(random).exec();

    res.render('explore-random', { title: 'Cooking Blog -Recipe', recipeItem });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 *GET/ submit-recipe
 */
exports.submitRecipe = async (req, res) => {
  try {
    const infoErrorObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog -Submit Recipe', infoErrorObj , infoSubmitObj });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};
/**
 *POST/ submit-recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploads.')
    }else{
      imageUploadFile=req.files.image;
      newImageName = Date.now()+imageUploadFile.name;
      uploadPath = require('path').resolve('./')+'/public/uploads/'+newImageName;
      imageUploadFile.mv(uploadPath, function(err){
        if(err){
          return res.status(500).send(err);
        }
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.');
    res.redirect('submit-recipe');
  } catch (e) {
    req.flash('infoErrors', e);
    res.redirect('/submit-recipe');
  }
};
