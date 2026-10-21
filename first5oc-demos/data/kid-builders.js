/* Kid Builders — SAMPLE DATA (illustrative)
   Every activity below is placeholder content written for this proposal demo.
   Replace with real Kid Builders content from First 5 OC before production.
   Spanish and Vietnamese entries need review by native speakers / community partners. */
window.F5_DATA = window.F5_DATA || {};
window.F5_DATA.kidBuilders = {
  taxonomy: {
    ages: [
      { id: 0, label: 'Under 1' },
      { id: 1, label: '1 year' },
      { id: 2, label: '2 years' },
      { id: 3, label: '3 years' },
      { id: 4, label: '4 years' },
      { id: 5, label: '5 years' }
    ],
    areas: [
      { id: 'language', label: 'Talking & Language', icon: '💬' },
      { id: 'movement', label: 'Moving & Body', icon: '🤸' },
      { id: 'thinking', label: 'Thinking & Problem Solving', icon: '🧩' },
      { id: 'social', label: 'Feelings & Friends', icon: '💛' }
    ],
    seasons: [
      { id: 'any', label: 'Any time' },
      { id: 'spring', label: 'Spring' },
      { id: 'summer', label: 'Summer' },
      { id: 'fall', label: 'Fall' },
      { id: 'winter', label: 'Winter' }
    ],
    types: [
      { id: 'game', label: 'Game' },
      { id: 'song', label: 'Song & Rhyme' },
      { id: 'reading', label: 'Reading & Stories' },
      { id: 'outdoor', label: 'Outdoor' },
      { id: 'art', label: 'Art & Crafts' },
      { id: 'kitchen', label: 'Kitchen & Everyday' },
      { id: 'video', label: 'Video' }
    ],
    languages: [
      { id: 'en', label: 'English' },
      { id: 'es', label: 'Español' },
      { id: 'vi', label: 'Tiếng Việt' }
    ]
  },

  activities: [
    {
      id: 'serve-and-return',
      title: 'Talk-Back Turns',
      summary: 'A short video showing how to answer your baby’s coos and babbles like a real conversation.',
      ages: [0, 1], areas: ['language', 'social'], seasons: ['any'], type: 'video', language: 'en',
      speechVideo: true, minutes: 3,
      materials: ['Just you and your baby'],
      steps: ['Watch for your baby to make a sound or look at something.', 'Respond — copy the sound, smile, or name what they see.', 'Pause and wait. Give your baby time to “answer” back.', 'Keep the back-and-forth going for a few turns.'],
      why: 'Back-and-forth “conversations” build the brain connections that support language long before first words.'
    },
    {
      id: 'mealtime-naming',
      title: 'The Naming Game at Mealtime',
      summary: 'Speech-support video: turn snack time into word time by naming foods, colors and actions.',
      ages: [1, 2], areas: ['language'], seasons: ['any'], type: 'video', language: 'en',
      speechVideo: true, minutes: 4,
      materials: ['Any meal or snack'],
      steps: ['Name each food as you set it down: “Banana. Yellow banana.”', 'Describe actions: “You’re biting. Crunch!”', 'Offer a choice so your child can point or say a word.', 'Repeat and add one word to whatever your child says.'],
      why: 'Hearing the same words in everyday routines helps toddlers learn and use new vocabulary.'
    },
    {
      id: 'two-word-stretch',
      title: 'Stretch It Out: From One Word to Two',
      summary: 'Speech-support video showing how to gently add words to what your child already says.',
      ages: [1, 2, 3], areas: ['language'], seasons: ['any'], type: 'video', language: 'en',
      speechVideo: true, minutes: 5,
      materials: ['Favorite toys'],
      steps: ['Listen for a single word, like “car.”', 'Repeat it and add one more word: “Blue car!”', 'Don’t ask your child to repeat — just model it.', 'Try again with a new toy or moment.'],
      why: 'Modeling slightly longer phrases helps children build sentences without pressure.'
    },
    {
      id: 'hablemos-bano',
      title: 'Hablemos durante el baño',
      subtitle: 'Let’s Talk at Bath Time',
      summary: 'Video de apoyo al habla: nombre partes del cuerpo y acciones mientras su hijo se baña.',
      ages: [0, 1, 2], areas: ['language', 'movement'], seasons: ['any'], type: 'video', language: 'es',
      speechVideo: true, minutes: 4,
      materials: ['Hora del baño', 'Juguetes de agua'],
      steps: ['Nombre cada parte del cuerpo mientras la lava: “Lavamos tu mano.”', 'Cante una canción corta mientras echa agua.', 'Haga pausas para que su bebé responda con sonidos o palabras.'],
      why: 'Hablar en su idioma de casa construye una base fuerte para aprender cualquier idioma.',
      cultural: 'Families are encouraged to use the language they are most comfortable speaking at home.'
    },
    {
      id: 'con-co-be-be',
      title: 'Hát “Con Cò Bé Bé”',
      subtitle: 'Sing “Little Stork”',
      summary: 'Hát bài đồng dao quen thuộc và cùng bé làm động tác vỗ cánh như con cò.',
      ages: [1, 2, 3], areas: ['language', 'movement'], seasons: ['any'], type: 'song', language: 'vi',
      speechVideo: false, minutes: 5,
      materials: ['Không cần dụng cụ'],
      steps: ['Hát chậm rãi từng câu cho bé nghe.', 'Dang tay vỗ cánh như con cò.', 'Dừng lại giữa câu để bé hát tiếp từ cuối.'],
      why: 'Bài hát có vần điệu giúp trẻ nghe được âm thanh của ngôn ngữ và nhớ từ mới.',
      cultural: 'A traditional Vietnamese children’s song many grandparents know — a great way to bring generations together.'
    },
    {
      id: 'keo-cua-lua-xe',
      title: 'Kéo Cưa Lừa Xẻ',
      subtitle: 'See-Saw Rhyme for Babies',
      summary: 'Ngồi đối diện, nắm tay bé và đung đưa qua lại theo nhịp bài đồng dao.',
      ages: [0, 1, 2], areas: ['movement', 'social', 'language'], seasons: ['any'], type: 'song', language: 'vi',
      speechVideo: true, minutes: 5,
      materials: ['Không cần dụng cụ'],
      steps: ['Đặt bé ngồi trên đùi hoặc đối diện bạn.', 'Nắm hai tay bé và đung đưa nhẹ nhàng tới lui.', 'Đọc bài đồng dao theo nhịp, nhấn mạnh từ cuối mỗi câu.'],
      why: 'Nhịp điệu và chuyển động cùng nhau giúp bé gắn kết và phát triển khả năng nghe.',
      cultural: 'A rhythm game passed down in many Vietnamese families. Video shows a caregiver modeling the rhyme slowly.'
    },
    {
      id: 'trung-thu-lantern',
      title: 'Làm Lồng Đèn Trung Thu',
      subtitle: 'Mid-Autumn Paper Lantern',
      summary: 'Cùng bé làm lồng đèn giấy đơn giản để đón Tết Trung Thu.',
      ages: [3, 4, 5], areas: ['thinking', 'movement'], seasons: ['fall'], type: 'art', language: 'vi',
      speechVideo: false, minutes: 20,
      materials: ['Giấy màu', 'Kéo an toàn cho trẻ', 'Băng keo', 'Bút màu'],
      steps: ['Gấp đôi tờ giấy theo chiều dài.', 'Giúp bé cắt các đường thẳng từ mép gấp.', 'Mở ra, cuộn tròn và dán lại thành lồng đèn.', 'Trang trí bằng bút màu và kể cho bé nghe về Trung Thu.'],
      why: 'Cắt, gấp và dán giúp phát triển cơ tay nhỏ, đồng thời kết nối bé với truyền thống gia đình.',
      cultural: 'Tết Trung Thu (Mid-Autumn Festival) is celebrated by many Vietnamese American families in Orange County.'
    },
    {
      id: 'los-pollitos',
      title: '“Los Pollitos Dicen”',
      subtitle: 'The Little Chicks Say',
      summary: 'Cante esta canción clásica y use las manos para mostrar a los pollitos y a la gallina.',
      ages: [0, 1, 2, 3], areas: ['language', 'social'], seasons: ['any'], type: 'song', language: 'es',
      speechVideo: false, minutes: 5,
      materials: ['No se necesita nada'],
      steps: ['Cante despacio y con mucha expresión.', 'Abra y cierre la mano como un pico: “pío, pío, pío.”', 'Abrace a su hijo cuando la gallina “busca el maíz y el trigo.”'],
      why: 'Las canciones con gestos ayudan a los niños a conectar palabras con significados.',
      cultural: 'A song known across many Latin American countries — ask relatives to share their version.'
    },
    {
      id: 'loteria-animales',
      title: 'Lotería de animales',
      subtitle: 'Animal Lotería',
      summary: 'Juegue una versión sencilla de lotería con dibujos de animales para practicar palabras y turnos.',
      ages: [3, 4, 5], areas: ['thinking', 'language', 'social'], seasons: ['any'], type: 'game', language: 'es',
      speechVideo: false, minutes: 15,
      materials: ['Tarjetas de lotería (imprimibles)', 'Frijoles o botones como fichas'],
      steps: ['Reparta una tabla a cada jugador.', 'Saque una carta y diga el nombre del animal con un sonido.', 'Los niños buscan y marcan el animal con un frijol.', '¡Gana quien llene una fila primero!'],
      why: 'Esperar turnos, escuchar y emparejar imágenes fortalecen la atención y la memoria.',
      cultural: 'Inspired by lotería, a game many Mexican and Mexican American families play together.'
    },
    {
      id: 'arroz-con-leche',
      title: 'Cocinemos: arroz con leche',
      subtitle: 'Let’s Cook: Rice Pudding',
      summary: 'Los niños ayudan a medir, mezclar y contar mientras preparan un postre familiar.',
      ages: [3, 4, 5], areas: ['thinking', 'language'], seasons: ['winter', 'fall'], type: 'kitchen', language: 'es',
      speechVideo: false, minutes: 30,
      materials: ['Arroz', 'Leche', 'Canela', 'Tazas de medir'],
      steps: ['Deje que su hijo cuente las tazas de arroz.', 'Hablen sobre cómo cambia el arroz al cocinarse.', 'Su hijo puede espolvorear la canela (¡con supervisión!).'],
      why: 'Cocinar juntos enseña números, palabras nuevas y paciencia.'
    },
    {
      id: 'tummy-time-mirror',
      title: 'Tummy Time Mirror Play',
      summary: 'Place a baby-safe mirror in front of your baby during tummy time to encourage lifting and looking.',
      ages: [0], areas: ['movement', 'social'], seasons: ['any'], type: 'game', language: 'en',
      speechVideo: false, minutes: 5,
      materials: ['Baby-safe mirror', 'Soft blanket'],
      steps: ['Lay your baby on their tummy on a blanket.', 'Set the mirror just in front of them.', 'Talk about the face they see: “Who’s that? It’s you!”', 'Stop when your baby gets tired — a few minutes is plenty.'],
      why: 'Tummy time builds neck and shoulder strength needed for rolling, sitting and crawling.'
    },
    {
      id: 'peekaboo-scarf',
      title: 'Peekaboo Scarf',
      summary: 'Hide your face or a toy under a light scarf and let your baby discover it again.',
      ages: [0, 1], areas: ['thinking', 'social'], seasons: ['any'], type: 'game', language: 'en',
      speechVideo: false, minutes: 5,
      materials: ['Light scarf or cloth'],
      steps: ['Cover a toy with the scarf while your baby watches.', 'Ask, “Where did it go?”', 'Lift the scarf: “There it is!”', 'Let your baby try pulling the scarf off.'],
      why: 'Peekaboo teaches that things still exist when hidden — a big thinking milestone.'
    },
    {
      id: 'sidewalk-chalk-shapes',
      title: 'Sidewalk Chalk Shape Hop',
      summary: 'Draw big shapes outside and call out which one to jump to.',
      ages: [3, 4, 5], areas: ['movement', 'thinking'], seasons: ['spring', 'summer'], type: 'outdoor', language: 'en',
      speechVideo: false, minutes: 15,
      materials: ['Sidewalk chalk'],
      steps: ['Draw a circle, square, triangle and star.', 'Call out a shape and have your child hop to it.', 'Add colors: “Hop to the blue triangle!”', 'Let your child be the caller.'],
      why: 'Jumping builds balance, and following directions builds listening and shape recognition.'
    },
    {
      id: 'leaf-sort',
      title: 'Leaf Sorting Walk',
      summary: 'Collect leaves on a walk, then sort them by size, color or shape.',
      ages: [2, 3, 4, 5], areas: ['thinking', 'language'], seasons: ['fall'], type: 'outdoor', language: 'en',
      speechVideo: false, minutes: 20,
      materials: ['A bag for collecting', 'Leaves from a park or yard'],
      steps: ['Collect 8–10 leaves together.', 'At home, sort them into piles: big and small, or by color.', 'Count each pile.', 'Use describing words: crunchy, smooth, pointy.'],
      why: 'Sorting and comparing are early math skills, and describing builds vocabulary.'
    },
    {
      id: 'water-play-pour',
      title: 'Backyard Pouring Station',
      summary: 'Cups, spoons and a tub of water make a simple science lab on a warm day.',
      ages: [1, 2, 3], areas: ['thinking', 'movement'], seasons: ['summer'], type: 'outdoor', language: 'en',
      speechVideo: false, minutes: 20,
      materials: ['Shallow tub of water', 'Cups and spoons of different sizes'],
      steps: ['Always stay within arm’s reach near water.', 'Show your child how to pour from one cup to another.', 'Talk about full, empty, more and less.'],
      why: 'Pouring builds hand control and introduces early ideas about measurement.'
    },
    {
      id: 'feelings-faces',
      title: 'Feelings Faces',
      summary: 'Make happy, sad, surprised and mad faces together in the mirror and name each feeling.',
      ages: [2, 3, 4], areas: ['social', 'language'], seasons: ['any'], type: 'game', language: 'en',
      speechVideo: false, minutes: 10,
      materials: ['Mirror (optional)'],
      steps: ['Make a feeling face and name it.', 'Ask your child to copy you.', 'Talk about a time you felt that way.', 'Switch — let your child make a face for you to guess.'],
      why: 'Naming feelings is the first step toward managing them.'
    },
    {
      id: 'story-retell',
      title: 'Tell It Back With Toys',
      summary: 'After reading a favorite book, act out the story with stuffed animals or toys.',
      ages: [3, 4, 5], areas: ['language', 'thinking'], seasons: ['any'], type: 'reading', language: 'en',
      speechVideo: false, minutes: 15,
      materials: ['A picture book', 'Toys or stuffed animals'],
      steps: ['Read the book together.', 'Ask, “What happened first?”', 'Use toys to act out the beginning, middle and end.', 'Let your child change the ending!'],
      why: 'Retelling builds memory, sequencing and storytelling — key early literacy skills.'
    },
    {
      id: 'library-lap-read',
      title: 'Lap Reading: Point and Name',
      summary: 'Snuggle up with a board book and point to pictures while you name them.',
      ages: [0, 1, 2], areas: ['language', 'social'], seasons: ['any'], type: 'reading', language: 'en',
      speechVideo: false, minutes: 10,
      materials: ['Board book'],
      steps: ['Hold your child on your lap.', 'Point to a picture and name it.', 'Pause so your child can point too.', 'It’s OK to skip words — follow their interest.'],
      why: 'Reading together every day is one of the strongest predictors of later reading success.'
    },
    {
      id: 'sound-hunt',
      title: 'Sound Hunt',
      summary: 'Speech-support video: go on a walk and listen for animal, car and nature sounds, then copy them.',
      ages: [1, 2, 3], areas: ['language', 'thinking'], seasons: ['spring', 'summer', 'fall'], type: 'video', language: 'en',
      speechVideo: true, minutes: 4,
      materials: ['A short walk'],
      steps: ['Stop and say, “Listen! What do you hear?”', 'Name the sound: “A dog! Woof woof.”', 'Encourage your child to copy the sound.'],
      why: 'Copying sounds strengthens the mouth movements children use for speech.'
    },
    {
      id: 'cuentos-abuela',
      title: 'Cuentos con la abuela',
      subtitle: 'Stories with Grandma',
      summary: 'Invite a grandparent to tell a story from when they were little — no book needed.',
      ages: [2, 3, 4, 5], areas: ['language', 'social'], seasons: ['any'], type: 'reading', language: 'es',
      speechVideo: false, minutes: 15,
      materials: ['Un abuelo o familiar'],
      steps: ['Pida a un familiar que cuente un recuerdo de su niñez.', 'Anime a su hijo a hacer preguntas.', 'Después, dibujen juntos una parte del cuento.'],
      why: 'Las historias familiares fortalecen el idioma y la identidad cultural.'
    },
    {
      id: 'dance-freeze',
      title: 'Dance and Freeze',
      summary: 'Play music, dance, and freeze when the music stops. Great for rainy days.',
      ages: [2, 3, 4, 5], areas: ['movement', 'social'], seasons: ['winter', 'any'], type: 'game', language: 'en',
      speechVideo: false, minutes: 10,
      materials: ['Music from a phone or radio'],
      steps: ['Start the music and dance together.', 'Pause the music — everyone freezes!', 'Try freezing in funny shapes.'],
      why: 'Stopping and starting on cue builds self-control, an important school-readiness skill.'
    },
    {
      id: 'counting-fruit-vi',
      title: 'Đếm Trái Cây',
      subtitle: 'Counting Fruit',
      summary: 'Cùng bé đếm trái cây khi đi chợ hoặc khi chuẩn bị bữa ăn.',
      ages: [2, 3, 4], areas: ['thinking', 'language'], seasons: ['any'], type: 'kitchen', language: 'vi',
      speechVideo: false, minutes: 10,
      materials: ['Trái cây trong nhà'],
      steps: ['Xếp trái cây thành hàng.', 'Đếm to từng trái cùng bé.', 'Hỏi bé: “Trái nào to hơn? Trái nào màu đỏ?”'],
      why: 'Đếm đồ vật thật giúp trẻ hiểu ý nghĩa của con số.'
    },
    {
      id: 'spring-seed-cup',
      title: 'Grow a Bean in a Cup',
      summary: 'Plant a bean in a clear cup so your child can watch the roots and sprout grow.',
      ages: [3, 4, 5], areas: ['thinking', 'language'], seasons: ['spring'], type: 'outdoor', language: 'en',
      speechVideo: false, minutes: 15,
      materials: ['Clear cup', 'Paper towel', 'Dry beans', 'Water'],
      steps: ['Line the cup with a damp paper towel.', 'Tuck a bean between the towel and the cup.', 'Check each day and talk about changes.', 'Draw what you see each week.'],
      why: 'Watching and predicting is the beginning of scientific thinking.'
    },
    {
      id: 'calm-breathing',
      title: 'Smell the Flower, Blow the Candle',
      summary: 'A simple breathing game to help little ones calm down when feelings get big.',
      ages: [2, 3, 4, 5], areas: ['social'], seasons: ['any'], type: 'video', language: 'en',
      speechVideo: false, minutes: 3,
      materials: ['Nothing needed'],
      steps: ['Hold up a pretend flower and breathe in slowly.', 'Hold up a pretend candle and blow out slowly.', 'Repeat three times together.'],
      why: 'Slow breathing helps children’s bodies calm down so they can think again.'
    }
  ]
};
