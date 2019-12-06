import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Enroll from '../models/Enroll';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class HelpOrdersGymController {
  async index(req, res) {
    const questions = await HelpOrder.findAll({
      where: { answer: null },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'email', 'idade', 'peso', 'altura'],
        },
      ],
    });

    return res.json(questions);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { answer, id } = req.body;
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

    const questionAvailable = await HelpOrder.findOne({
      where: {
        student_id: req.params.id,
        id,
      },
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!questionAvailable) {
      return res.status(400).json({ error: 'Question not found' });
    }

    const help_order = await questionAvailable.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerMail.key, {
      help_order,
    });

    return res.json(help_order);
  }
}

export default new HelpOrdersGymController();
