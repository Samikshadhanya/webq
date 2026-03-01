const supabase = require('../config/supabase');

class QuizController {
  async getQuizzes(req, res, next) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getQuizById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          questions:quiz_questions(*)
        `)
        .eq('quiz_id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async createQuiz(req, res, next) {
    try {
      const { title, description, category, difficulty, timeLimit, questions } = req.body;
      const userId = req.user.id; // Assuming user is authenticated

      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          title,
          description,
          category,
          difficulty,
          time_limit: timeLimit,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw error;

      // Insert questions
      const questionsData = questions.map(q => ({
        quiz_id: data.quiz_id,
        question_text: q.text,
        options: q.options,
        correct_option_ids: q.correctOptionIds
      }));

      const { error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsData);

      if (questionsError) throw questionsError;

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async submitQuiz(req, res, next) {
    try {
      const { id: quizId } = req.params;
      const { responses } = req.body;
      const userId = req.user.id; // Assuming user is authenticated

      // Insert quiz response
      const { data, error } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          responses,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { QuizController };