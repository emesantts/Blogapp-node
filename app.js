//Carregando modulos

import express from 'express'
import { engine } from 'express-handlebars'
const app =  express()
import admin from "./routes/admin.js"
import path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'
import session from 'express-session'
import flash from 'connect-flash'
import './models/Postagem.js'
const Postagem = mongoose.model("postagens")
import './models/Categoria.js'
import  usuarios from './routes/usuario.js'
import passport from 'passport';
import auth from './config/auth.js'
auth(passport);

const db = import('./config/db.js')

const Categoria = mongoose.model("categorias")



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Configurações
  //Sessão
  app.use(session({
   secret: "cursodenode",
   resave: true,
   saveUninitialized: true,
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(flash())
  //Middleware
  app.use((req, res, next)=> {
   res.locals.success_msg = req.flash("success_msg")
   res.locals.error_msg = req.flash("error_msg")
   res.locals.error = req.flash("error")
   res.locals.user = req.user || null 
   next()
  })
 //Body Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}))

 //Hadlebars
app.engine('handlebars', engine({
   allowProtoPropertiesByDefault: true
}));

app.set('view engine', 'handlebars');
app.set('views', './views');
 //Mongoose
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/blogapp').then(() =>{
   console.log('conectado ao mongo')
  }).catch((err) =>{
   console.log('Erro ao se conectar:' + err)
  })

  mongoose.connect(db.mongoURI)
  .then(() => {
    console.log("MongoDB conectado com sucesso!");
  })
  .catch((err) => {
    console.log("Erro ao conectar ao MongoDB: " + err);
  });
 //Public
 app.use(express.static(path.join(__dirname, "public")));
//Rotas
   app.get('/',(req, res) => {
      Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
         res.render("index", {postagens: postagens})
      }).catch((err) => {
         req.flash("error_msg", "Houve um error internor")
         res.redirect("/404")
      })
   })

   app.get('/postagem/:slug', (req, res) => {
      Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
         if(postagem){
          res.render("postagem/index",{postagem: postagem} )
         }else{
           req.flash("error_msg" , "Esta postagem não existe")
           res.redirect("/")
         }
      }).catch((err) => {
         req.flash("error_msg", "houve um error inteno")
         res.redirect("/")
      })
   })

   app.get("/categorias",(req, res) => {
        Categoria.find().lean().then((categorias) => {
         res.render("categorias/index", {categorias:categorias})
        }).catch((err) => {
         req.flash("error_msg", "Houve um error interno ao lista as categorias")
         res.redirect("/")
        })
   })

   app.get("/categorias/:slug", (req, res) => {
      Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if(categoria){
        
          Postagem.find({categoria: categoria._id}).lean().then((postagens)=>{
            res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

          }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao lista os posts!")
            res.redirect("/")
          })

        }else{
         req.flash("error_msg", "Esta categoria não  existe")
         res.redirect("/")
        }
      }).catch((err) => {
         req.flash("error_msg","Houve um erro interno ao carregar a página desta categoria")
      })
   })

   app.get("/404" ,(req, res) => {
      res.send("Erro 404!")
   })

   app.use('/admin', admin)
   app.use("/usuarios", usuarios)

   const TesteSchema = new mongoose.Schema({
    mensagem: { type: String }
});
const Teste = mongoose.model('teste', TesteSchema);

// 2. Criando uma rota que tenta salvar algo no banco quando você acessa pelo navegador
app.get("/testar-banco", async (req, res) => {
    try {
        const novoTeste = new Teste({ mensagem: "Conexão funcionando perfeitamente!" });
        await novoTeste.save();
        res.send("SUCESSO! O dado foi salvo no banco de dados.");
    } catch (error) {
        res.send("ERRO ao salvar no banco: " + error.message);
    }
});

//Outros
const  PORT = process.env.PORT || 8081
app.listen(PORT,() => {
 console.log("servidor rodando!" + PORT)
})