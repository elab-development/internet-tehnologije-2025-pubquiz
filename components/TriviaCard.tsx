'use client';
import { useState, useEffect } from 'react';

export default function TriviaCard() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState<number | null>(null);

  const fetchTrivia = async () => {
    setLoading(true);
    setRevealed(null);
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=3&category=9&type=multiple');
      const data = await res.json();
      const formatted = data.results.map((q: any) => ({
        question: q.question,
        correct: q.correct_answer,
        answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
      }));
      setQuestions(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrivia(); }, []);

  return (
    <div className="bg-neutral-950/30 border border-neutral-800 rounded-3xl p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
          Trivia Warm-up
        </h2>
        <button 
          onClick={fetchTrivia}
          disabled={loading}
          className="text-xs  border border-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded-full transition-all"
        >
          New questions
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={idx} className="border-b border-neutral-800 pb-4 last:border-0">
            <p className="text-sm text-white mb-3" dangerouslySetInnerHTML={{ __html: q.question }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
              {q.answers.map((a: string) => (
                <button
                  key={a}
                  onClick={() => setRevealed(idx)}
                  className={`text-[11px] p-2 rounded-lg border transition-all ${
                    revealed === idx && a === q.correct 
                      ? 'border-green-500 bg-green-500/20 text-green-400' 
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600 text-neutral-400'
                  }`}
                  dangerouslySetInnerHTML={{ __html: a }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}