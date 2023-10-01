const verificadorHorarios = (horarios) => {
  const array = [true, ""];

  for (let [key, value] of Object.entries(horarios)) {
    if (value) {
      let horario = value.split("/");
      if (horario.length !== 2) {
        (array[0] = false),
          (array[1] = `Digite o horario de ${key} corretamente`);
        break;
      }
      let horarioInicio = horario[0].split(":");
      let breakLoopMaior = false;
      for (let hora of horarioInicio) {
        if (isNaN(hora)) {
          (array[0] = false),
            (array[1] = `Digite numeros na horario inicial de ${key}`);
          breakLoopMaior = true;
          break;
        }
        if (hora.length !== 2) {
          (array[0] = false),
            (array[1] = `Digite o horario inicial de ${key} corretamente no formato HH:MM`);
          breakLoopMaior = true;
          break;
        }
      }

      if (breakLoopMaior) {
        break;
      }
      if (Number(horarioInicio[0]) > 24) {
        (array[0] = false),
          (array[1] = `Digite as horas do horario inicial de ${key} dentro de um valor de 0h a 24h`);
        break;
      }
      if (
        Number(horarioInicio[1]) % 15 !== 0 ||
        Number(horarioInicio[1]) > 59
      ) {
        (array[0] = false),
          (array[1] = `Digite os minutos horario inicial de ${key} de 15 a 15 min e menor que 60`);
        break;
      }
      if (Number(horarioInicio[0]) === 24 && Number(horarioInicio[1]) !== 0) {
        (array[0] = false),
          (array[1] = `Apenas é permito 00 minutos quando digitado 24h de ${key} no horario inicial`);
        break;
      }
      let horarioFinal = horario[1].split(":");

      for (let hora of horarioFinal) {
        if (isNaN(hora)) {
          (array[0] = false),
            (array[1] = `Digite numeros na horario final de ${key}`);
          breakLoopMaior = true;
          break;
        }
        if (hora.length !== 2) {
          (array[0] = false),
            (array[1] = `Digite o horario final de ${key} corretamente no formato MM`);
          breakLoopMaior = true;
          break;
        }
      }
      if (breakLoopMaior) {
        break;
      }
      if (Number(horarioFinal[0]) > 24) {
        (array[0] = false),
          (array[1] = `Digite as horas do horario final de ${key} dentro de um valor de 0h a 24h`);
        break;
      }
      if (Number(horarioFinal[1]) % 15 !== 0 || Number(horarioFinal[1]) > 59) {
        (array[0] = false),
          (array[1] = `Digite os minutos horario inicial de ${key} de 15 a 15 min e menor que 60`);
        break;
      }
      if (Number(horarioFinal[0]) === 24 && Number(horarioFinal[1]) !== 0) {
        (array[0] = false),
          (array[1] = `Apenas é permito 00 minutos quando digitado 24h de ${key} no horario final`);
        break;
      }
    }
  }

  return array;
};

module.exports = {
  verificadorHorarios,
};
