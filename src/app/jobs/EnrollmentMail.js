import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment } = data;
    Mail.sendMail({
      to: `${enrollment.Student.name}
      <${enrollment.Student.email}>`,
      subject: 'Matricula Efetuada GymPoint',
      template: 'enrollment',
      context: {
        user: enrollment.Student.name,
        plan: enrollment.Plan.title,
        total: enrollment.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        duration: `${enrollment.Plan.duration}`,
        permonth: enrollment.Plan.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        end: format(
          parseISO(enrollment.end_date),
          "'dia' dd 'de' MMMM 'de' yyyy'",
          {
            locale: pt,
          }
        ),
        start: format(
          parseISO(enrollment.start_date),
          "'dia' dd 'de' MMMM 'de' yyyy'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new EnrollmentMail();
