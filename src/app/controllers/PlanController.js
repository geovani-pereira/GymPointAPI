import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    }); // verificando se o usuario ja existe passando como where o email
    if (planExists) {
      return res.status(400).json({ error: 'This plan already exists' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const plan = await Plan.findByPk(req.params.id);

    const { id, title, duration, price } = await plan.update(req.body); // fazendo o update no usuário passando todos os dados do body

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plan = await Plan.findAll();

    return res.json(plan);
  }
}

export default new PlanController();
