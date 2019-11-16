const express = require('express')
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('../articles/Article')
const slugify = require('slugify')

router.get('/admin/articles',(req,res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then((articles)=>{
        res.render('admin/articles/index',{articles:articles})
    })
})

router.get('/admin/articles/new',(req,res)=>{
    Category.findAll().then((categories)=>{
        res.render('admin/articles/new',{categories:categories})
    })
    
})

router.post('/articles/save',(req,res)=>{
    let title = req.body.title
    let body = req.body.body
    var category= req.body.category
    console.log(category)
    
    Article.create({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId: category
    }
).then(()=>{
    res.redirect('/admin/articles')
}) })

router.post('/articles/delete',(req,res)=>{
    var id = req.body.id 
    if ((id!=undefined) && (!isNaN(id))) {
        Article.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect('/admin/articles')
        })
    } else { 
        res.redirect('/admin/articles')
    }
})

router.post('/articles/update',(req,res)=>{
    let body = req.body.body;
    let title = req.body.title
    let id = req.body.id;
    Article.update({body:body,title:title},{where:{id:id}}).then(()=>{
        res.redirect('/admin/articles')
    })
})

router.get('/admin/articles/edit/:id',(req,res)=>{
    let id = req.params.id
    
    Article.findByPk(id).then((article)=>{
        
        if (article!=undefined && !isNaN(id)) { 
            Category.findAll().then((categories)=>{
                res.render('admin/articles/edit',{article:article,categories:categories})
            })
            
        } else { 
            res.redirect('/admin/articles')
        }
    }).catch(err => {
        console.log(err)
        res.redirect('/admin/articles');
    })
    


})

module.exports=router