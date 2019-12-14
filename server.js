const express = require('express');
const app = express();
const port = 3000;
const bodyParser=require('body-parser')
const connection = require('./database/connection')
const session = require('express-session');

// models
const Category = require('./categories/Category');
const Article = require('./articles/Article')
const User = require('./users/User');

const usersController= require('./users/UserController');
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
//view engine
app.set('view engine','ejs');

// Sessions

app.use(session({
    secret: "mxsFMF#AGAFO#x2",
    cookie: { maxAge: 30000000 }
}))


//body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('public')); // define a pasta onde estão arquivos estaticos

//database
connection.authenticate().then(()=>{
    console.log('Conexão feita com sucesso!')}).catch((err)=>{
        console.log(err);
    })


// rotas
app.use('/',categoriesController);
app.use('/',articlesController);
app.use('/',usersController);

app.get('/',(req,res)=>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit:4
    
    }).then(articles=>{
        Category.findAll().then((categories)=>{
            res.render("index",{
                articles: articles,
                categories:categories})
        })
        
    })
})

app.get('/:slug',(req,res)=>{
    let slug = req.params.slug;
    Article.findOne({
        where: { 
            slug:slug
        }
    }).then((article)=>{
        if (article!=undefined) {
            Category.findAll().then((categories)=>{
                res.render("article",{
                    article: article,
                    categories:categories})
            })
        } else { 
            res.redirect('/');
        }
    }).catch((err)=> {
        console.log(err);
        res.redirect('/');
    })
})

app.get('/category/:slug',(req,res)=>{
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug:slug
        },
        include : [{model: Article}]
    }).then(category=>{
        if (category!= undefined) { 
            Category.findAll().then(categories=>{
                res.render('index',{
                    articles : category.articles,
                    categories: categories
                })
            })
        } else { 
            res.redirect('/')
        }
    }).catch((err)=>{
        console.log(err);
        res.redirect('/');
    })
})

app.listen(port,()=>{console.log('Server ON!')});