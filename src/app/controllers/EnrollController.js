import * as Yup from 'yup';
import { parseISO, isBefore, addMonths } from 'date-fns';

import Student from '../models/Student';
import Enroll from '../models/Enroll';
import Plan from '../models/Plan';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const enrollments = await Enroll.findAll({
      order: ['end_date'],
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });
    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const { student_id, start_date, plan_id } = req.body;

    const studentExists = await Student.findOne({
      where: { id: student_id },
    });
    if (!studentExists) {
      return res
        .status(401)
        .json({ error: 'You can only create enrollment if Student exists' });
    }

    const enrollExists = await Enroll.findOne({
      where: { student_id },
    });
    // verificando se a matricula ja existe
    if (enrollExists) {
      return res.status(400).json({ error: 'Enrollment already exists' });
    }
    const startDate = parseISO(start_date);

    if (isBefore(startDate, new Date())) {
      // se a data é antes da hora atual ele não permite
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);

    const endDate = addMonths(startDate, plan.duration);
    const price = plan.duration * plan.price;

    const enroll = await Enroll.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      price,
    });

    const enrollment = await Enroll.findByPk(enroll.id, {
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    await Queue.add(EnrollmentMail.key, {
      enrollment,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { student_id, start_date, plan_id } = req.body;
    const { id } = req.params;

    const enroll = await Enroll.findByPk(id);

    if (!enroll) {
      return res.status(401).json({
        error: 'You can only update enrollment if enrollment exists',
      });
    }

    const enrollUser = await Enroll.findOne({
      where: { student_id },
    });

    if (enrollUser.student_id !== enroll.student_id) {
      return res.status(401).json({
        error:
          'You can only update enrollment if enrollment belongs to the student ',
      });
    }

    const startDate = parseISO(start_date);

    if (isBefore(startDate, new Date())) {
      // se a data é antes da hora atual ele não permite
      return res.status(400).json({ error: 'Past date are not permitted' });
    }

    const plan = await Plan.findByPk(plan_id);

    const endDate = addMonths(startDate, plan.duration);
    const price = plan.duration * plan.price;

    await enroll.update({
      id,
      student_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      price,
    });

    return res.json({
      id,
      student_id,
      start_date,
      plan_id,
      startDate,
      endDate,
      price,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const enroll = await Enroll.findByPk(id);

    if (!enroll) {
      return res.status(400).json({ error: 'Enroll not exists' });
    }

    await enroll.destroy();

    return res.json({ message: 'Matricula deleteda' });
  }
}

export default new EnrollController();
