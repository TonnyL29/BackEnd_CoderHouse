import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import userModel from '../models/user.model.js';
import { hashPassword, validPassword } from '../Utilities/utilities.js';

const opts = {
    usernameField: 'email',
    passReqToCallback: true,
};

const githubOpts = {
  clientID: 'Iv1.96ac2683fd89f417', // Este dato debe ser pasado por parametro
  clientSecret: '71b809c30ab9d7137bdfa009936e43b5d98bdb7d', // Este dato debe ser pasado por parametro
  callbackURL: "http://localhost:8080/api/sessions/github_callback", // Este dato debe ser pasado por parametro
};

export const init = () => {
    passport.use('register', new LocalStrategy(opts, async (req, email, password, done) => {
        try {
            const { username, email, name, lastname, password  } = req.body;
            const user = await userModel.findOne({ email });
            if (user) {
                return done(null, false, { message: 'Usuario ya registrado' });
            }

            if (!name || !lastname || !email || !password | !username) {
                return done(null, false, { message: 'Todos los campos son obligatorios' });
            }
            const hashedPassword = await hashPassword(password);
            const newUser = await userModel.create({ username, email, name, lastname, password: hashedPassword, });

            done(null, newUser);
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));

    passport.use('login', new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        //console.log(email)
        const user = await userModel.findOne({ email });
        //console.log("user: "+user)
        if (!user) {
          return done(new Error('Correo o contraseña invalidos 😨'));
        }

        const isPassValid  = await validPassword(password, user);
        if (!isPassValid ) {
          return done(new Error('Correo o contraseña invalidos 😨'));
        }
        console.log('Here');
        return done(null, user, { redirect: '/private', status: user.status });
      } catch (error) {
        done(new Error(`Ocurrio un error durante la autenticacion ${error.message} 😨.`));
      }
    }));


    passport.use('github', new GithubStrategy(githubOpts, async (accessToken, refreshToken, profile, done) => {
      console.log('profile', profile);
      let email = profile._json.html_url;
      let user = await userModel.findOne({ email });
      if (user) {
        return done(null, user);
      }
      user = {
        username: profile._json.login,
        name: profile._json.name,
        lastname: '',
        email: profile._json.html_url,
        password: '',
        provider: 'Github',
      };
  
      const newUser = await userModel.create(user);
      done(null, newUser);
    }));

      passport.serializeUser((user, done) => {
        done(null, user);
      });
    
      passport.deserializeUser(async (uid, done) => {
        const user = await userModel.findById(uid);
        done(null, user);
      });
};
