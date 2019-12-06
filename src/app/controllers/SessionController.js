import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    // metodo para criar sessão
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } }); //  recebendo o usuário where email que foi passado

    if (!user) {
      return res.status(401).json({ error: 'User not fround' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ erro: 'Email or Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
