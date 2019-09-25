import Constants from './utils/Constants';
import GameLogProcessor from './utils/GameLogProcessor';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import * as openurl from 'openurl';
import * as fs from 'fs';
import * as sleep from 'await-sleep';

const filePath: string = `${__dirname}\\files\\`;

// Instanciando o express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/view'));
app.set("view engine", "ejs");

// Instanciando o Multer como diskStorage e com as pastas e nomes dos respectivos arquivos
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    cb(null, Constants.fileNameDefault);
  }
});

let upload = multer({ storage });
// As rotas devem ser setadas após o multer

// GET - Rota onde terá a visão de upload do arquivo e visualização do processamento
app.get('/', (req, res) => {
  res.render(`${__dirname}\\view\\index.ejs`);
});

// POST - Rota para iniciar o processamento do arquivo games.log e enviar o arquivo processado games.json como retorno
app.post('/process', async (req, res) => {
  await GameLogProcessor.processFile(filePath);
  let gamesPath: string = `${filePath}\\output\\games.json`;
  
  // Só irá liberar a request se o arquivo tiver sido criado
  while (!fs.existsSync(gamesPath)) {
    await sleep(250);
  }

  res.sendFile(gamesPath);
});

// POST - Rota responsável por salvar o arquivo
app.post('/', upload.single('uploadFile'), (req, res) => {
  res.redirect('/');
});

// Iniciando o Express
app.listen(Constants.port, () => {
  console.log(`Server rodando na porta: ${Constants.port}`);
  console.log(`Website está disponível em: http://localhost:${Constants.port}`);

  // Abrindo o site automaticamente
  openurl.open(`http://localhost:${Constants.port}`, () => {
    console.log('Site aberto com sucesso!');
  });
});