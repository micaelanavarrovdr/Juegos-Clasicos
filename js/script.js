// Selección de elementos del DOM (HTML)
const board = document.getElementById('board');            // Tablero de juego
const scoreBoard = document.getElementById('scoreBoard');  // Panel de puntuación
const startButton = document.getElementById('start');      // Botón de inicio del juego
const gameOverSign = document.getElementById('gameOver');  // Indicador de fin del juego

// Configuración básica del juego
const boardSize = 10;  // Tamaño del tablero (10x10)
const gameSpeed = 100; // Velocidad del juego (milisegundos entre movimientos)
const squareTypes = {  // Tipos de casillas en el tablero
    emptySquare: 0,    // Casilla vacía
    snakeSquare: 1,    // Casilla ocupada por la serpiente
    foodSquare: 2      // Casilla con comida
};
const directions = {   // Direcciones de movimiento y sus valores
    ArrowUp: -10,      // Mover hacia arriba
    ArrowDown: 10,     // Mover hacia abajo
    ArrowRight: 1,     // Mover hacia la derecha
    ArrowLeft: -1      // Mover hacia la izquierda
};

// Variables de estado del juego
let snake;             // Array que representa la serpiente
let score;             // Puntuación actual
let direction;         // Dirección actual de la serpiente
let boardSquares;      // Array bidimensional que representa el tablero
let emptySquares;      // Array de casillas vacías en el tablero
let moveInterval;      // Intervalo que controla el movimiento de la serpiente
let gameInProgress = false; // Estado del juego (en curso o terminado)

// Dibuja la serpiente en el tablero
const drawSnake = () => {
  snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

// Función para dibujar una casilla en el tablero
const drawSquare = (square, type) => {
  const [row, column] = square.split('');                    // Obtiene las coordenadas de la casilla
  boardSquares[row][column] = squareTypes[type];             // Actualiza el tipo de casilla en el tablero
  const squareElement = document.getElementById(square);     // Selecciona el elemento en el DOM
  squareElement.setAttribute('class', `square ${type}`);     // Asigna la clase de CSS correspondiente

  if (type === 'emptySquare') {
      emptySquares.push(square);                             // Agrega la casilla a las vacías
  } else {
      if (emptySquares.indexOf(square) !== -1) {             // Si la casilla estaba en vacías, la elimina
          emptySquares.splice(emptySquares.indexOf(square), 1);
      }
  }
}

// Función para mover la serpiente en el tablero
const moveSnake = () => {
  const newSquare = String(
      Number(snake[snake.length - 1]) + directions[direction]  // Calcula la nueva posición
  ).padStart(2, '0');
  const [row, column] = newSquare.split('');

  // Revisa si el movimiento es válido; si no, termina el juego
  if (newSquare < 0 || 
      newSquare > boardSize * boardSize || 
      (direction === 'ArrowRight' && column == 0) || 
      (direction === 'ArrowLeft' && column == 9) || 
      boardSquares[row][column] === squareTypes.snakeSquare) {
      gameOver();
  } else {
      snake.push(newSquare);  // Agrega la nueva posición de la cabeza de la serpiente

      if (boardSquares[row][column] === squareTypes.foodSquare) {
          addFood();  // Si hay comida en la casilla, incrementa la puntuación y coloca nueva comida
      } else {
          const emptySquare = snake.shift(); // Remueve la cola de la serpiente
          drawSquare(emptySquare, 'emptySquare'); // Dibuja la casilla como vacía
      }
      drawSnake();
  }
}

// Función para incrementar la puntuación y añadir comida
const addFood = () => {
  score++;              // Aumenta la puntuación
  updateScore();        // Actualiza el panel de puntuación
  createRandomFood();   // Genera comida en una casilla aleatoria
}

// Finaliza el juego
const gameOver = () => {
  gameOverSign.style.display = 'block';   // Muestra el indicador de fin de juego
  clearInterval(moveInterval);            // Detiene el movimiento de la serpiente
  startButton.disabled = false;           // Habilita el botón de inicio
  gameInProgress = false;                 // Marca el juego como terminado
}

// Establece la dirección de la serpiente
const setDirection = newDirection => {
  direction = newDirection;
}

// Gestiona los eventos de teclado para cambiar la dirección
const directionEvent = key => {
  switch (key.code) {
      case 'ArrowUp':
          direction != 'ArrowDown' && setDirection(key.code); // Evita el movimiento contrario
          break;
      case 'ArrowDown':
          direction != 'ArrowUp' && setDirection(key.code);
          break;
      case 'ArrowLeft':
          direction != 'ArrowRight' && setDirection(key.code);
          break;
      case 'ArrowRight':
          direction != 'ArrowLeft' && setDirection(key.code);
          break;
  }
}

// Crea comida en una casilla vacía aleatoria
const createRandomFood = () => {
  const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, 'foodSquare');
}

// Actualiza la puntuación en el DOM
const updateScore = () => {
  scoreBoard.innerText = score;
}

// Crea el tablero inicial
const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
          const squareValue = `${rowIndex}${columnIndex}`;
          const squareElement = document.createElement('div');     // Crea un nuevo elemento div
          squareElement.setAttribute('class', 'square emptySquare'); // Asigna las clases de estilo
          squareElement.setAttribute('id', squareValue);             // Asigna un ID único
          board.appendChild(squareElement);                          // Agrega el div al tablero
          emptySquares.push(squareValue);                           // Agrega la casilla a las vacías
      });
  });
}

// Configura el juego antes de iniciar
const setGame = () => {
  snake = ['00', '01', '02', '03'];    // Posiciones iniciales de la serpiente
  score = snake.length;                // Puntuación inicial
  direction = 'ArrowRight';            // Dirección inicial de movimiento
  boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
  board.innerHTML = '';                // Limpia el contenido del tablero en el DOM
  emptySquares = [];                   // Reinicia las casillas vacías
  createBoard();                       // Genera el tablero en el DOM
  gameInProgress = true;               // Marca el juego como en progreso
}

// Inicia el juego
const startGame = () => {
  if (gameInProgress) return;  // No reiniciar si el juego ya está en progreso
  setGame();                          // Configura el juego
  gameOverSign.style.display = 'none'; // Oculta el mensaje de fin de juego
  startButton.disabled = true;         // Desactiva el botón de inicio
  drawSnake();                         // Dibuja la serpiente en el tablero
  updateScore();                       // Actualiza la puntuación en el panel
  createRandomFood();                  // Crea la primera comida en una casilla aleatoria
  document.addEventListener('keydown', directionEvent); // Escucha el teclado para cambiar de dirección
  moveInterval = setInterval(() => moveSnake(), gameSpeed); // Intervalo para mover la serpiente
}

// Evento para el botón de inicio
startButton.addEventListener('click', startGame);

// Evento para la barra espaciadora
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && !gameInProgress) {
    startGame(); // Solo reinicia si el juego ha terminado
  }
});
