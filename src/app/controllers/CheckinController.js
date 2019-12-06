import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;

    const checkin = await Checkin.findAndCountAll({
      where: { student_id: id },
      attributes: ['id', 'created_at'],

      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email', 'idade', 'peso', 'altura'],
        },
      ],
    });
    if (checkin.count < 1) {
      return res.status(400).json({ error: 'Checkin not found' });
    }
    return res.json(checkin);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }
    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
    });
    if (checkins.length > 4) {
      return res.status(400).json({
        error: 'You have exceeded the maximum of Checkins ',
      });
    }
    const checkin = await Checkin.create({
      student_id: req.params.id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
