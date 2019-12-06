import * as Yup from 'yup';

import Student from '../models/Student';
import Enroll from '../models/Enroll';
import HelpOrder from '../models/HelpOrder';

class HelpOrdersController {
  async index(req, res) {
    const questions = await HelpOrder.findAll({
      where: { student_id: req.params.id },
      attributes: ['id', 'question', 'answer', 'answer_at'],
    });

    return res.json(questions);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const studentExists = await Student.findOne({
      where: { id: req.params.id },
    });
    if (!studentExists) {
      return res
        .status(401)
        .json({ error: 'You can only create enrollment if Student exists' });
    }

    const enrollExists = await Enroll.findOne({
      where: { student_id: req.params.id },
    });

    if (!enrollExists) {
      return res.status(401).json({
        error: 'You can only apply for assistance if you are enrolled',
      });
    }

    HelpOrder.create({
      student_id: req.params.id,
      question: req.body.question,
    });

    return res.status(200).json({
      mensagem: 'Sucessfully submitted question ',
    });
  }
}

export default new HelpOrdersController();
