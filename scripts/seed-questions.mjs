import mongoose from 'mongoose';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/estier';

const QuestionSchema = new mongoose.Schema({
  type: String,
  prompt: String,
  options: [String],
  answer: mongoose.Schema.Types.Mixed,
  difficulty: String,
  tags: [String],
  source: String,
  explanation: String,
  isBonus: Boolean,
  isActive: Boolean,
}, { timestamps: true });

async function seedQuestions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    const questions = [
      {
        type: 'mcq',
        prompt: 'Which Indian rapper released the album Yours Truly?',
        options: ['KRSNA', 'DIVINE', 'Naezy', 'Prabh Deep'],
        answer: 'KRSNA',
        difficulty: 'medium',
        tags: ['artist', 'album'],
        explanation: 'KRSNA released the album "Yours Truly" with Mass Appeal Records.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: "Which Mumbai-based rapper is widely credited with breaking Desi rap into mainstream with the track 'Mere Gully Mein' (as part of a collaboration)?",
        options: ['DIVINE', 'Seedhe Maut', 'Raja Kumari', 'Naezy'],
        answer: 'DIVINE',
        difficulty: 'easy',
        tags: ['artist', 'song', 'mainstream'],
        explanation: 'DIVINE, along with Naezy, created "Mere Gully Mein" which became a mainstream hit.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'true_false',
        prompt: 'The group Seedhe Maut is from New Delhi.',
        answer: 'True',
        difficulty: 'easy',
        tags: ['group', 'origin'],
        explanation: 'Seedhe Maut is indeed a Delhi-based hip-hop duo.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'short_answer',
        prompt: 'Name the producer known for collaborating with many Desi hip-hop artists and co-producing tracks on early Mumbai rap records (one-word answer).',
        answer: ['Sez', 'Sez on the Beat'],
        difficulty: 'medium',
        tags: ['producer'],
        explanation: 'Sez on the Beat is a prominent producer in the Desi hip-hop scene.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: 'Which artist teamed up with DIVINE to form the Mumbai hip-hop collective that produced the soundtrack for a major Bollywood film?',
        options: ['Naezy', 'Ankur Tewari', 'Emiway', 'Vivek-Mervin'],
        answer: 'Naezy',
        difficulty: 'medium',
        tags: ['collective', 'collab'],
        explanation: 'DIVINE and Naezy collaborated on tracks that became part of the Gully Boy soundtrack.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: 'Which of these is NOT primarily a Desi hip-hop artist?',
        options: ['Badshah', 'KRSNA', 'Prabh Deep', 'Seedhe Maut'],
        answer: 'Badshah',
        difficulty: 'easy',
        tags: ['genre', 'artist'],
        explanation: 'Badshah is more of a commercial pop-rap artist rather than traditional hip-hop.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'short_answer',
        prompt: "Which Delhi rapper is known for the song 'Mere Gully Mein' (one-word artist name)?",
        answer: 'Naezy',
        difficulty: 'easy',
        tags: ['artist', 'song'],
        explanation: 'Naezy, along with DIVINE, created "Mere Gully Mein".',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'true_false',
        prompt: 'Rap beefs have been a visible part of Desi hip-hop culture.',
        answer: 'True',
        difficulty: 'easy',
        tags: ['culture', 'beef'],
        explanation: 'Rap beefs and diss tracks are indeed a significant part of Desi hip-hop culture.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: "Which artist's lyrical style is often described as dense, cerebral, and politically charged — known for projects like 'KOHINOOR'?",
        options: ['Prabh Deep', 'DIVINE', 'KRSNA', 'Brodha V'],
        answer: 'Prabh Deep',
        difficulty: 'medium',
        tags: ['style', 'album'],
        explanation: 'Prabh Deep is known for his politically conscious and introspective lyrics.',
        isBonus: true,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: 'Which producer/beatmaker is often cited in the scene for atmospheric, lo-fi influenced beats and worked with artists like Prabh Deep?',
        options: ['Sez on the Beat', 'Sikander Kahlon', "Jatinder 'Jazzy' Singh", 'Karan Kanchan'],
        answer: 'Sez on the Beat',
        difficulty: 'medium',
        tags: ['producer'],
        explanation: 'Sez on the Beat is known for his atmospheric production style.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'short_answer',
        prompt: "Name the Delhi duo famous for aggressive delivery and tracks like 'Bhokali' (two-word act name).",
        answer: 'Seedhe Maut',
        difficulty: 'medium',
        tags: ['group'],
        explanation: 'Seedhe Maut is a Delhi-based duo known for their aggressive style.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: 'Which platform helped Desi hip-hop gain viral traction in India in the mid-2010s?',
        options: ['YouTube', 'MySpace', 'Vine', 'Napster'],
        answer: 'YouTube',
        difficulty: 'easy',
        tags: ['platform', 'history'],
        explanation: 'YouTube was instrumental in popularizing Desi hip-hop in India.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: 'Which artist is known for blending rap and folk influences and is from Bengaluru?',
        options: ['Brodha V', 'DIVINE', 'Naezy', 'Prabh Deep'],
        answer: 'Brodha V',
        difficulty: 'medium',
        tags: ['artist', 'style', 'region'],
        explanation: 'Brodha V from Bengaluru is known for his unique blend of rap and folk elements.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'true_false',
        prompt: "A 'cypher' is a common format in hip-hop where multiple rappers freestyle in sequence.",
        answer: 'True',
        difficulty: 'easy',
        tags: ['terminology'],
        explanation: 'Cyphers are collaborative freestyle sessions common in hip-hop culture.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: "Who released the widely-discussed project titled 'Yours Truly' (album) — choose the rapper known for punch-heavy bars and frequent social commentary.",
        options: ['KRSNA', 'DIVINE', 'Prabh Deep', 'Naezy'],
        answer: 'KRSNA',
        difficulty: 'medium',
        tags: ['artist', 'album'],
        explanation: 'KRSNA released "Yours Truly" and is known for his lyrical prowess.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'short_answer',
        prompt: "Which Mumbai rapper's story was central to the movie 'Gully Boy' inspiration (single-word artist name)?",
        answer: ['DIVINE', 'Naezy'],
        difficulty: 'medium',
        tags: ['film', 'inspiration'],
        explanation: 'Both DIVINE and Naezy\'s stories inspired the movie Gully Boy.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: 'Which duo is often associated with gritty Delhi street rap and DIY aesthetics?',
        options: ['Seedhe Maut', 'Brodha V', 'DIVINE', 'Badshah'],
        answer: 'Seedhe Maut',
        difficulty: 'medium',
        tags: ['scene', 'aesthetic'],
        explanation: 'Seedhe Maut is known for their raw, DIY approach to Delhi street rap.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'true_false',
        prompt: "'Beatmakers' in the scene are only responsible for instrumentals and never take producer credits on songs.",
        answer: 'False',
        difficulty: 'easy',
        tags: ['producer', 'industry'],
        explanation: 'Beatmakers often receive producer credits and are involved in the creative process.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'mcq',
        prompt: 'Which of these is commonly used in Desi hip-hop lyrics as a theme?',
        options: ['class struggle', 'space travel', 'medieval legends', 'deep-sea fishing'],
        answer: 'class struggle',
        difficulty: 'easy',
        tags: ['theme', 'lyrics'],
        explanation: 'Class struggle and social issues are common themes in Desi hip-hop.',
        isBonus: false,
        isActive: true,
      },
      {
        type: 'short_answer',
        prompt: 'Name one online platform or format where Desi hip-hop artists commonly release freestyles or cyphers (two-word answer acceptable).',
        answer: ['YouTube', 'SoundCloud', 'Instagram Reels', 'Instagram'],
        difficulty: 'easy',
        tags: ['platform', 'format'],
        explanation: 'Multiple platforms are used, including YouTube, SoundCloud, and Instagram.',
        isBonus: false,
        isActive: true,
      },
    ];

    await Question.insertMany(questions);
    console.log(`✓ Created ${questions.length} quiz questions`);

    console.log('\n✅ Quiz questions seeded successfully!\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedQuestions();

