import express from 'express'
const router = express.Router()
import mongoose from 'mongoose'
import '../models/Categoria.js'
const  Categoria = mongoose.model("categorias")
import '../models/Postagem.js'
import { eAdmin } from '../helpers/eAdmin.js'
const Postagem = mongoose.model("postagens")
import  ('../helpers/eAdmin.js')

router.get('/', eAdmin, (req,res) =>{
 res.render("admin/index")
})


router.get('/posts', (req,res) =>{
 res.send("Pagina de posts")
})


router.get('/categorias', eAdmin, (req,res) =>{
    Categoria.find().lean().then((categorias) =>{
        res.render('admin/categorias' , {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.post('/categorias/nova', eAdmin, (req, res) =>{

    let erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({texto: "nome Invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
     erros.push({texto: "Slug Inválido"})
    }
     
    if(req.body.nome.length < 2 ){
     erros.push({texto: "Nome da categoria é muito pequeno"})
    }
    
    if(erros.length > 0){
     res.render("admin/addcategorias", eAdmin, {erros: erros})
    }else{

        const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new  Categoria(novaCategoria).save().then(() => {
     req.flash('success_msg', "Categoria registrada com sucesso!")
     res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao salvar a categoria, tente novamente!")
        res.redirect("/admin")
    })
    }

})

  router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria:categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
  })

  router.post("/categorias/edit", eAdmin, (req, res) => {

     Categoria.findOne({_id: req.body.id}).then((categoria) => {
      
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg" , "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg","Houve um erro interno ao salvar a edição da categoria ")
            res.redirect("/admin/categorias")
            
        })

     }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
     })

  })



router.get('/categorias/add',eAdmin, (req , res) => {
    res.render('admin/addcategorias')
})
 router.post("/categorias/deletar", (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria  deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar")
        res.redirect("/admin/categorias")
    })
  })


router.get("/postagens",eAdmin, (req, res) => {

    Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
})

router.get("/postagens/add",eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
      res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash('erro_msg', "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova",eAdmin, (req , res) => {
   
    let erros = []

    if(req.body.categoria ==  "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }

    if(erros.length > 0) {
        res.render("admin/addpostagem", {erros: erros})
    }else{
     const novaPostagem = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria,
        slug: req.body.slug
    }

     new Postagem(novaPostagem).save().then(() => {
        req.flash("success_msg", "Postagem criada com sucesso!")
        res.redirect("/admin/postagens")
     }).catch((err) => {
        req.flash("error_msg", "Houve um erro durante o salvamento da Postagem")
        res.redirect("/admin/postagens")
     })

    }

})

router.get("/postagens/edit/:id",eAdmin, (req, res) => {

   Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
       
      Categoria.find().lean().then((categorias) => {
        res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})

      }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao lista as categorias")
        res.redirect("/admin/postagens")
      })

   }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
    res.redirect("/admin/postagens")
   })

})

router.post("/postagem/edit",eAdmin, (req, res) => {

     Postagem.findOne({_id: req.body.id}).then((postagem) => {

         postagem.titulo = req.body.titulo;
         postagem.slug = req.body.slug;
         postagem.descricao = req.body.descricao;
         postagem.conteudo = req.body.conteudo;
         postagem.categoria = req.body.categoria

       new Post ( postagem).save().then(() => {
            req.flash("success_msg" ,"Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
         }).catch((err) => {
            
            req.flash("error_msg", "Error interno")
            res.redirect("/admin/postagens")
         })

     }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a ediçãp")
        res.redirect("/admin/postagens")
     })
})


router.get("/postagens/deletar/:id",eAdmin, (req, res) => {
    Postagem.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Postagem  deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro Interno")
        res.redirect("/admin/postagens")
    })
})

export default router