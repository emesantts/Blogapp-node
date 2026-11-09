import passport from 'passport'
import{ Strategy  as localStrategy }from 'passport-local'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

//MOdel de Usuário
import ('../models/Usuario.js')
const Usuario = mongoose.model("usuarios")


const Passport = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField:"senha"},(email, senha, done) => {
       
       Usuario.findOne({email: email}).then((usuario) =>{
        if(!usuario){
            return done (null, false, {message: "Esta conta não existe"})

        }
        bcrypt.compare(senha, usuario.senha , (erro , batem) => {
            if(batem){
                return done(null, usuario)
            }else{
                return done(null, false, {message: "Senha incorreta"})
                }
            
        })
       })

    }))

    passport.serializeUser((usuario , done) => {
        done(null, usuario._id)
    })

   passport.deserializeUser(async (id, done) => {
        try {
            // Atualizado para o formato moderno com .then() em vez de callback
            const usuario = await Usuario.findById(id);
            done(null, usuario);
        } catch (err) {
            done(err, null);
        }
    });
    
}



export default Passport