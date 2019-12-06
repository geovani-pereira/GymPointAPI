import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { help_order } = data;
    Mail.sendMail({
      to: `${help_order.Student.name}
      <${help_order.Student.email}>`,
      subject: 'Sua pergunta foi respondida GymPoint',
      template: 'answer',
      context: {
        user: help_order.Student.name,
        question: help_order.question,
        answer: help_order.answer,
        answer_at: format(
          parseISO(help_order.answer_at),
          "'Dia' dd 'de' MMMM 'de' yyyy'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new AnswerMail();
