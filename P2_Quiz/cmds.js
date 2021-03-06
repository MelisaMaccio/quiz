const {log, biglog, errorlog, colorize} = require("./out");
const model = require("./model");

/* ---------------Funciones auxiliares del switch--------------*/

/* Abre la ayuda */
exports.helpCmd = (rl) => {
  log('Comandos:');
  log(' h|help - Muestra esta ayuda');
  log(' list - Listar los quizzes exixtentes');
  log(' show <id> - Muestra la pregunta y la respuesta del quiz indicado');
  log(' add - Añade un nuevo quiz interactivamente');
  log(' delete <id> - Borra el quiz indicado');
  log(' edit <id> - Edita el quiz indicado');
  log(' test <id> - Prueba el quiz indicado');
  log(' p|play  Juega a preguntar aleatoriamente todos los quizzes');
  log(' credits - Créditos');
  log(' q|quit - Sale del programa');
  rl.prompt();
};

/* Sale del programa*/
exports.quitCmd = (rl) => {
  rl.close();
  rl.prompt();
};

/* Añade una pregunta*/
exports.addCmd = (rl) => {
  rl. question(colorize('Introduzca la pregunta: ', 'red'), question => {
    rl. question(colorize('Introduzca la respuesta: ', 'red'), answer => {
      model.add(question, answer);
      log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
      rl.prompt();
    });
  });
};

/* Lista las preguntas y respuestas*/
exports.listCmd = (rl) => {
    model.getAll().forEach((quiz, id) => {
    log(`[${colorize(id, 'magenta')}] : ${quiz.question}`);
  });
  rl.prompt();
};

/* Muestra el quiz*/
exports.showCmd = (rl, id) => {
    if (typeof id === "undefined") {
      errorlog(`Falta el parámetro id`);
    } else {
      try {
        const quiz = model.getByIndex(id);
        log(`[${colorize(id, 'magenta')}] : ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
      } catch(error) {
        errorlog(error.message);
      }
    }
   rl.prompt();
};

/* Prueba el quiz */
exports.testCmd = (rl, id) => {
  if (typeof id === "undefined") {
     errorlog(`Falta el parámetro id`);
     rl.prompt();
  } else {
    try {
      const quiz = model.getByIndex(id);
      rl.question(`${colorize(quiz.question, 'red')}: `, answer => {
        if (quiz.answer === answer){
          biglog('Correcto', 'green');
        } else {
          biglog('Incorrecto', 'red');
        }
        rl.prompt();
      });
    } catch(error) {
      errorlog(error.message);
      rl.prompt();
    }
  }
};

/* Juega*/
exports.playCmd = (rl) => {
  let score = 0;
  let toBeAns = [];
  //Meter ids en toBeAns
  for (i=0; i < model.getAll().length; i++) {
    toBeAns[i] = i;
  }
  const playOne = () => {
    if (toBeAns === null){
      log(`colorize('No quedan preguntas por responder', 'blue')`);
      log(`Tu resultado es ${colorize(score, 'magenta')}`);
      rl.prompt();
    } else {
      //Pregunta al azar dentro de toBeAns
      let id = Math.floor((Math.random()*model.getAll().length)+1);
      //Quitar id de toBeAns
      toBeAns[id] = null;
      //Pregunta de id
      const quiz = model.getByIndex(id);
      rl.question(`${colorize(quiz.question, 'red')}: `, answer => {
        if (quiz.answer === answer){
          biglog('Correcto', 'green');
          score++;
          playOne();
          rl.prompt();
        } else {
          biglog('Incorrecto', 'red');
          log(`Tu resultado es ${colorize(score, 'magenta')}`);
          rl.prompt();
        }
      });
    }
  }
  playOne();
  rl.prompt();
};

/* Edita quiz*/
exports.editCmd = (rl, id) => {
  if (typeof id === "undefined") {
     errorlog(`Falta el parámetro id`);
  } else {
    try {
      const quiz = model.getByIndex(id);
      process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
      rl.question(colorize('Introduzca la pregunta: ', 'red'), question => {
        process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
        rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
          model.update(id, question, answer);
          log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
          rl.prompt();
        });
      });
    } catch(error) {
      errorlog(error.message);
      rl.prompt();
    }
  }
};

/* Borra quiz*/
exports.deleteCmd = (rl, id) => {
  if (typeof id === "undefined") {
    errorlog(`Falta el parámetro id`);
    rl.prompt();
  } else {
    try {
      model.deleteByIndex(id);
    } catch(error) {
      errorlog(error.message);
    }
  }
  rl.prompt();
};

/* Saca los créditos*/
exports.creditsCmd = (rl) => {
  log("Autor de práctica");
  log("Melisa Anahí Maccio Parigino", 'green');
  rl.prompt();
};