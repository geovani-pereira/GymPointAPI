import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.string().required(),
      peso: Yup.string().required(),
      altura: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    }); // verificando se o usuario ja existe passando como where o email

    if (studentExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      idade: Yup.string(),
      peso: Yup.string(),
      altura: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const student = await Student.findByPk(req.params.id);

    const { id, name, email, idade, peso, altura } = await student.update(
      req.body
    ); // fazendo o update no usuário passando todos os dados do body

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async index(req, res) {
    const students = await Student.findAll();

    return res.json(students);
  }
}

export default new StudentController();
